import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import GenrePage from '@/components/genre/GenrePage';

interface Book {
  id: number;
  title: string;
  thumbnail: string;
  average_rating: number;
  ratings_count: number;
  genres?: string[];
}

const BookSection = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/books/')
      .then((res) => res.json())
      .then((data) => setBooks(data))
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
        {books.slice(0, 10).map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {books.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground mt-2">
          No books to show yet.
        </p>
      ) : null}
    </section>
  );
};

export default BookSection;
