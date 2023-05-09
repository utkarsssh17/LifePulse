import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js";

// For users who used Google to sign up
const generateUsername = (firstName, lastName) => {
    const randomNum = Math.floor(Math.random() * 10000);
    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${randomNum}`;
    return username;
};

const randomizeFileName = (extension) => {
    return `${uuidv4()}${extension}`;
};

const isValidName = (name) => {
    if (!name) {
        throw new Error("Name cannot be empty.");
    }
    if (name.length < 2 || name.length > 20) {
        throw new Error("Name must be between 2 and 20 characters long.");
    }
    const regex = /^[a-zA-Z ]+$/;
    if (!regex.test(name)) {
        throw new Error("Name can only contain letters and spaces.");
    }
    return true;
};

const isValidUsername = (username) => {
    if (!username) {
        throw new Error("Username cannot be empty.");
    }
    if (username.length < 2) {
        throw new Error("Username must be at least 2 characters long.");
    }
    const regex = /^[a-zA-Z0-9_.]+$/;
    if (!regex.test(username)) {
        throw new Error("Username can only contain alphanumeric characters, underscores, and periods.");
    }
    return true;
};

const usernameExists = async (username) => {
    const user = await User.findOne({ username: username });
    if (user) {
        throw new Error("Username already exists.");
    }
    return false;
};

const isValidEmail = (email) => {
    if (!email) {
        throw new Error("Email cannot be empty.");
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        throw new Error("Invalid email address.");
    }
    return true;
};

const emailExists = async (email) => {
    const user = await User.findOne({ email: email });
    if (user) {
        throw new Error("Email already exists.");
    }
    return false;
};

const isValidPassword = (password) => {
    const errors = [];
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }
    if (!password.match(/[A-Z]/)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!password.match(/[a-z]/)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    if (!password.match(/\d/)) {
        errors.push("Password must contain at least one number.");
    }
    if (!password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
        errors.push("Password must contain at least one special character.");
    }
    return errors;
};

const passwordsMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
    }
    return true;
};

const isValidDOB = (dob) => {
    if (!dob) {
        throw new Error("Date of birth cannot be empty.");
    }
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 13) {
        throw new Error("You must be at least 13 years old to create an account.");
    }
};

const isValidBio = (bio) => {
    if (!bio) {
        throw new Error("Bio cannot be empty.");
    }
    if (bio.length > 500) {
        throw new Error("Bio cannot be more than 500 characters long.");
    }
    return true;
};

const trimRequestFields = () => {
    return (req, res, next) => {
        if (req.body) {
            for (let key in req.body) {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = req.body[key].trim();
                }
            }
        }
        next();
    }
};

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // If user is authenticated, continue to the next middleware function
        return next();
    } else {
        // If user is not authenticated, redirect to the login page
        return res.redirect('/auth/login');
    }
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
}

const validateRating = (rating) => {
    if (!rating) {
        throw new Error("Rating cannot be empty.");
    }
    if (isNaN(rating)) {
        throw new Error("Rating must be a number.");
    }
    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
    }
    return true;
}

const validateReview = (review) => {
    if (!review) {
        throw new Error("Review cannot be empty.");
    }
    if (typeof review !== 'string') {
        throw new Error("Review must be a string.");
    }
    if (review.length < 5) {
        throw new Error("Review must be at least 5 characters long.");
    }
    if (review.length > 500) {
        throw new Error("Review cannot be more than 500 characters long.");
    }
    return true;
}

const validateComment = (comment) => {
    if (!comment) {
        throw new Error("Comment cannot be empty.");
    }
    if (typeof comment !== 'string') {
        throw new Error("Comment must be a string.");
    }
    if (comment.length < 5) {
        throw new Error("Comment must be at least 5 characters long.");
    }
    if (comment.length > 500) {
        throw new Error("Comment cannot be more than 500 characters long.");
    }
    return true;
}

export { generateUsername, randomizeFileName, isValidName, isValidUsername, usernameExists, isValidEmail, emailExists, isValidPassword, passwordsMatch, isValidDOB, isValidBio, trimRequestFields, ensureAuthenticated, formatDate, validateRating, validateReview, validateComment };