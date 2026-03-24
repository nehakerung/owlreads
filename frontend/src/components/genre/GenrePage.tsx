import React from 'react';
import GenreBtn from '@/components/genre/GenreBtn';

type GenrePageProps = {
  genres?: string[];
  selectedGenre?: string;
  onSelectGenre?: (genre: string) => void;
};

function GenrePage({
  genres = [],
  selectedGenre = 'All',
  onSelectGenre = () => {},
}: GenrePageProps) {
  return (
    <div className="main-max-width mx-auto padding-x py-9">
      <p className="font-semibold text-center">Browse Books by Genre</p>

      <div className="flex-center flex-wrap my-6 gap-4">
        <GenreBtn
          label="All Genres"
          active={selectedGenre === 'All'}
          onClick={() => onSelectGenre('All')}
        />
        {genres.map((genre) => (
          <GenreBtn
            key={genre}
            label={genre}
            active={selectedGenre === genre}
            onClick={() => onSelectGenre(genre)}
          />
        ))}
      </div>
    </div>
  );
}

export default GenrePage;
