'use client';

import { useEffect, useMemo, useState } from 'react';
import BookCard from '@/components/home/BookCard';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

type Book = {
  id: number;
  title: string;
  thumbnail: string;
  genres?: string[];
  average_rating?: number;
  ratings_count?: number;
};

type BookSuggestionProps = {
  currentBookId: number;
  genres?: string[];
  limit?: number;
};

export default function BookSuggestion({
  currentBookId,
  genres = [],
  limit = 10,
}: BookSuggestionProps) {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizedGenres = useMemo(
    () => genres.map((g) => g.trim().toLowerCase()).filter(Boolean),
    [genres]
  );

  useEffect(() => {
    let active = true;
    const loadBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/books/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Book[];
        if (active) setAllBooks(data);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load books');
        setAllBooks([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBooks();
    return () => {
      active = false;
    };
  }, []);

  const suggestedBooks = useMemo(() => {
    if (normalizedGenres.length === 0) return [];

    return allBooks
      .filter((book) => {
        if (book.id === currentBookId) return false;

        const bookGenres = (book.genres ?? [])
          .map((g) => g.trim().toLowerCase())
          .filter(Boolean);

        return bookGenres.some((g) => normalizedGenres.includes(g));
      })
      .slice(0, limit);
  }, [allBooks, currentBookId, limit, normalizedGenres]);

  if (normalizedGenres.length === 0) return null;

  return (
    <section className="main-max-width padding-x mx-auto pb-8 mt-10 border-t border-border pt-8">
      <h2 className="my-9 text-center text-xl font-bold">
        Similar books by genre
      </h2>

      {loading ? (
        <p className="text-center text-sm text-muted-foreground mt-2">
          Loading suggestions...
        </p>
      ) : null}

      {error ? (
        <p className="text-center text-sm text-destructive mt-2">{error}</p>
      ) : null}

      {!loading && !error && suggestedBooks.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground mt-2">
          No suggestions found for this genre yet.
        </p>
      ) : null}

      {!loading && !error && suggestedBooks.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {suggestedBooks.map((book) => {
            const normalizedBook = {
              ...book,
              average_rating: book.average_rating ?? 0,
              ratings_count: book.ratings_count ?? 0,
            };

            return <BookCard key={book.id} book={normalizedBook} />;
          })}
        </div>
      ) : null}
    </section>
  );
}
