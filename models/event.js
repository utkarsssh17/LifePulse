import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    commentText: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviewText: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const eventSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    displayPicture: String,
    photos: [String],
    category: [String],
    location: String,
    maxCapacity: {
        type: Number,
        min: 1,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    eventTime: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        min: 1,
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    averageRating: {
        type: Number,
        min: 0,
        max: 5,
    },
    reviews: [reviewSchema],
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
