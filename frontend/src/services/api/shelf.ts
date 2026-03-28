import { apiClient } from '@/services/api/client';

export type ShelfStatus = 'to_read' | 'reading' | 'read';

export const fetchShelf = (status = '') =>
  apiClient.get('/shelf/', {
    params: status ? { status } : {},
  });

export const addToShelf = (bookId: number, status: ShelfStatus) =>
  apiClient.post('/shelf/add/', {
    book_id: bookId,
    status,
  });

export const updateShelfEntry = (entryId: number, status: ShelfStatus) =>
  apiClient.patch(`/shelf/${entryId}/update/`, {
    status,
  });

export const removeFromShelf = (entryId: number) =>
  apiClient.delete(`/shelf/${entryId}/remove/`);
