import { passport } from '../config/passport.js';
import * as userController from '../controllers/users.js';
import * as helperFn from './helpers.js';

const register = async (req, res) => {
    let { firstName, lastName, username, email, dob, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        req.flash("errorMessage", "All fields are required.");
        return res.render('register', { errorMessage: req.flash('errorMessage'), firstName, lastName, username, email });
    }
    if (password !== confirmPassword) {
        req.flash("errorMessage", "Passwords do not match.");
        return res.render('register', { errorMessage: req.flash('errorMessage'), firstName, lastName, username, email });
    }
    try {
        helperFn.isValidName(firstName);
        helperFn.isValidName(lastName);
        helperFn.isValidUsername(username);
        await helperFn.usernameExists(username);
        helperFn.isValidEmail(email);
        await helperFn.emailExists(email);
        helperFn.isValidDOB(dob);
        const passwordErrors = helperFn.isValidPassword(password);
        if (passwordErrors.length > 0) {
            const errorMessage = passwordErrors.join(" ");
            throw new Error(errorMessage);
        }
        helperFn.passwordsMatch(password, confirmPassword);
    } catch (error) {
        req.flash("errorMessage", error);
        dob = helperFn.formatDate(dob);
        return res.render('register', { errorMessage: req.flash('errorMessage'), firstName, lastName, username, email, dob });
    }
    // register user using usercontroller
    userController.registerUser(req, res);
};

const login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error(err);
            req.flash("errorMessage", "Oops! Something went wrong.");
            return res.render('login', { errorMessage: req.flash('errorMessage'), username: req.body.username });
        }

        if (!user) {
            req.flash("errorMessage", "The username/email or password you entered is incorrect.");
            return res.render('login', { errorMessage: req.flash('errorMessage'), username: req.body.username });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                req.flash("errorMessage", "Oops! Something went wrong.");
                return res.render('login', { errorMessage: req.flash('errorMessage'), username: req.body.username });
            }

            return res.redirect(`/user/${user.username}`);
        });
    })(req, res, next);
};

const loginGoogle = passport.authenticate('google', {
    scope: ['email', 'profile']
});

const loginGoogleCallback = passport.authenticate('google', {
    successRedirect: '/user/profile',
    failureRedirect: '/auth/login',
    failureFlash: true
});

const logout = (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");
    });
};

export {
    register,
    login,
    loginGoogle,
    loginGoogleCallback,
    logout
};
