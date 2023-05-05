import { Router } from 'express';
import { ensureAuthenticated } from '../middleware.js';
import * as imageController from '../controllers/images.js';

const router = Router();

router.post('/upload', ensureAuthenticated, imageController.uploadProfilePicture);

export default router;