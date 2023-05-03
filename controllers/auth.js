import { passport } from '../config/passport.js';
import User from '../models/user.js';

const register = (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    const newUser = new User({ firstName, lastName, username, email });
    User.register(newUser, password, (err) => {
        if (err) {
            console.error(err);
            return res.redirect('/auth/register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/user/profile');
        });
    });
};

const login =
    passport.authenticate('local', {
        successRedirect: '/user/profile',
        failureRedirect: '/auth/login',
        failureFlash: true
    });

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
