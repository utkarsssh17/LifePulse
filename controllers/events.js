import Event from "../models/event.js";
import User from "../models/user.js";
import * as imageController from "./images.js";
import * as helperFn from "./helpers.js";

const eventCategories = ["Arts", "Business", "Charity & Causes", "Cooking", "Education", "Fashion", "Food & Drink", "Government", "Health", "Music", "Networking", "Party", "Science & Tech", "Sports", "Travel & Outdoor", "Other"];

const renderCreateEvent = (req, res) => {
    res.render("create-event", { title: "Create an Event", user: req.user, categories: eventCategories });
};

// Create new event
const createEvent = async (req, res, next) => {
    const { eventTitle, eventDescription, eventLocation, eventDate, eventTime, eventDuration, eventCategory, eventMaxCapacity } = req.body;
    const newEvent = new Event({
        title: eventTitle,
        description: eventDescription,
        location: eventLocation,
        eventDate: eventDate,
        eventTime: eventTime,
        duration: eventDuration,
        category: eventCategory,
        maxCapacity: eventMaxCapacity,
    });
    try {
        newEvent.organizerId = req.user.id;
        await newEvent.save();
        req.flash("successMessage", "Event created successfully.");
        return res.status(200).send({ eventId: newEvent._id, successMessage: req.flash("successMessage") });
    } catch (error) {
        return res.status(400).send({ errors: error.message });
    }
};

// Edit event
const renderEditEvent = async (req, res, next) => {
    const event = await Event.findById(req.params.id).lean();
    if (!event) {
        return res.status(404).render("error", { title: "404 Event Not Found!", statusCode: 404, errorMessage: "The event you are trying to modify does not exist.", user: req.user });
    }
    if (event.organizerId.toString() !== req.user.id.toString()) {
        return res.status(400).render("error", { title: "400 Bad Request", statusCode: 400, errorMessage: "You can only edit your own events.", user: req.user });
    }
    event.eventDate = helperFn.formatDate(event.eventDate);
    return res.render("edit-event", { title: "Edit Event", event, user: req.user, categories: eventCategories });
};

const editEvent = async (req, res, next) => {
    const { eventTitle, eventDescription, eventLocation, eventDate, eventTime, eventDuration, eventCategory, eventMaxCapacity } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({ errorMessage: "The event you are trying to modify does not exist." });
        }
        if (event.organizerId.toString() !== req.user.id.toString()) {
            return res.status(400).send({ errorMessage: "You can only edit your own events." });
        }

        event.title = eventTitle;
        event.description = eventDescription;
        event.eventLocation = eventLocation;
        event.eventDate = eventDate;
        event.eventTime = eventTime;
        event.duration = eventDuration;
        event.category = eventCategory;
        event.maxCapacity = eventMaxCapacity;
        await event.save();
        return res.status(200).send({ successMessage: "Event updated successfully." });
    } catch (error) {
        return res.status(400).send({ errors: error.message });
    }
};

// Delete event
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({ errorMessage: "The event you are trying to delete does not exist." });
        }
        if (event.organizerId.toString() !== req.user.id) {
            return res.status(403).send({ errorMessage: "You are not authorized to delete this event." });
        }
        // delete from database
        await Event.findByIdAndDelete(req.params.id);
        return res.status(200).send({ successMessage: "Event deleted successfully." });
    } catch (error) {
        return res.status(400).send({ errors: error.message });
    }
};

