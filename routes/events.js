import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/helpers.js';
import * as eventController from '../controllers/events.js';
import * as helperFn from '../controllers/helpers.js';

const router = Router();

// Create new event
router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('create-event', { title: 'Create an Event', user: req.user });
});

router.post('/create', ensureAuthenticated, eventController.createEvent);

// Get event by id
router.get('/:id', eventController.getEventById);

export default router;