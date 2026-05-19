'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchShelf } from '@/services/api/shelf';
import BookSuggestion from './BookSuggestion';
import {
  pickMostRecentReadBook,
  type ShelfEntry,
} from '../lib/pickMostRecentReadBook';
import styles from '@/features/books/styles/book-search.module.css';

/** Home-page suggestions based on the user's most recently read book. */
export default function RecentReadsSuggestions() {
  const { user, loading: authLoading } = useAuth();
  const [recentRead, setRecentRead] =
    useState<Awaited<ReturnType<typeof pickMostRecentReadBook>>>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !user) {
      setRecentRead(null);
      return;
    }

    let active = true;
    setLoading(true);

    fetchShelf('read')
      .then(async (res) => {
        if (!active) return;
        const entries = res.data as ShelfEntry[];
        const book = await pickMostRecentReadBook(entries);
        if (active) setRecentRead(book);
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
