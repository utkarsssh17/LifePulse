import bodyParser from 'body-parser';
import flash from 'connect-flash';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exphbs from 'express-handlebars';
import express from 'express';
import { passport, GoogleStrategy } from './config/passport.js';
import User from './models/user.js';
import dotenv from 'dotenv';
import * as helperFn from './controllers/helpers.js';
import moment from 'moment';
import helmet from 'helmet';

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

    const hbs = exphbs.create({});

    hbs.handlebars.registerHelper('eq', function (arg1, arg2) {
        return (arg1 === arg2);
    });

    hbs.handlebars.registerHelper('moment', function (date, format) {
        return moment(date).format(format);
    });
    hbs.handlebars.registerHelper('repeat', function (times, block) {
        return Array.from({ length: times }, (_, index) => block.fn(index)).join('');
    });

    hbs.handlebars.registerHelper('gte', function (arg1, arg2) {
        if (arg1 >= arg1) {
            return true;
        }
        return false;
    });

    // Connect flash middleware
    app.use(flash());

    // CORS middleware
    app.use(cors());

    // Helmet middleware
    app.use(helmet({
        contentSecurityPolicy: false,
    }));

    // Sanitize request data
    app.use(helperFn.sanitizeRequest());

    // Log HTTP requests to console
    app.use(morgan('dev'));

    // Session middleware
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }
    }));

    // Trim all incoming data
    app.use(helperFn.trimRequestFields());

    // configure flash messages
    app.use((req, res, next) => {
        res.locals.successMessage = req.flash('successMessage');
        res.locals.errorMessage = req.flash("errorMessage");
        res.locals.error = req.flash("error");
        res.locals.user = req.user || null;
        next();
    });

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Serialize and deserialize user
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    // Passport Strategies
    passport.use(GoogleStrategy);
}