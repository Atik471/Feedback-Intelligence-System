import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback-intelligence';

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected:', MONGODB_URI);

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📋 API: http://localhost:${PORT}/api/feedbacks`);
            console.log(`❤️  Health: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
