import axios from 'axios';
import type {
    Feedback,
    CreateFeedbackPayload,
    FeedbackFilters,
    PaginatedResponse,
} from '../types/feedback';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

export async function createFeedback(payload: CreateFeedbackPayload): Promise<Feedback> {
    const { data } = await api.post<Feedback>('/feedbacks', payload);
    return data;
}

export async function getFeedbacks(
    filters: FeedbackFilters = {},
    page = 1
): Promise<PaginatedResponse<Feedback>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.sentiment) params.set('sentiment', filters.sentiment);
    if (filters.team) params.set('team', filters.team);
    if (filters.status) params.set('status', filters.status);
    params.set('page', String(page));
    params.set('limit', '20');

    const { data } = await api.get<PaginatedResponse<Feedback>>(`/feedbacks?${params.toString()}`);
    return data;
}

export async function getFeedbackById(id: string): Promise<Feedback> {
    const { data } = await api.get<Feedback>(`/feedbacks/${id}`);
    return data;
}

export async function updateFeedbackStatus(
    id: string,
    status: Feedback['status']
): Promise<Feedback> {
    const { data } = await api.patch<Feedback>(`/feedbacks/${id}/status`, { status });
    return data;
}
