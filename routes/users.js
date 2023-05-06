import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/helpers.js';
import * as userController from '../controllers/users.js';
import * as helperFn from '../controllers/helpers.js';

const router = Router();

// Complete user profile
router.get('/complete-profile', ensureAuthenticated, (req, res) => {
    let user = { ...req.user.toJSON() };
    if (user.dob) {
        user.dob = helperFn.formatDate(user.dob);
    }
    if (req.user.isProfileComplete) {
        return res.redirect('/user/profile');
    }
    res.render('complete-profile', { user });
});

router.post('/complete-profile', ensureAuthenticated, userController.completeProfile);

// Redirect to user profile
router.get('/profile', ensureAuthenticated, userController.redirectToProfile);

// User Profile
router.get('/:username', ensureAuthenticated, userController.getProfile);

// Edit user profile
router.get('/:username/edit', ensureAuthenticated, userController.getProfile);

router.post('/:username/edit', ensureAuthenticated, userController.editUserProfile);

export default router;
