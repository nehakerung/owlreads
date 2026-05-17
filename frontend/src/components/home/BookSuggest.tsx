'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchShelf } from '@/services/api/shelf';
import BookSuggestion from '@/components/suggestions/BookSuggestion';
import styles from '@/app/book/search/SearchContent.module.css';

type ShelfBook = {
  id: number;
  title: string;
  genres?: string[];
};

type ShelfEntry = {
  book: ShelfBook;
  updated_at: string;
};

export default function BookSuggest() {
  const { user, loading: authLoading } = useAuth();
  const [recentRead, setRecentRead] = useState<ShelfBook | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !user) {
      setRecentRead(null);
      return;
    }

    let active = true;
    setLoading(true);

    fetchShelf('read')
      .then((res) => {
        if (!active) return;
        const entries = res.data as ShelfEntry[];
        if (entries.length === 0) {
          setRecentRead(null);
          return;
        }
        setRecentRead(entries[0].book);
      })
      .catch(() => {
        if (active) setRecentRead(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  if (authLoading || loading || !user || !recentRead) return null;

  const genres = recentRead.genres ?? [];
  if (genres.length === 0) return null;

  return (
    <BookSuggestion
      currentBookId={recentRead.id}
      genres={genres}
      heading={
        <>
          Because you read{' '}
          <Link href={`/book/${recentRead.id}`} className={styles.titleLink}>
            {recentRead.title}
          </Link>{' '}
          you may like:
        </>
      }
    />
  );
}
