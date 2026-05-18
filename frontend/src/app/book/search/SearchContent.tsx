'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import Pagination from '@/components/pagination/pagination';
import { BookBrowseResultItem } from '@/components/books/BookBrowseResultItem';
import { BookListSkeleton } from '@/components/books/BookListSkeleton';
import { API_BASE_URL } from '@/lib/config';

import styles from './SearchContent.module.css';

type Book = {
  id: number;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
};

async function searchBooks(query: string, maxResults = 30): Promise<Book[]> {
  if (!query) return [];

  const url = `${API_BASE_URL}/books/?q=${encodeURIComponent(
    query
  )}&max_results=${maxResults}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(books.length / itemsPerPage);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);
      setCurrentPage(1);

      try {
        const data = await searchBooks(query);
        setBooks(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load books';
        setError(message);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = books.slice(start, start + itemsPerPage);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextQuery = searchQuery.trim();
    if (!nextQuery) return;
    router.push(`/book/search?query=${encodeURIComponent(nextQuery)}`);
  };

  return (
    <div className={`page-container ${styles.container}`}>
      <div className={styles.header}>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className={styles.title}>Search results</h1>

        {query ? (
          <p className={styles.queryLine}>
            Results for <span>&quot;{query}&quot;</span>
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className={styles.searchBar}>
          <input
            name="query"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            placeholder="Search for books..."
            autoComplete="off"
            aria-label="Search books"
          />
          <button
            type="submit"
            className={styles.searchButton}
            aria-label="Search"
          >
            <Search size={16} />
          </button>
        </form>
      </div>

      {loading ? (
        <BookListSkeleton loadingMessage="Searching books..." />
      ) : null}

      {error ? <div className={styles.stateError}>{error}</div> : null}

      {!loading && !error && books.length === 0 && query ? (
        <div className={styles.stateEmpty}>No books found.</div>
      ) : null}

      {!loading && !error && books.length > 0 ? (
        <>
          <div className={styles.resultsMeta}>{books.length} results</div>

          <div className={styles.resultsList}>
            {currentItems.map((book) => (
              <BookBrowseResultItem key={book.id} book={book} />
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
