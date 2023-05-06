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

        return res.render('event', { title: event.title, event, organizer, user: req.user });
    } catch (error) {
        next(error);
    }
};

export { createEvent, getEventById };