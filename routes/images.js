import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/helpers.js';
import * as imageController from '../controllers/images.js';

const router = Router();

// Upload profile picture
router.post('/upload', ensureAuthenticated, imageController.uploadProfilePicture);

// Upload event photos
router.post('/event/:eventId/upload', ensureAuthenticated, imageController.uploadEventPhotos);

export default router;