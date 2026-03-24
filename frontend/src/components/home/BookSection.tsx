import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import GenrePage from '@/components/genre/GenrePage';

interface Book {
  id: number;
  title: string;
  thumbnail: string;
  average_rating: number;
  ratings_count: number;
  categories?: string[];
}

const BookSection = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    fetch('http://localhost:8000/api/books/')
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  }, []);

  const genres = Array.from(
    new Set(
      books.flatMap((book) =>
        Array.isArray(book.categories) ? book.categories : []
      )
    )
  )
    .filter(Boolean)
    .slice(0, 12);

  const filteredBooks =
    selectedGenre === 'All'
      ? books
      : books.filter((book) => book.categories?.includes(selectedGenre));

  return (
    <section className="main-max-width padding-x mx-auto pb-8">
      <GenrePage
        genres={genres}
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
      />

      <h2 className="my-9 text-center text-xl font-bold">
        {selectedGenre === 'All'
          ? 'Find featured books'
          : `Featured in ${selectedGenre}`}
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {filteredBooks.slice(0, 10).map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {filteredBooks.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground mt-2">
          No books found in this genre yet.
        </p>
      ) : null}
    </section>
  );
};

export default BookSection;
