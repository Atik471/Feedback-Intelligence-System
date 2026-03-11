import { useState, useCallback, useEffect } from 'react';
import type { FeedbackFilters } from '../types/feedback';

interface SearchBarProps {
    filters: FeedbackFilters;
    onFiltersChange: (filters: FeedbackFilters) => void;
    totalCount: number;
}

export function SearchBar({ filters, onFiltersChange, totalCount }: SearchBarProps) {
    const [localSearch, setLocalSearch] = useState(filters.search || '');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearch(e.target.value);
    };

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== (filters.search || '')) {
                onFiltersChange({ ...filters, search: localSearch });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearch, onFiltersChange, filters]);

    // Update local state if filters cleared from parent
    useEffect(() => {
        setLocalSearch(filters.search || '');
    }, [filters.search]);

    const handleFilterChange = useCallback(
        (key: keyof FeedbackFilters) => (e: React.ChangeEvent<HTMLSelectElement>) => {
            onFiltersChange({ ...filters, [key]: e.target.value });
        },
        [filters, onFiltersChange]
    );

    const clearFilters = () => {
        setLocalSearch('');
        onFiltersChange({});
    };

    const hasActiveFilters =
        filters.search || filters.category || filters.priority || filters.sentiment || filters.team || filters.status;

    return (
        <div className="search-bar">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="search-input-wrap" style={{ flex: 1 }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search by title, description, or submitter…"
                        value={localSearch}
                        onChange={handleSearchChange}
                        id="search-input"
                    />
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {totalCount} result{totalCount !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="filters-row">
                <select
                    className="filter-select"
                    value={filters.category || ''}
                    onChange={handleFilterChange('category')}
                    id="filter-category"
                >
                    <option value="">All Categories</option>
                    <option>Bug</option>
                    <option>Feature Request</option>
                    <option>Performance</option>
                    <option>UX</option>
                    <option>Security</option>
                    <option>General</option>
                </select>

                <select
                    className="filter-select"
                    value={filters.priority || ''}
                    onChange={handleFilterChange('priority')}
                    id="filter-priority"
                >
                    <option value="">All Priorities</option>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>

                <select
                    className="filter-select"
                    value={filters.sentiment || ''}
                    onChange={handleFilterChange('sentiment')}
                    id="filter-sentiment"
                >
                    <option value="">All Sentiments</option>
                    <option>Positive</option>
                    <option>Neutral</option>
                    <option>Negative</option>
                </select>

                <select
                    className="filter-select"
                    value={filters.team || ''}
                    onChange={handleFilterChange('team')}
                    id="filter-team"
                >
                    <option value="">All Teams</option>
                    <option>Frontend</option>
                    <option>Backend</option>
                    <option>DevOps</option>
                    <option>Design</option>
                    <option>Product</option>
                    <option>Security</option>
                </select>

                <select
                    className="filter-select"
                    value={filters.status || ''}
                    onChange={handleFilterChange('status')}
                    id="filter-status"
                >
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>

                {hasActiveFilters && (
                    <button className="filter-clear" onClick={clearFilters} id="clear-filters">
                        ✕ Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}
