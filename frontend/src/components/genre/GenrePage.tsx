'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import GenreBtn from '@/components/genre/GenreBtn';
import { genreToSlug } from '@/lib/genreSlug';

type GenrePageProps = {
  genres?: string[];
};

function GenrePage({ genres = [] }: GenrePageProps) {
  const pathname = usePathname() ?? '';

  return (
    <div className="main-max-width mx-auto padding-x py-9">
      <p className="font-semibold text-center">Browse Books by Genre</p>

      <div className="flex-center flex-wrap my-6 gap-4">
        <GenreBtn label="All Genres" active={pathname === '/'} href="/" />
        {genres.map((genre) => {
          const href = `/book/genres/${genreToSlug(genre)}`;
          const active = pathname === href;
          return (
            <GenreBtn key={genre} label={genre} active={active} href={href} />
          );
        })}
      </div>
    </div>
  );
}

export default GenrePage;
