import React from 'react';
import BooksContainer from './BooksContainer';

const CurrentReads = () => {
  return (
    <div className="main-max-width mx-auto padding-x">
      <p className="font-semibold text-2xl max-sm:text-[16px] my-4 text-center">
        Current Reads
      </p>

      <BooksContainer />
    </div>
  );
};

export default CurrentReads;
