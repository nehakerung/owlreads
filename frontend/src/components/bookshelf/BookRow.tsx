'use client';

import Link from 'next/link';
import ShelfButton from '@/components/bookshelf/ShelfButton';

interface Book {
  id: number;
  google_books_id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  page_count: number | null;
  genres?: string[];
  average_rating: number | null;
}

interface ShelfEntry {
  id: number;
  book: Book;
  status: ShelfStatus;
  added_at: string;
  updated_at: string;
  allocated_at?: string | null;
}

type ShelfStatus = 'to_read' | 'reading' | 'read';

interface BookRowProps {
  entry: ShelfEntry;
  onStatusChange: (entryId: number, newStatus: ShelfStatus) => Promise<void>;
  onRemove: (entryId: number) => Promise<void>;
}

function BookRow({ entry, onStatusChange, onRemove }: BookRowProps) {
  const { book } = entry;

  return (
    <div className="flex items-center gap-4 p-4 book-item rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <img
        src={book.thumbnail || '/placeholder-book.png'}
        alt={book.title}
        className="w-12 h-16 object-cover rounded-md flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <Link href={`/book/${book.id}`}>
          <p className="font-semibold text-gray-900 truncate">{book.title}</p>
        </Link>

        <p className="text-sm text-gray-500 truncate">
          {book.authors?.join(', ')}
        </p>
        {book.average_rating && (
          <p className="text-xs text-amber-500 mt-0.5">
            ★ {book.average_rating}
          </p>
        )}
        {entry.allocated_at && (
          <p className="text-xs mt-0.5 inline-block rounded-full bg-purple-100 text-purple-700 px-2 py-0.5">
            Allocated date: {new Date(entry.allocated_at).toLocaleDateString()}
          </p>
        )}
      </div>

      <ShelfButton
        variant="row"
        entryId={entry.id}
        status={entry.status}
        onStatusChange={onStatusChange}
        onRemove={onRemove}
      />
    </div>
  );
}

export default BookRow;
