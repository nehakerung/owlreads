import React from 'react';
import Link from 'next/link';
import PastReads from '@/components/bookshelf/PastReads';
import CurrentReads from '@/components/bookshelf/CurrentReads';
import ToRead from '@/components/bookshelf/ToRead';

const Bookshelf = () => {
  return (
    <section className="px-6 py-16 text-center main-max-width mx-auto padding-x">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          You haven't added any Books to your Bookshelf.
        </h1>
        <div>
          <CurrentReads />
          <ToRead />
          <PastReads />
        </div>

        <Link href="/" className="btnsecondary inline-block mt-6">
          Go back home
        </Link>
      </div>
    </section>
  );
};

export default Bookshelf;
