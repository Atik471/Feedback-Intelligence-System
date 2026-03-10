import { Router } from 'express';
import {
    createFeedback,
    getFeedbacks,
    getFeedbackById,
    updateFeedbackStatus,
} from '../controllers/feedback.controller';

const router = Router();

// POST /api/feedbacks — Create a new feedback (LLM enrichment happens server-side)
router.post('/', createFeedback);

// GET /api/feedbacks — List all feedbacks (supports ?search=&category=&priority=&sentiment=&team=&status=)
router.get('/', getFeedbacks);

// GET /api/feedbacks/:id — Get a single feedback by ID
router.get('/:id', getFeedbackById);

// PATCH /api/feedbacks/:id/status — Update feedback status
router.patch('/:id/status', updateFeedbackStatus);

export default router;
