import passport from "passport";
import User from "../models/user.js";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import * as helperFn from '../controllers/helpers.js';

dotenv.config();

passport.use(User.createStrategy());

// For Google authentication
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            } else {
                const newUser = await User.create({
                    googleId: profile.id,
                    // Use random username for Google users, which they can change later
                    username: helperFn.generateUsername(profile.name.givenName, profile.name.familyName),
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                });
                return done(null, newUser);
            }
        } catch (err) {
            return done(err, null);
        }
    }
));

export { passport, GoogleStrategy };