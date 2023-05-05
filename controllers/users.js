import User from "../models/user.js";
import * as imageController from "./images.js";
import { passport } from '../config/passport.js';

// Register new user
const registerUser = (req, res) => {
    const { firstName, lastName, username, email, dob, password } = req.body;
    const newUser = new User({ firstName, lastName, username, email, dob });
    User.register(newUser, password, (err) => {
        if (err) {
            console.error(err);
            req.flash("errorMessage", "Oops! Something went wrong.");
            return res.redirect('/auth/register', { errorMessage: req.flash('errorMessage') }, newUser);
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/user/complete-profile');
        });
    });
};

// Complete user profile
const completeProfile = async (req, res, next) => {
    const { firstName, lastName, username, email, dob, location, bio } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !dob || !location) {
        const error = new Error('Please fill out all required fields.');
        error.statusCode = 400;
        return next(error);
    }

    // Validate date of birth (13 years and above)
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 13) {
        const error = new Error('You must be at least 13 years old to create an account.');
        error.statusCode = 400;
        return next(error);
    }

    try {
        const user = await User.findById(req.user._id);
        user.firstName = firstName;
        user.lastName = lastName;
        user.username = username;
        user.email = email;
        user.dob = dob;
        user.location = location;
        user.bio = bio;
        user.isProfileComplete = true;
        await user.save();
        const userProfileUrl = `/user/${username}`;
        res.redirect(userProfileUrl);
    } catch (error) {
        next(error);
    }
};

// Redirect to user profile
const redirectToProfile = (req, res, next) => {
    try {
        const { username, isProfileComplete } = req.user;
        // if profile is not complete, redirect to complete profile page
        if (!isProfileComplete) {
            return res.redirect('/user/complete-profile');
        }
        const userProfileUrl = `/user/${username}`;
        res.redirect(userProfileUrl);
    } catch (error) {
        next(error);
    }
};

// Get User Profile
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username }).lean();
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            return next(error);
        }
        if (!user.isProfileComplete) {
            return res.redirect('/user/complete-profile');
        }
        const signedProfilePictureUrl = await imageController.getSignedProfilePictureUrl(user.profilePicture);
        user.profilePicture = signedProfilePictureUrl;
        res.render('profile', { user });
    } catch (error) {
        next(error);
    }
};

export { registerUser, completeProfile, getProfile, redirectToProfile };