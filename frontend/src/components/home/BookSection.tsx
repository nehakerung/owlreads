import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';

interface Book {
  id: number;
  title: string;
  thumbnail: string;
  average_rating: number;
  ratings_count: number;
}

const BookSection = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/books/')
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="main-max-width padding-x mx-auto">
      <h2 className="my-9 text-center text-xl font-bold">
        Find featured books
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {books.slice(0, 10).map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default BookSection;
