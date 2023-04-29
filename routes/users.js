import { Router } from 'express';
import { ensureAuthenticated } from '../middleware.js';

const router = Router();

// Update user profile
router.put('/profile', ensureAuthenticated, (req, res) => {
    // TODO: Update user profile
    res.send('Update user profile');
});

// Delete user profile
router.delete('/profile', ensureAuthenticated, (req, res) => {
    // TODO: Delete user profile
    res.send('Delete user profile');
});

// User Profile
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', { user: req.user.toJSON() });
});

export default router;
