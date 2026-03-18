'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import Pagination from '@/components/pagination/pagination';
import { ShelfButton } from '@/components/bookshelf/ShelfButton';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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

function BookItem({ book }: { book: Book }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl border hover:shadow-md transition bg-white">
      {book.thumbnail && (
        <img
          src={book.thumbnail.replace('http:', 'https:')}
          alt={book.title}
          width={96}
          height={128}
          className="rounded object-cover"
        />
      )}

      <div className="flex-1">
        <Link href={`/book/${book.id}`}>
          <h3 className="text-lg font-semibold hover:underline">
            {book.title}
          </h3>
        </Link>

        {book.authors?.length > 0 && (
          <p className="text-sm text-gray-600">{book.authors.join(', ')}</p>
        )}
        <ShelfButton bookId={book.id} />

        {book.description && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">
            {book.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(books.length / itemsPerPage);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);
      setCurrentPage(1);

      try {
        const data = await searchBooks(query);
        setBooks(data);
      } catch (err: any) {
        setError(err.message);
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

    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get('query') as string;

    if (newQuery.trim()) {
      router.push(`/book/search?query=${encodeURIComponent(newQuery)}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-3xl font-bold">Search results</h1>

        {query && (
          <p className="text-gray-600 mt-1">
            Results for <span className="font-medium">"{query}"</span>
          </p>
        )}
      </div>

      {/* States */}

      {loading && (
        <p className="text-center py-10 text-gray-600">Searching books...</p>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {!loading && !error && books.length === 0 && query && (
        <p className="text-center py-10 text-gray-600">No books found.</p>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <p className="mb-6 text-sm text-gray-500">{books.length} results</p>

          <div className="space-y-4">
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
      )}
    </div>
  );
}
