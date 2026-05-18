'use client';

import Link from 'next/link';
import { BookRoleActions } from './BookRoleActions';
import styles from '@/app/book/search/SearchContent.module.css';

export type BrowseBook = {
  id: number;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
};

type BookBrowseResultItemProps = {
  book: BrowseBook;
};

export function BookBrowseResultItem({ book }: BookBrowseResultItemProps) {
  return (
    <div className={styles.resultCard}>
      {book.thumbnail ? (
        <img
          src={book.thumbnail.replace('http:', 'https:')}
          alt={book.title}
          width={96}
          height={128}
          className={styles.thumbnail}
        />
      ) : null}

      <div className="flex-1">
        <Link href={`/book/${book.id}`} className={styles.titleLink}>
          <h3 className={styles.resultTitle}>{book.title}</h3>
        </Link>

        {book.authors?.length > 0 ? (
          <p className={styles.resultAuthors}>{book.authors.join(', ')}</p>
        ) : null}

        <BookRoleActions bookId={Number(book.id)} />

        {book.description ? (
          <p className={styles.resultDescription}>{book.description}</p>
        ) : null}
      </div>
    </div>
  );
}
