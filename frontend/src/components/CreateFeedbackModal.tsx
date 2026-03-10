import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createFeedback } from '../services/api';
import type { Feedback } from '../types/feedback';
import { CategoryBadge, PriorityBadge, SentimentBadge, TeamBadge } from './Badge';

interface CreateFeedbackModalProps {
    onClose: () => void;
    teamEmail?: string;
}

export function CreateFeedbackModal({ onClose, teamEmail }: CreateFeedbackModalProps) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({ title: '', description: '', submittedBy: '' });
    const [createdFeedback, setCreatedFeedback] = useState<Feedback | null>(null);

    const mutation = useMutation({
        mutationFn: () =>
            createFeedback({ ...form, teamEmail }),
        onSuccess: (data) => {
            setCreatedFeedback(data);
            queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
            toast.success('Feedback submitted! AI analysis complete ✨');
        },
        onError: () => {
            toast.error('Failed to submit feedback. Please try again.');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim() || !form.submittedBy.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        mutation.mutate();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <div>
                        <h2>✍️ New Feedback</h2>
                        <p>Describe your feedback — AI will auto-classify it</p>
                    </div>
                    <button className="modal-close" onClick={onClose} id="close-create-modal">✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {!createdFeedback ? (
                            <>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="feedback-title">Title *</label>
                                    <input
                                        id="feedback-title"
                                        name="title"
                                        className="form-input"
                                        placeholder="Short, descriptive title…"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="feedback-description">Description *</label>
                                    <textarea
                                        id="feedback-description"
                                        name="description"
                                        className="form-textarea"
                                        placeholder="Describe your feedback in detail. Be as specific as possible — the AI uses this to determine category, priority, and the right team."
                                        value={form.description}
                                        onChange={handleChange}
                                        required
                                    />
                                    <p className="form-hint">💡 Tip: Mention what's broken, what you expected, or what you'd love to see.</p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="feedback-submitter">Your Name *</label>
                                    <input
                                        id="feedback-submitter"
                                        name="submittedBy"
                                        className="form-input"
                                        placeholder="Your full name"
                                        value={form.submittedBy}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ marginBottom: '16px' }}>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                        {createdFeedback.title}
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        Submitted by {createdFeedback.submittedBy}
                                    </p>
                                </div>

                                <div className="ai-result">
                                    <div className="ai-result-header">
                                        <span>🤖</span> AI Analysis Results
                                    </div>
                                    <div className="ai-result-grid">
                                        <div className="ai-result-item">
                                            <span className="label">Category</span>
                                            <CategoryBadge feedback={createdFeedback} />
                                        </div>
                                        <div className="ai-result-item">
                                            <span className="label">Priority</span>
                                            <PriorityBadge feedback={createdFeedback} />
                                        </div>
                                        <div className="ai-result-item">
                                            <span className="label">Sentiment</span>
                                            <SentimentBadge feedback={createdFeedback} />
                                        </div>
                                        <div className="ai-result-item">
                                            <span className="label">Routed To</span>
                                            <TeamBadge feedback={createdFeedback} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose} id="cancel-create">
                            {createdFeedback ? 'Close' : 'Cancel'}
                        </button>
                        {!createdFeedback && (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={mutation.isPending}
                                id="submit-feedback"
                            >
                                {mutation.isPending ? (
                                    <>
                                        <span className="pulse">⚡</span> Analyzing…
                                    </>
                                ) : (
                                    <>✨ Submit & Analyze</>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
