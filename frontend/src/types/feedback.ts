export type FeedbackCategory =
    | 'Bug'
    | 'Feature Request'
    | 'Performance'
    | 'UX'
    | 'Security'
    | 'General';

export type FeedbackPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type FeedbackSentiment = 'Positive' | 'Neutral' | 'Negative';
export type FeedbackTeam = 'Frontend' | 'Backend' | 'DevOps' | 'Design' | 'Product' | 'Security';
export type FeedbackStatus = 'Open' | 'In Progress' | 'Resolved';

export interface Feedback {
    _id: string;
    title: string;
    description: string;
    submittedBy: string;
    category: FeedbackCategory;
    priority: FeedbackPriority;
    sentiment: FeedbackSentiment;
    team: FeedbackTeam;
    status: FeedbackStatus;
    llmProcessed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FeedbackFilters {
    search?: string;
    category?: FeedbackCategory | '';
    priority?: FeedbackPriority | '';
    sentiment?: FeedbackSentiment | '';
    team?: FeedbackTeam | '';
    status?: FeedbackStatus | '';
}

export interface CreateFeedbackPayload {
    title: string;
    description: string;
    submittedBy: string;
    teamEmail?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}
