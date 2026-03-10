import type { Feedback } from '../types/feedback';

interface BadgeProps {
    feedback: Feedback;
    className?: string;
}

function categoryBadgeClass(cat: string) {
    const map: Record<string, string> = {
        'Bug': 'badge-cat-bug',
        'Feature Request': 'badge-cat-feature',
        'Performance': 'badge-cat-performance',
        'UX': 'badge-cat-ux',
        'Security': 'badge-cat-security',
        'General': 'badge-cat-general',
    };
    return map[cat] || 'badge-cat-general';
}

function priorityBadgeClass(p: string) {
    return `badge-priority-${p.toLowerCase()}`;
}

function sentimentBadgeClass(s: string) {
    return `badge-sentiment-${s.toLowerCase()}`;
}

function priorityIcon(p: string) {
    const icons: Record<string, string> = { Critical: '🔴', High: '🟠', Medium: '🟡', Low: '🟢' };
    return icons[p] || '';
}

function sentimentIcon(s: string) {
    const icons: Record<string, string> = { Positive: '😊', Neutral: '😐', Negative: '😡' };
    return icons[s] || '';
}

export function CategoryBadge({ feedback }: BadgeProps) {
    return (
        <span className={`badge ${categoryBadgeClass(feedback.category)}`}>
            {feedback.category}
        </span>
    );
}

export function PriorityBadge({ feedback }: BadgeProps) {
    return (
        <span className={`badge ${priorityBadgeClass(feedback.priority)}`}>
            {priorityIcon(feedback.priority)} {feedback.priority}
        </span>
    );
}

export function SentimentBadge({ feedback }: BadgeProps) {
    return (
        <span className={`badge ${sentimentBadgeClass(feedback.sentiment)}`}>
            {sentimentIcon(feedback.sentiment)} {feedback.sentiment}
        </span>
    );
}

export function TeamBadge({ feedback }: BadgeProps) {
    return (
        <span className="badge badge-team">
            🏷 {feedback.team}
        </span>
    );
}

export function StatusBadge({ feedback }: BadgeProps) {
    const cls = feedback.status === 'Open'
        ? 'badge-status-open'
        : feedback.status === 'In Progress'
            ? 'badge-status-inprogress'
            : 'badge-status-resolved';
    return <span className={`badge ${cls}`}>{feedback.status}</span>;
}
