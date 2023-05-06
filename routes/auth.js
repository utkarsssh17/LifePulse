import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/helpers.js';
import * as authController from '../controllers/auth.js';

const router = Router();

// Register new user
router.get('/register', (req, res) => {
    // If user is authenticated, redirect to their profile page else render register page
    if (req.isAuthenticated()) {
        return res.redirect(`/user/${req.user.username}`);
    }
    res.render('register', { title: 'Register' });
});

router.post('/register', authController.register);

// Login with username/email and password
router.get('/login', (req, res) => {
    // If user is authenticated, redirect to their profile page else render login page
    if (req.isAuthenticated()) {
        return res.redirect(`/user/${req.user.username}`);
    }
    res.render('login', { title: 'Login' });
});

router.post('/login', authController.login);

// Logout current user
router.get('/logout', ensureAuthenticated, authController.logout);

// Login with Google
router.get('/google', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect(`/user/${req.user.username}`);
    }
    next();
}, authController.loginGoogle);

router.get('/google/callback', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect(`/user/${req.user.username}`);
    }
    next();
}, authController.loginGoogleCallback);

export default router;
