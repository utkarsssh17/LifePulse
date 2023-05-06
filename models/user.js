import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    hash: String,
    salt: String,
    dob: Date,
    googleId: String,
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    profilePicture: String,
    bio: String,
    location: String,
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    eventIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
    reviewIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    commentIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.plugin(passportLocalMongoose, { usernameQueryFields: ["email"] });

const User = mongoose.model('User', userSchema);

export default User;
