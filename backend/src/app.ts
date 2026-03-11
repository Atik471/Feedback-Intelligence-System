import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import feedbackRoutes from './routes/feedback.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/feedbacks', feedbackRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

export default app;
