import Event from "../models/event.js";
import User from "../models/user.js";
import * as helperFn from "./helpers.js";

// Update average rating
const updateAverageRating = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        const sumOfRatings = event.reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = +(sumOfRatings / event.reviews.length).toFixed(1);
        const formattedRating = averageRating.toString().replace(/\.0$/, '');

        event.averageRating = formattedRating;
        await event.save();
        return true
    } catch (error) {
        throw new Error(error.message);
    }
};

// Add review
const addReview = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).render("error", { title: "404 Event Not Found!", statusCode: 404, errorMessage: "The event you are trying to add review for does not exist.", user: req.user });
        }
        if (event.eventDate > new Date()) {
            return res.status(400).send({ errorMessage: "You cannot add a review to an event that has not yet happened." });
        }

        if (!req.user) {
            return res.status(400).send({ errorMessage: "You must be logged in to add a review." });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ errorMessage: "The user does not exist." });
        }

        // if user has already added a review
        if (event.reviews.some(review => review.userId.toString() === user.id.toString())) {
            return res.status(400).send({ errorMessage: "You have already added a review for this event. You can only edit or delete your existing review." });
        }

        const { reviewRating, reviewContent } = req.body;
        if (!reviewRating || !reviewContent) {
            return res.status(400).send({ errorMessage: "Please provide a rating and review content." });
        }

        helperFn.validateRating(reviewRating);
        helperFn.validateReview(reviewContent);

        const review = {
            userId: user.id,
            rating: reviewRating,
            reviewText: reviewContent,
        };

        event.reviews.push(review);
        await event.save();
        await updateAverageRating(req, res, next);

        const reviewId = event.reviews[event.reviews.length - 1].id;
        user.reviewIds.push(reviewId);
        await user.save();
        return res.status(200).send({ successMessage: "You have successfully added a review." });
    } catch (error) {
        return res.status(400).send({ errorMessage: error.message });
    }
};

// Edit review
const editReview = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).render("error", { title: "404 Event Not Found!", statusCode: 404, errorMessage: "The event you are trying to edit review for does not exist.", user: req.user });
        }
        const reviewId = req.params.reviewId;
        const review = event.reviews.find(review => review.id === reviewId);
        if (!review) {
            return res.status(404).send({ errorMessage: "The review does not exist." });
        }
        const user = await User.findById(req.user.id);
        if (!req.user) {
            return res.status(400).send({ errorMessage: "You must be logged in to edit a review." });
        }
        if (!user) {
            return res.status(404).send({ errorMessage: "The user does not exist." });
        }
        if (review.userId.toString() !== user.id.toString()) {
            return res.status(400).send({ errorMessage: "You can only edit your own reviews." });
        }

        const { reviewRating, reviewContent } = req.body;
        if (!reviewRating || !reviewContent) {
            return res.status(400).send({ errorMessage: "Please provide a rating and review content." });
        }

        helperFn.validateRating(reviewRating);
        helperFn.validateReview(reviewContent);

        review.rating = reviewRating;
        review.reviewText = reviewContent;
        review.updatedAt = new Date();
        await event.save();
        await updateAverageRating(req, res, next);
        return res.status(200).send({ successMessage: "You have successfully edited your review." });
    } catch (error) {
        return res.status(400).send({ errorMessage: error.message });
    }
};

// Delete review
const deleteReview = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).render("error", { title: "404 Event Not Found!", statusCode: 404, errorMessage: "The event you are trying to delete review for does not exist.", user: req.user });
        }
        const reviewId = req.params.reviewId;
        const review = event.reviews.find(review => review.id === reviewId);
        if (!review) {
            return res.status(404).send({ errorMessage: "The review does not exist." });
        }
        const user = await User.findById(req.user.id);
        if (!req.user) {
            return res.status(400).send({ errorMessage: "You must be logged in to delete a review." });
        }
        if (!user) {
            return res.status(404).send({ errorMessage: "The user does not exist." });
        }
        if (review.userId.toString() !== user.id.toString()) {
            return res.status(400).send({ errorMessage: "You can only delete your own reviews." });
        }

        event.reviews = event.reviews.filter(review => review.id !== reviewId);
        await event.save();
        await updateAverageRating(req, res, next);

        user.reviewIds = user.reviewIds.filter(review => review.id !== reviewId);
        await user.save();
        return res.status(200).send({ successMessage: "You have successfully deleted your review." });
    } catch (error) {
        return res.status(400).send({ errorMessage: error.message });
    }
};

export { addReview, editReview, deleteReview };