// Get event by id
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).lean();
        if (!event) {
            return res.status(404).render("error", { title: "404 Event Not Found!", statusCode: 404, errorMessage: "The event you are looking for does not exist.", user: req.user });
        }
        const signedEventImageUrls = [];
        for (let i = 0; i < event.photos.length; i++) {
            const signedEventImageUrl = await imageController.getSignedUrl(event.photos[i]);
            signedEventImageUrls.push(signedEventImageUrl);
        }
        event.photos = signedEventImageUrls;
        const signedDisplayPictureUrl = await imageController.getSignedUrl(event.displayPicture);
        event.displayPicture = signedDisplayPictureUrl;
        event.eventDate = helperFn.formatDate(event.eventDate);
        event.createdAt = helperFn.formatDate(event.createdAt);
        event.updatedAt = helperFn.formatDate(event.updatedAt);

        // Calculate remaining seats
        const remainingSeats = event.maxCapacity - event.attendees.length;
        event.remainingSeats = remainingSeats;

        // Get organizer details
        const organizer = await User.findById(event.organizerId).lean();

        // Get attendees details
        let isAttendee = false;
        if (event.attendees && event.attendees.length > 0) {
            for (let i = 0; i < event.attendees.length; i++) {
                const attendee = await User.findById(event.attendees[i]).lean();
                attendee.profilePicture = await imageController.getSignedUrl(attendee.profilePicture);
                event.attendees[i] = attendee;
                if (req.user) {
                    if (attendee._id.toString() === req.user.id.toString()) {
                        isAttendee = true;
                    }
                }
            }
        }

        // Get comments details
        if (event.comments && event.comments.length > 0) {
            for (let i = 0; i < event.comments.length; i++) {
                const comment = event.comments[i];
                const commenter = await User.findById(comment.userId).lean();
                if (commenter.profilePicture) {
                    comment.commenterProfilePicture = await imageController.getSignedUrl(commenter.profilePicture);
                }
                comment.commenterUserName = commenter.username;
                comment.commenterFirstName = commenter.firstName;
                comment.commenterLastName = commenter.lastName;
            }
        }

        // Get reviews details
        if (event.reviews && event.reviews.length > 0) {
            for (let i = 0; i < event.reviews.length; i++) {
                const review = event.reviews[i];
                const reviewer = await User.findById(review.userId).lean();
                if (req.user) {
                    if (reviewer._id.toString() === req.user.id.toString()) {
                    }
                }
                if (reviewer.profilePicture) {
                    review.reviewerProfilePicture = await imageController.getSignedUrl(reviewer.profilePicture);
                }
                review.reviewerUserName = reviewer.username;
                review.reviewerFirstName = reviewer.firstName;
                review.reviewerLastName = reviewer.lastName;
            }
        }

        event.isPastEvent = false;
        if (new Date(event.eventDate) < new Date()) {
            event.isPastEvent = true;
        }

        return res.render('event', { title: event.title, event, organizer, user: req.user ? req.user.toJSON() : null, isAttendee });
    } catch (error) {
        next(error);
    }
};

// Get all events
const getAllEvents = async () => {
    try {
        const events = await Event.find().lean();
        for (let i = 0; i < events.length; i++) {
            const signedEventImageUrl = await imageController.getSignedUrl(events[i].displayPicture);
            events[i].displayPicture = signedEventImageUrl;
        }
        return events;
    } catch (error) {
        next(error);
    }
};


// RSVP and cancel RSVP
const rsvpEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).render("error", { title: "404 Event Not Found!", statusCode: 404, errorMessage: "The event you are looking for does not exist.", user: req.user });
        }
        if (event.organizerId.toString() === req.user.id.toString()) {
            return res.status(400).send({ errorMessage: "You cannot RSVP to your own event." });
        }
        if (event.eventDate < new Date()) {
            return res.status(400).send({ errorMessage: "This event has already passed." });
        }
        if (!req.user) {
            return res.status(400).send({ errorMessage: "You must be logged in to RSVP to an event." });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ errorMessage: "The user does not exist." });
        }
        if (event.attendees.includes(user.id)) {
            event.attendees.pull(user.id);
            user.eventIds.pull(event.id);
            await event.save();
            await user.save();
            return res.status(200).send({ successMessage: "You have successfully cancelled your RSVP." });
        } else {
            if (event.attendees.length === event.maxCapacity) {
                return res.status(400).send({ errorMessage: "This event is already full." });
            }
            event.attendees.push(user.id);
            user.eventIds.push(event.id);
            await event.save();
            await user.save();
            return res.status(200).send({ successMessage: "You have successfully RSVP'd to this event." });
        }
    } catch (error) {
        return res.status(400).send({ errorMessage: error.message });
    }
};

export { renderCreateEvent, createEvent, renderEditEvent, editEvent, deleteEvent, getEventById, getAllEvents, rsvpEvent };