import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Bot, X } from 'lucide-react';
import type { Feedback } from '../types/feedback';
import { CategoryBadge, PriorityBadge, SentimentBadge, TeamBadge, StatusBadge } from './Badge';
import { updateFeedbackStatus } from '../services/api';

interface FeedbackDetailModalProps {
    feedback: Feedback;
    onClose: () => void;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function FeedbackDetailModal({ feedback, onClose }: FeedbackDetailModalProps) {
    const queryClient = useQueryClient();
    const [selectedStatus, setSelectedStatus] = useState(feedback.status);

    const statusMutation = useMutation({
        mutationFn: (status: Feedback['status']) => updateFeedbackStatus(feedback._id, status),
        onSuccess: (updated) => {
            setSelectedStatus(updated.status);
            queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
            toast.success(`Status updated to "${updated.status}"`);
        },
        onError: () => toast.error('Failed to update status'),
    });

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as Feedback['status'];
        setSelectedStatus(newStatus);
        statusMutation.mutate(newStatus);
    };

    return (
        <div className="modal-overlay detail-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            <StatusBadge feedback={{ ...feedback, status: selectedStatus }} />
                            {feedback.llmProcessed && (
                                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)', gap: '6px' }}>
                                    <Bot size={12} /> AI Analyzed
                                </span>
                            )}
                        </div>
                        <h2 style={{ fontSize: '18px' }}>{feedback.title}</h2>
                    </div>
                    <button className="modal-close" onClick={onClose} id="close-detail-modal">
                        <X size={18} />
                    </button>
                </div>

                {/* Description */}
                <div className="detail-section">
                    <p className="form-label" style={{ marginBottom: '10px' }}>Description</p>
                    <p className="detail-description">{feedback.description}</p>
                </div>

                {/* AI Classification */}
                <div className="detail-section">
                    <p className="form-label" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bot size={16} /> AI Classification
                    </p>
                    <div className="detail-meta-grid">
                        <div className="detail-meta-item">
                            <div className="label">Category</div>
                            <CategoryBadge feedback={feedback} />
                        </div>
                        <div className="detail-meta-item">
                            <div className="label">Priority</div>
                            <PriorityBadge feedback={feedback} />
                        </div>
                        <div className="detail-meta-item">
                            <div className="label">Sentiment</div>
                            <SentimentBadge feedback={feedback} />
                        </div>
                        <div className="detail-meta-item">
                            <div className="label">Assigned Team</div>
                            <TeamBadge feedback={feedback} />
                        </div>
                    </div>
                </div>

                {/* Meta */}
                <div className="detail-section">
                    <div className="detail-meta-grid">
                        <div className="detail-meta-item">
                            <div className="label">Submitted By</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                                    {getInitials(feedback.submittedBy)}
                                </div>
                                <span style={{ fontSize: '14px' }}>{feedback.submittedBy}</span>
                            </div>
                        </div>
                        <div className="detail-meta-item">
                            <div className="label">Date</div>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                                {formatDate(feedback.createdAt)}
                            </span>
                        </div>
                        <div className="detail-meta-item">
                            <div className="label">Update Status</div>
                            <select
                                className="status-select"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                disabled={statusMutation.isPending}
                                id="update-status-select"
                                style={{ marginTop: '4px' }}
                            >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
