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
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizedGenres = useMemo(
    () => genres.map((g) => g.trim().toLowerCase()).filter(Boolean),
    [genres]
  );

  useEffect(() => {
    if (normalizedGenres.length === 0) {
      setSuggestedBooks([]);
      setLoading(false);
      return;
    }

    let active = true;

    const loadSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const genreParam = normalizedGenres.join(',');

        const res = await fetch(
          `${API_BASE_URL}/books/suggestions/?genres=${genreParam}&exclude=${currentBookId}&limit=${limit}`
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as Book[];

        if (active) setSuggestedBooks(data);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : 'Failed to load suggestions'
        );
        setSuggestedBooks([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSuggestions();

    return () => {
      active = false;
    };
  }, [currentBookId, limit, normalizedGenres]);

  if (normalizedGenres.length === 0) return null;

  return (
    <section className="main-max-width padding-x mx-auto pb-8 mt-10 border-t border-border pt-8">
      <h2 className="my-9 text-center text-xl font-bold">
        Similar books by genre
      </h2>

      {loading && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          Loading suggestions...
        </p>
      )}

      {error && (
        <p className="text-center text-sm text-destructive mt-2">{error}</p>
      )}

      {!loading && !error && suggestedBooks.length === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          No suggestions found for this genre yet.
        </p>
      )}

      {!loading && !error && suggestedBooks.length > 0 && (
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
      )}
    </section>
  );
}
