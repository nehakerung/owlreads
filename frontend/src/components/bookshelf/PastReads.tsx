import React from 'react';
import BookCard from '../home/BookCard';
import BooksContainer from './BooksContainer';

const PastReads = () => {
  return (
    <section className="main-max-width padding-x mx-auto my-10">
      <h2 className="text-center text-2xl font-bold mt-2 mb-4 max-sm:text-[16px]">
        Books I have read
      </h2>
      <BooksContainer />
    </section>
  );
};

export default PastReads;
