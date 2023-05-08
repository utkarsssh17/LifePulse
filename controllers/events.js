import Event from "../models/event.js";
import User from "../models/user.js";
import * as imageController from "./images.js";
import * as helperFn from "./helpers.js";

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

        // Check if user is attending the event
        let userAttending = false;
        if (req.user) {
            const user = await User.findById(req.user.id).lean();
            if (user) {
                for (let i in user.eventIds) {
                    if (user.eventIds[i].toString() === event._id.toString()) {
                        userAttending = true;
                        break;
                    }
                }
            }
        }
        return res.render('event', { title: event.title, event, organizer, user: req.user, userAttending });
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
        if (event.attendees.length === event.maxCapacity) {
            return res.status(400).send({ errorMessage: "This event is already full." });
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

export { createEvent, getEventById, getAllEvents, rsvpEvent };