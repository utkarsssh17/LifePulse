import bodyParser from 'body-parser';
import flash from 'connect-flash';
import morgan from 'morgan';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exphbs from 'express-handlebars';
import express from 'express';
import { passport, GoogleStrategy } from './config/passport.js';
import User from './models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + '/public');
const partialsDir = __dirname + '/views/partials/';

export function addGlobalMiddlewares(app) {
    // Body parser middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Express json middleware
    app.use(express.json());

    // Public directory for static assets
    app.use('/public', staticDir);

    // Handlebars Middleware
    app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', partialsDir: partialsDir }));
    app.set('view engine', 'handlebars');

    // Connect flash middleware
    app.use(flash());

    // Log HTTP requests to console
    app.use(morgan('dev'));

    // Session middleware
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // Passport Strategies
    passport.use(GoogleStrategy);
}

export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // If user is authenticated, continue to the next middleware function
        return next();
    } else {
        // If user is not authenticated, redirect to the login page
        res.redirect('/auth/login');
    }
}
