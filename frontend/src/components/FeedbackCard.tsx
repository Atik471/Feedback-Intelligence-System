import type { Feedback } from '../types/feedback';
import { CategoryBadge, PriorityBadge, SentimentBadge, StatusBadge } from './Badge';

interface FeedbackCardProps {
    feedback: Feedback;
    onClick: (feedback: Feedback) => void;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function FeedbackCard({ feedback, onClick }: FeedbackCardProps) {
    return (
        <div className="feedback-card" onClick={() => onClick(feedback)}>
            <div className="card-header">
                <h3 className="card-title">{feedback.title}</h3>
                <StatusBadge feedback={feedback} />
            </div>

            <p className="card-description">{feedback.description}</p>

            <div className="card-badges">
                <CategoryBadge feedback={feedback} />
                <PriorityBadge feedback={feedback} />
                <SentimentBadge feedback={feedback} />
            </div>

            <div className="card-footer">
                <div className="card-submitter">
                    <div className="avatar">{getInitials(feedback.submittedBy)}</div>
                    {feedback.submittedBy}
                </div>
                <span className="card-date">{formatDate(feedback.createdAt)}</span>
            </div>
        </div>
    );
}
