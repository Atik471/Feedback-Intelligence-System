import mongoose, { Document, Schema } from 'mongoose';

export type FeedbackCategory =
    | 'Bug'
    | 'Feature Request'
    | 'Performance'
    | 'UX'
    | 'Security'
    | 'General';

export type FeedbackPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type FeedbackSentiment = 'Positive' | 'Neutral' | 'Negative';

export type FeedbackTeam =
    | 'Frontend'
    | 'Backend'
    | 'DevOps'
    | 'Design'
    | 'Product'
    | 'Security';

export type FeedbackStatus = 'Open' | 'In Progress' | 'Resolved';

export interface IFeedback extends Document {
    title: string;
    description: string;
    submittedBy: string;
    category: FeedbackCategory;
    priority: FeedbackPriority;
    sentiment: FeedbackSentiment;
    team: FeedbackTeam;
    status: FeedbackStatus;
    llmProcessed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        submittedBy: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: ['Bug', 'Feature Request', 'Performance', 'UX', 'Security', 'General'],
            default: 'General',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Low',
        },
        sentiment: {
            type: String,
            enum: ['Positive', 'Neutral', 'Negative'],
            default: 'Neutral',
        },
        team: {
            type: String,
            enum: ['Frontend', 'Backend', 'DevOps', 'Design', 'Product', 'Security'],
            default: 'Product',
        },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved'],
            default: 'Open',
        },
        llmProcessed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Text index for full-text search
FeedbackSchema.index({ title: 'text', description: 'text', submittedBy: 'text' });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
