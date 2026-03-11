import { Request, Response } from 'express';
import Feedback from '../models/feedback.model';
import { analyzeFeedback } from '../services/llm.service';
import { sendFeedbackNotification } from '../services/email.service';

export async function createFeedback(req: Request, res: Response): Promise<void> {
    try {
        const { title, description, submittedBy, teamEmail } = req.body;

        if (!title || !description || !submittedBy) {
            res.status(400).json({ error: 'title, description, and submittedBy are required' });
            return;
        }

        // Save to DB with default values first (fast response)
        const feedback = await Feedback.create({
            title,
            description,
            submittedBy,
        });

        // Run LLM analysis asynchronously and update
        try {
            const analysis = await analyzeFeedback(title, description);
            feedback.category = analysis.category;
            feedback.priority = analysis.priority;
            feedback.sentiment = analysis.sentiment;
            feedback.team = analysis.team;
            feedback.llmProcessed = true;
            await feedback.save();

            // Send email notification (non-blocking)
            sendFeedbackNotification(feedback, teamEmail).catch((err) =>
                console.error('[Email] Failed to send notification:', err)
            );
        } catch (llmError) {
            console.error('[Controller] LLM enrichment failed:', llmError);
            // Feedback is still saved — just without LLM enrichment
        }

        res.status(201).json(feedback);
    } catch (error) {
        console.error('[Controller] createFeedback error:', error);
        res.status(500).json({ error: 'Failed to create feedback' });
    }
}

export async function getFeedbacks(req: Request, res: Response): Promise<void> {
    try {
        const { search, category, priority, sentiment, team, status, page = '1', limit = '20' } = req.query;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (search) {
            // Use text index for efficient search across title, description, and submittedBy
            query.$text = { $search: search as string };
        }

        if (category) query.category = category;
        if (priority) query.priority = priority;
        if (sentiment) query.sentiment = sentiment;
        if (team) query.team = team;
        if (status) query.status = status;

        const pageNum = Math.max(1, parseInt(page as string, 10));
        const limitNum = Math.min(100, parseInt(limit as string, 10));
        const skip = (pageNum - 1) * limitNum;

        const [feedbacks, total] = await Promise.all([
            Feedback.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            Feedback.countDocuments(query),
        ]);

        res.json({
            data: feedbacks,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error('[Controller] getFeedbacks error:', error);
        res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
}

export async function getFeedbackById(req: Request, res: Response): Promise<void> {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            res.status(404).json({ error: 'Feedback not found' });
            return;
        }
        res.json(feedback);
    } catch (error) {
        console.error('[Controller] getFeedbackById error:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
}

export async function updateFeedbackStatus(req: Request, res: Response): Promise<void> {
    try {
        const { status } = req.body;
        if (!['Open', 'In Progress', 'Resolved'].includes(status)) {
            res.status(400).json({ error: 'Invalid status value' });
            return;
        }
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!feedback) {
            res.status(404).json({ error: 'Feedback not found' });
            return;
        }
        res.json(feedback);
    } catch (error) {
        console.error('[Controller] updateFeedbackStatus error:', error);
        res.status(500).json({ error: 'Failed to update feedback status' });
    }
}
