import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import { Cpu, Plus, Mail, MessageSquare, AlertTriangle } from 'lucide-react';
import { getFeedbacks } from './services/api';
import type { Feedback, FeedbackFilters } from './types/feedback';
import { FeedbackCard } from './components/FeedbackCard';
import { SearchBar } from './components/SearchBar';
import { CreateFeedbackModal } from './components/CreateFeedbackModal';
import { FeedbackDetailModal } from './components/FeedbackDetailModal';

function App() {
  const [filters, setFilters] = useState<FeedbackFilters>({});
  const [showCreate, setShowCreate] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [teamEmail, setTeamEmail] = useState(() => {
    return localStorage.getItem('teamEmail') || '';
  });
  const [showEmailInput, setShowEmailInput] = useState(() => {
    return localStorage.getItem('showEmailInput') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('teamEmail', teamEmail);
  }, [teamEmail]);

  useEffect(() => {
    localStorage.setItem('showEmailInput', String(showEmailInput));
  }, [showEmailInput]);

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ['feedbacks', filters],
    queryFn: () => getFeedbacks(filters),
    placeholderData: (prev) => prev,
  });

  const handleFiltersChange = useCallback((newFilters: FeedbackFilters) => {
    setFilters(newFilters);
  }, []);

  const feedbacks = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  // Quick stats
  const criticalCount = feedbacks.filter((f) => f.priority === 'Critical').length;
  const openCount = feedbacks.filter((f) => f.status === 'Open').length;
  const negativeCount = feedbacks.filter((f) => f.sentiment === 'Negative').length;

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
          },
        }}
      />

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <div className="header-logo">
              <div className="header-logo-icon">
                <Cpu size={22} color="var(--accent)" />
              </div>
              <div>
                <h1>Feedback Intelligence</h1>
                <span>AI-powered feedback triage</span>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-primary"
                onClick={() => setShowCreate(true)}
                id="new-feedback-btn"
              >
                <Plus size={18} /> New Feedback
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>

        {/* Email notification banner */}
        {showEmailInput && (
          <div className="email-banner">
            <div className="email-banner-icon">
              <Mail size={24} />
            </div>
            <div className="email-banner-text">
              <h3>Enable Email Notifications</h3>
              <p>Team email to receive AI-routed feedback alerts.</p>
            </div>
            <div className="email-banner-actions">
              <input
                className="form-input"
                style={{ width: '240px' }}
                type="email"
                placeholder="team@company.com"
                value={teamEmail}
                onChange={(e) => setTeamEmail(e.target.value)}
                id="team-email-input"
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  toast.success(`Notifications enabled for ${teamEmail}`);
                  setShowEmailInput(false);
                }}
                disabled={!teamEmail.includes('@')}
              >
                Save
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowEmailInput(false)}
                id="dismiss-email-banner"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        {!isLoading && (
          <div className="stats-bar">
            <div className="stat-card">
              <span className="stat-number" style={{ color: 'var(--accent-hover)' }}>{total}</span>
              <span className="stat-label">Total Feedbacks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number" style={{ color: 'var(--info)' }}>{openCount}</span>
              <span className="stat-label">Open</span>
            </div>
            <div className="stat-card">
              <span className="stat-number" style={{ color: 'var(--priority-critical)' }}>{criticalCount}</span>
              <span className="stat-label">Critical Priority</span>
            </div>
            <div className="stat-card">
              <span className="stat-number" style={{ color: 'var(--sentiment-negative)' }}>{negativeCount}</span>
              <span className="stat-label">Negative Sentiment</span>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <SearchBar filters={filters} onFiltersChange={handleFiltersChange} totalCount={total} />

        {/* Feedback List */}
        {(isLoading && !isPlaceholderData) ? (
          <div className="spinner-wrap">
            <div className="spinner" />
          </div>
        ) : isError ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <AlertTriangle size={48} />
            </div>
            <h3>Failed to load feedbacks</h3>
            <p>Make sure the backend server is running on port 5000.</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <MessageSquare size={48} />
            </div>
            <h3>No feedbacks yet</h3>
            <p>Click "New Feedback" to submit the first one — AI will classify it instantly.</p>
          </div>
        ) : (
          <div className={`feedback-grid ${isLoading ? 'pulse' : ''}`}>
            {feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback._id}
                feedback={feedback}
                onClick={setSelectedFeedback}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreate && (
        <CreateFeedbackModal
          onClose={() => setShowCreate(false)}
          teamEmail={teamEmail || undefined}
        />
      )}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </div>
  );
}

export default App;
