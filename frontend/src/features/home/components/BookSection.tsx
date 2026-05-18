'use client';

import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import GenrePage from '@/features/genres/components/GenrePage';

interface Book {
  id: number;
  title: string;
  thumbnail: string;
  average_rating: number;
  ratings_count: number;
  genres?: string[];
}

const FEATURED_COUNT = 10;
import { API_BASE_URL } from '@/lib/config';

function shuffleBooks<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const BookSection = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/books/`)
      .then((res) => res.json())
      .then((data: Book[]) => {
        setBooks(data);
        setFeaturedBooks(shuffleBooks(data).slice(0, FEATURED_COUNT));
      })
      .catch((err) => console.error(err));
  }, []);

  const genres = Array.from(
    new Set(
      books.flatMap((book) => (Array.isArray(book.genres) ? book.genres : []))
    )
  )
    .filter(Boolean)
    .slice(0, 12);

  return (
    <section className="main-max-width padding-x mx-auto pb-8">
      <GenrePage genres={genres} />

      <h2 className="my-9 text-center text-xl font-bold">
        Find featured books
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {featuredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {featuredBooks.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground mt-2">
          No books to show yet.
        </p>
      ) : null}
    </section>
  );
};

export default BookSection;
