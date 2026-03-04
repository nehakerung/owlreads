'use client';

import { useEffect, useState } from 'react';
import { fetchShelf, updateShelfEntry, removeFromShelf } from '@/lib/api/shelf';

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
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <img
        src={book.thumbnail || '/placeholder-book.png'}
        alt={book.title}
        className="w-12 h-16 object-cover rounded-md flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{book.title}</p>
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
      >
        ✕
      </button>
    </div>
  );
}

// --- BookShelfPage ---
type FilterValue = ShelfStatus | 'all';

type StatusCounts = Partial<Record<ShelfStatus, number>>;

export default function BookShelfPage() {
  const [entries, setEntries] = useState<ShelfEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchShelf(activeFilter === 'all' ? '' : activeFilter);
      setEntries(res.data);
      setLoading(false);
    };
    load();
  }, [activeFilter]);

  const handleStatusChange = async (
    entryId: number,
    newStatus: ShelfStatus
  ): Promise<void> => {
    await updateShelfEntry(entryId, newStatus);
    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, status: newStatus } : e))
    );
  };

  const handleRemove = async (entryId: number): Promise<void> => {
    await removeFromShelf(entryId);
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  const counts = entries.reduce<StatusCounts>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});

  const allFilters: StatusOption[] = [
    { value: 'all', label: 'All' },
    ...STATUS_OPTIONS,
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookshelf</h1>

      <div className="flex gap-2 mb-6">
        {allFilters.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${
                activeFilter === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {opt.label}
            {opt.value !== 'all' && counts[opt.value as ShelfStatus] ? (
              <span className="ml-1.5 opacity-75">
                ({counts[opt.value as ShelfStatus]})
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-medium">No books here yet</p>
          <p className="text-sm mt-1">Find a book and add it to your shelf!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <BookRow
              key={entry.id}
              entry={entry}
              onStatusChange={handleStatusChange}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
