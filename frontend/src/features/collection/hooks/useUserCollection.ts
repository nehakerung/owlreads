import { useEffect, useState } from 'react';
import { apiClient } from '@/services/api/client';
import type { Collection } from '../lib/types';

type UseUserCollectionOptions = {
  lookup?: string;
};

export function useUserCollection(
  user: { id: number } | null,
  options?: UseUserCollectionOptions
) {
  const lookup = options?.lookup;
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
        const url = lookup
          ? `/collection/users/${encodeURIComponent(lookup)}/`
          : '/collection/';
        const response = await apiClient.get<Collection>(url);
        if (!cancelled) {
          setCollection(response.data);
          setError('');
        }
      } catch {
        if (!cancelled) setError('Failed to load achievements');
      } finally {
        if (!cancelled) setFetching(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [lookup, user?.id]);

  return { collection, fetching, error };
}
