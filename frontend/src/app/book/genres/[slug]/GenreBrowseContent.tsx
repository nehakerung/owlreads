'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import GenrePage from '@/components/genre/GenrePage';
import Pagination from '@/components/pagination/pagination';
import { ShelfButton } from '@/components/bookshelf/ShelfButton';
import { resolveGenreFromSlug } from '@/lib/genreSlug';

import styles from '@/app/book/search/SearchContent.module.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

type Book = {
  id: number;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  genres?: string[];
};

async function fetchBooks(): Promise<Book[]> {
  const res = await fetch(`${API_BASE_URL}/books/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function BookItem({ book }: { book: Book }) {
  return (
    <div className={styles.resultCard}>
      {book.thumbnail && (
        <img
          src={book.thumbnail.replace('http:', 'https:')}
          alt={book.title}
          width={96}
          height={128}
          className={styles.thumbnail}
        />
      )}

      <div className="flex-1">
        <Link href={`/book/${book.id}`} className={styles.titleLink}>
          <h3 className={styles.resultTitle}>{book.title}</h3>
        </Link>

        {book.authors?.length > 0 && (
          <p className={styles.resultAuthors}>{book.authors.join(', ')}</p>
        )}
        <div className="bp-actions flex gap-3 flex-wrap">
          <ShelfButton bookId={Number(book.id)} />
        </div>

        {book.description && (
          <p className={styles.resultDescription}>{book.description}</p>
        )}
      </div>
    </div>
  );
}

export default function GenreBrowseContent() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = (params?.slug ?? '').toString();

  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBooks();
        setAllBooks(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load books';
        setError(message);
        setAllBooks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const genres = useMemo(() => {
    return Array.from(
      new Set(
        allBooks.flatMap((book) =>
          Array.isArray(book.genres) ? book.genres : []
        )
      )
    )
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [allBooks]);

  const genreName = useMemo(
    () => resolveGenreFromSlug(slug, genres),
    [slug, genres]
  );

  const books = useMemo(() => {
    if (!genreName) return [];
    return allBooks.filter((book) => book.genres?.includes(genreName));
  }, [allBooks, genreName]);

  const totalPages = Math.ceil(books.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [slug, genreName]);

  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = books.slice(start, start + itemsPerPage);

  return (
    <div className={`page-container ${styles.container}`}>
      <div className={styles.header}>
        <button
          type="button"
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className={styles.title}>{genreName ?? 'Genre'}</h1>

        {genreName ? (
          <p className={styles.queryLine}>
            Books tagged with <span>&quot;{genreName}&quot;</span>
          </p>
        ) : !loading && !error ? (
          <p className={styles.queryLine}>
            {genres.length > 0 ? (
              <>
                No genre matches <span>&quot;{slug}&quot;</span>
              </>
            ) : (
              'No genres available yet.'
            )}
          </p>
        ) : null}
      </div>

      {genres.length > 0 ? <GenrePage genres={genres} /> : null}

      {loading && (
        <>
          <div className={styles.stateLoading}>Loading books...</div>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.skeletonCard} aria-hidden="true">
              <div className={styles.skeletonGlow} />
              <div
                className={styles.skeletonBlock}
                style={{ width: 96, height: 128 }}
              />
              <div style={{ flex: 1 }}>
                <div
                  className={styles.skeletonBlock}
                  style={{ width: '60%', height: 16, marginBottom: 10 }}
                />
                <div
                  className={styles.skeletonBlock}
                  style={{ width: '80%', height: 12, marginBottom: 10 }}
                />
                <div
                  className={styles.skeletonBlock}
                  style={{ width: '70%', height: 12 }}
                />
              </div>
            </div>
          ))}
        </>
      )}

      {error ? <div className={styles.stateError}>{error}</div> : null}

      {!loading && !error && genreName && books.length === 0 ? (
        <div className={styles.stateEmpty}>No books in this genre yet.</div>
      ) : null}

      {!loading && !error && genreName && books.length > 0 ? (
        <>
          <div className={styles.resultsMeta}>{books.length} books</div>

          <div className={styles.resultsList}>
            {currentItems.map((book) => (
              <BookItem key={book.id} book={book} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
