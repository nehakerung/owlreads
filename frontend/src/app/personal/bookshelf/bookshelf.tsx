import React from 'react';
import Link from 'next/link';

const Bookshelf = () => {
  return (
    <section className="bg-gray-100 px-6 py-16 text-center main-max-width mx-auto padding-x">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight md:text-5xl">
          You haven't added any Books to your Bookshelf.
        </h1>

        <Link
          href="/"
          className="inline-block bg-black text-white text-lg font-medium px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all"
        >
          Go back home
        </Link>
      </div>
    </section>
  );
};

export default Bookshelf;
