'use client';

import { useState } from 'react';
import Link from 'next/link';
interface Book {
  id: number;
  google_books_id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  page_count: number | null;
  categories: string[];
  average_rating: number | null;
}

interface ShelfEntry {
  id: number;
  book: Book;
  status: ShelfStatus;
  added_at: string;
  updated_at: string;
}

type ShelfStatus = 'to_read' | 'reading' | 'read';

interface StatusOption {
  value: ShelfStatus | 'all';
  label: string;
}

// --- Constants ---
const STATUS_OPTIONS: StatusOption[] = [
  { value: 'to_read', label: 'To Read' },
  { value: 'reading', label: 'Reading' },
  { value: 'read', label: 'Read' },
];

const STATUS_STYLES: Record<ShelfStatus, string> = {
  to_read: 'bg-blue-100 text-blue-700',
  reading: 'bg-yellow-100 text-yellow-700',
  read: 'bg-green-100 text-green-700',
};
// --- BookRow ---
interface BookRowProps {
  entry: ShelfEntry;
  onStatusChange: (entryId: number, newStatus: ShelfStatus) => Promise<void>;
  onRemove: (entryId: number) => Promise<void>;
}

function BookRow({ entry, onStatusChange, onRemove }: BookRowProps) {
  const { book } = entry;
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUpdating(true);
    await onStatusChange(entry.id, e.target.value as ShelfStatus);
    setUpdating(false);
  };

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
      </div>

      <select
        value={entry.status}
        onChange={handleStatusChange}
        disabled={updating}
        className={`text-sm font-medium rounded-full px-3 py-1.5 border-none outline-none cursor-pointer
          ${STATUS_STYLES[entry.status]} ${updating ? 'opacity-50' : ''}`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onRemove(entry.id)}
        className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
        title="Remove from shelf"
      ></button>
    </div>
  );
}
export default BookRow;
