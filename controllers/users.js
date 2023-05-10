import User from "../models/user.js";
import * as imageController from "./images.js";
import { passport } from '../config/passport.js';
import * as helperFn from "./helpers.js";

// Register new user
const registerUser = (req, res) => {
    let { firstName, lastName, username, email, dob, password } = req.body;
    const newUser = new User({ firstName, lastName, username, email, dob });
    User.register(newUser, password, (err) => {
        if (err) {
            console.error(err);
            newUser.dob = helperFn.formatDate(dob);
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
    if (req.user.isProfileComplete) {
        return res.redirect('/user/profile');
    }
    //if user has google account, email cannot be changed
    if (req.user.googleId) {
        req.body.email = req.user.email;
    }
    const { firstName, lastName, username, email, dob, location, bio } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !dob || !location || !bio) {
        req.flash("errorMessage", "All fields are required.");
        return res.status(400).render('complete-profile', { errorMessage: req.flash('errorMessage'), user: req.body });
    }

    try {
        helperFn.isValidName(firstName);
        helperFn.isValidName(lastName);
        // if username is same as previous, validations not required
        if (username !== req.user.username) {
            helperFn.isValidUsername(username);
            await helperFn.usernameExists(username);
        }
        // if email is same as previous, then validations not required
        if (email !== req.user.email) {
            helperFn.isValidEmail(email);
            await helperFn.emailExists(email);
        }
        helperFn.isValidDOB(dob);
        helperFn.isValidBio(bio);
        req.body.isProfileComplete = true;
        updateUserProfile(req, res, next);
        const userProfileUrl = `/user/${username}`;
        return res.redirect(userProfileUrl);
    } catch (error) {
        req.flash("errorMessage", error);
        return res.status(400).render('complete-profile', { errorMessage: req.flash('errorMessage'), user: req.body });
    }
};

// Redirect to user profile
const redirectToProfile = (req, res, next) => {
    try {
        const { username, isProfileComplete } = req.user;
        // if profile is not complete, redirect to complete profile page
        if (!isProfileComplete) {
            req.flash('errorMessage', 'Please complete your profile to continue.');
            return res.redirect('/user/complete-profile');
        }
        const userProfileUrl = `/user/${username}`;
        return res.redirect(userProfileUrl);
    } catch (error) {
        next(error);
    }
};

// Get User Profile
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username }).lean();
        if (!user) {
            return res.status(404).render("error", { title: "404 User Not Found!", statusCode: 404, errorMessage: "The user you are looking for does not exist.", user: req.user });
        }
        // If the profile is of other user than the currently logged in one, and if that profile is not complete, redirect to error page
        if (user.username !== req.user.username && !user.isProfileComplete) {
            return res.status(404).render("error", { title: "404 User Not Found!", statusCode: 404, errorMessage: "The user you are looking for does not exist.", user: req.user });
        }
        if (!user.isProfileComplete) {
            req.flash('errorMessage', 'Please complete your profile to continue.');
            return res.redirect('/user/complete-profile');
        }
        const signedProfilePictureUrl = await imageController.getSignedUrl(user.profilePicture);
        user.profilePicture = signedProfilePictureUrl;
        user.dob = helperFn.formatDate(user.dob);
        user.createdAt = helperFn.formatDate(user.createdAt);

        // If the profile is of other user than the currently logged in one, then hide the email and dob
        if (user.username !== req.user.username) {
            user.email = undefined;
            user.dob = undefined;
        }

        if (req.url === `/${user.username}`) {
            return res.render('profile', { user, currentUser: req.user.toJSON(), title: "Profile" });
        } else if (req.url === `/${user.username}/edit`) {
            return res.render('edit-profile', { user, title: "Edit Profile" });
        }
    } catch (error) {
        next(error);
    }
};

const updateUserProfile = async (req, res, next) => {
    const { firstName, lastName, username, email, dob, location, bio, isProfileComplete } = req.body;
    try {
        const user = await User.findById(req.user._id);
        user.firstName = firstName;
        user.lastName = lastName;
        // only update username if it is changed
        if (user.username !== username) {
            user.username = username;
        } else {
            user.username = user.username;
        }
        //if user has google account, email cannot be changed
        if (user.googleId) {
            user.email = user.email;
        } else {
            user.email = email;
        }
        user.dob = dob;
        user.location = location;
        user.bio = bio;
        user.isProfileComplete = isProfileComplete;
        await user.save();
    } catch (error) {
        next(error);
    }
};

// Edit user profile
const editUserProfile = async (req, res, next) => {
    //if user has google account, email cannot be changed
    if (req.user.googleId) {
        req.body.email = req.user.email;
    }

    const { firstName, lastName, username, email, dob, location, bio } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !dob || !location || !bio) {
        req.flash("errorMessage", "All fields are required.");
        return res.status(400).render('edit-profile', { errorMessage: req.flash('errorMessage'), user: req.body });
    }

    try {
        helperFn.isValidName(firstName);
        helperFn.isValidName(lastName);
        // if username is same as previous, then validations not required
        if (username !== req.user.username) {
            helperFn.isValidUsername(username);
            await helperFn.usernameExists(username);
        }
        // if user has registered through Google, then email cannot be changed
        if (req.user.googleId) {
            req.body.email = req.user.email;
        }
        // if email is same as previous, then validations not required
        if (email !== req.user.email) {
            helperFn.isValidEmail(email);
            await helperFn.emailExists(email);
        }
        helperFn.isValidDOB(dob);
        helperFn.isValidBio(bio);
        req.body.isProfileComplete = true;
        await updateUserProfile(req, res, next);
        const userProfileUrl = `/user/${username}`;
        return res.redirect(userProfileUrl);
    } catch (error) {
        req.flash("errorMessage", error);
        return res.status(400).render('edit-profile', { errorMessage: req.flash('errorMessage'), user: req.body });
    }
};

export { registerUser, completeProfile, getProfile, redirectToProfile, updateUserProfile, editUserProfile };