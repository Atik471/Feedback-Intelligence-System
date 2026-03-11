import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Load env from backend directory
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback-intelligence';

const FeedbackSchema = new mongoose.Schema({
    title: String,
    description: String,
    submittedBy: String,
    category: { type: String, default: 'General' },
    priority: { type: String, default: 'Medium' },
    sentiment: { type: String, default: 'Neutral' },
    team: { type: String, default: 'Product' },
    status: { type: String, default: 'Open' },
    llmProcessed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

const sampleFeedbacks = [
    {
        title: "App crashes on login",
        description: "Whenever I try to log in using my Google account, the app shows a white screen and then crashes. This is happening consistently on Chrome mobile.",
        submittedBy: "john.doe@example.com",
        category: "Bug",
        priority: "Critical",
        sentiment: "Negative",
        team: "Frontend",
        status: "Open",
        llmProcessed: true
    },
    {
        title: "Request for Dark Mode in Dashboard",
        description: "The current dashboard is very bright. It would be great to have a dark mode option for late-night monitoring.",
        submittedBy: "creative.jane@design.co",
        category: "Feature Request",
        priority: "Low",
        sentiment: "Positive",
        team: "Design",
        status: "In Progress",
        llmProcessed: true
    },
    {
        title: "API response time is slow",
        description: "The /api/feedbacks endpoint is taking more than 2 seconds to respond when there are many items. We need to optimize the database queries.",
        submittedBy: "dev_ops_dan@infra.net",
        category: "Performance",
        priority: "High",
        sentiment: "Neutral",
        team: "Backend",
        status: "Open",
        llmProcessed: true
    },
    {
        title: "Font size is too small on mobile",
        description: "I find it difficult to read the feedback descriptions on my phone. Increasing the base font size would improve accessibility.",
        submittedBy: "user123@gmail.com",
        category: "UX",
        priority: "Medium",
        sentiment: "Neutral",
        team: "Design",
        status: "Open",
        llmProcessed: true
    },
    {
        title: "Security vulnerability in auth middleware",
        description: "I noticed that the auth token is being logged in the console during development. This could lead to a leak if not careful.",
        submittedBy: "sec_hero@vault.com",
        category: "Security",
        priority: "Critical",
        sentiment: "Negative",
        team: "Security",
        status: "Resolved",
        llmProcessed: true
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        await Feedback.insertMany(sampleFeedbacks);
        console.log('✅ Successfully added 5 sample feedbacks!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
