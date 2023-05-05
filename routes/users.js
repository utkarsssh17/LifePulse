import { Router } from 'express';
import { ensureAuthenticated } from '../middleware.js';
import * as userController from '../controllers/users.js';

const router = Router();

// Complete user profile
router.get('/complete-profile', ensureAuthenticated, (req, res) => {
    res.render('complete-profile', { user: req.user.toJSON() });
});

router.post('/complete-profile', ensureAuthenticated, userController.completeProfile);

// Update user profile
router.put('/profile', ensureAuthenticated, (req, res) => {
    // TODO: Update user profile
    res.send('Update user profile');
});

// Redirect to user profile
router.get('/profile', ensureAuthenticated, userController.redirectToProfile);

// User Profile
router.get('/:username', ensureAuthenticated, userController.getProfile);

export default router;
