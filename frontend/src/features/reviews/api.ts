import { apiClient } from '@/services/api/client';

export interface ReaderReview {
  id: number;
  book: number | null;
  name: string;
  role: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CreateReviewPayload {
  book: number;
  name: string;
  role: string;
  rating: number;
  comment: string;
}

export const fetchReaderReviews = (bookId: number) =>
  apiClient.get<ReaderReview[]>('/reviews/', {
    params: { book: bookId },
  });

export const createReaderReview = (payload: CreateReviewPayload) =>
  apiClient.post<ReaderReview>('/reviews/', payload);
