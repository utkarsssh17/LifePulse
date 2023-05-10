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
    res.render('complete-profile', { user, title: "Complete Profile" });
});

router.post('/complete-profile', ensureAuthenticated, userController.completeProfile);

// Redirect to user profile
router.get('/profile', ensureAuthenticated, userController.redirectToProfile);

// User Profile
router.get('/:username', ensureAuthenticated, userController.getProfile);

// Edit user profile
router.get('/:username/edit', ensureAuthenticated, (req, res, next) => {
    if (req.user.username !== req.params.username) {
        return res.render("error", { title: "Forbidden", statusCode: 403, errorMessage: "You are not authorized to edit this profile.", user: req.user });
    } else {
        userController.getProfile(req, res, next);
    }
});

router.post('/:username/edit', ensureAuthenticated, (req, res, next) => {
    if (req.user.username !== req.params.username) {
        return res.render("error", { title: "Forbidden", statusCode: 403, errorMessage: "You are not authorized to edit this profile.", user: req.user });
    } else {
        userController.editUserProfile(req, res, next);
    }
});

export default router;
