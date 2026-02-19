import React from 'react';
import BookCard from '../home/BookCard';

const ShelfContainer = () => {
  return (
    <div className="w-full h-100 overflow-x-auto px-6 flex gap-6 rounded-md">
      <BookCard />
      <BookCard />
      <BookCard />
      <BookCard />
      <BookCard />
    </div>
  );
};

export default ShelfContainer;
