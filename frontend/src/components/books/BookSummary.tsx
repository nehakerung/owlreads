import React from 'react';

const BookSummary = () => {
  return (
    <div className="w-100 max-lg:w-full border border-gray-200 rounded-lg shadow-md bg-white px-8 py-6">
      <h2 className="font-semibold text-2xl text-gray-800 mb-6">
        BookShelf Summary
      </h2>

      <div className="w-full flex items-center justify-between py-2">
        <p className="text-gray-600 font-medium">Current Books reading:</p>
        <p className="text-gray-800 font-semibold">3</p>
      </div>

      <div className="w-full flex items-center justify-between py-2">
        <p className="text-gray-500 font-medium">Books Finished:</p>
        <p className="text-gray-800 font-semibold">5</p>
      </div>

      <hr className="my-4 border-gray-300" />

      <div className="w-full flex items-center justify-between py-2">
        <p className="text-lg font-semibold text-gray-800">Total Pages read:</p>
        <p className="text-lg font-bold text-black">1000</p>
      </div>
    </div>
  );
};

export default BookSummary;
