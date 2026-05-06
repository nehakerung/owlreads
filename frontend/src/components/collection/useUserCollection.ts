import { useEffect, useState } from 'react';
import { apiClient } from '@/services/api/client';
import type { Collection } from './types';

export function useUserCollection(user: { id: number } | null) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [fetching, setFetching] = useState(Boolean(user));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setCollection(null);
      setFetching(false);
      setError('');
      return;
    }

    let cancelled = false;
    setFetching(true);

    const load = async () => {
      try {
        const response = await apiClient.get<Collection>('/collection/');
        if (!cancelled) {
          setCollection(response.data);
          setError('');
        }
      } catch {
        if (!cancelled) setError('Failed to load collection');
      } finally {
        if (!cancelled) setFetching(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { collection, fetching, error };
}
