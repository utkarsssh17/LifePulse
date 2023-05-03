import { Router } from 'express';
import { ensureAuthenticated } from '../middleware.js';

import {
    login,
    logout,
    loginGoogle,
    loginGoogleCallback,
    register
} from '../controllers/auth.js';

const router = Router();

// Register new user
router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', register);

// Login with username/email and password
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', login);

// Logout current user
router.get('/logout', ensureAuthenticated, logout);

// Login with Google
router.get('/google', loginGoogle);
router.get('/google/callback', loginGoogleCallback);

export default router;
