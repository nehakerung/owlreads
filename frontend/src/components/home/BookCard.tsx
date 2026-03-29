import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/app/book/search/SearchContent.module.css';

interface Book {
  id: number;
  title: string;
  thumbnail: string;
  average_rating: number;
  ratings_count: number;
}

const BookCard = ({ book }: { book: Book }) => {
  return (
    <div className="w-50 rounded-lg shadow-md bg-card flex flex-col items-center gap-4 px-5 py-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="w-40 h-60 rounded-md overflow-hidden relative">
        <Image
          src={book.thumbnail || '/book.jpg'}
          className="object-cover"
          fill
          alt={book.title}
        />
      </div>

      {/* Title */}
      <Link href={`/book/${book.id}`} className={styles.titleLink}>
        <p className="text-center text-lg font-semibold">{book.title}</p>
      </Link>

      {/* Rating */}
      <div className="flex items-center">
        <svg
          className="w-5 h-5 text-fg-yellow"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
        </svg>

        <p className="ms-2 text-sm font-bold text-heading">
          {book.average_rating ?? 'N/A'}
        </p>

        <span className="w-1 h-1 mx-1 bg-neutral-quaternary rounded-full"></span>

        <span className="text-sm text-heading">
          {book.ratings_count ?? 0} reviews
        </span>
      </div>
    </div>
  );
};

export default BookCard;
