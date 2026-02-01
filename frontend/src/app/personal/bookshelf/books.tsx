import BookItemLong from "@/src/components/books/BookItemLong";
import React from "react";
import BookSummary from "@/src/components/books/BookSummary";

const Books = () => {
  const cartitems_count = 3;

  return (
    <div className="main-max-width padding-x mx-auto py-9">
      <h1 className="font-semibold text-2xl text-gray-800 mb-6">Books</h1>

      <div className="flex flex-wrap gap-6 lg:gap-8 justify-between w-full">
        <div className="w-150 max-lg:w-full border border-gray-200 shadow-sm rounded-lg bg-white overflow-hidden flex-1">
          <div className="max-h-150 overflow-y-auto px-6 py-4">
            <BookItemLong />
            <BookItemLong />
            <BookItemLong />
          </div>
        </div>
        {/* Cartitem */}

        <BookSummary />
      </div>
    </div>
  );
};

export default Books;
