'use client';

import { useEffect, useState } from 'react';
import { fetchShelf, updateShelfEntry, removeFromShelf } from '@/lib/api/shelf';
import BookRow from '@/components/bookshelf/BookRow';

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
  allocated_at?: string | null;
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
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">My Bookshelf</h1>
      <div className="bg-card rounded-lg shadow p-6 mb-6">
        <p>
          {' '}
          Last updated:{' '}
          {entries.length > 0
            ? new Date(entries[0].updated_at).toLocaleDateString()
            : 'Never'}
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {allFilters.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${
                activeFilter === opt.value
                  ? 'secondary-active'
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
