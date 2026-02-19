import React from 'react';
import Card from './Card';
import BookCard from './BookCard';

const BookSection = () => {
  return (
    <section className="main-max-width padding-x mx-auto">
      <h2 className="my-9 text-center text-xl font-bold">
        Find featured books
      </h2>

      {/* Content */}
      <div className="flex justify-center flex-wrap gap-8">
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
      </div>
    </section>
  );
};

export default BookSection;
