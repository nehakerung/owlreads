'use client';
import '@/styles/bp.css';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  User,
  BookMarked,
  BookCheck,
  Bookmark,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { addToShelf, removeFromShelf, fetchShelf } from '@/lib/api/shelf';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- Types ---
interface BookDetail {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  published_date: string;
  publisher?: string;
  page_count?: number;
  categories?: string[];
  preview_link?: string;
  average_rating?: number;
  ratings_count?: number;
}

type ShelfStatus = 'to_read' | 'reading' | 'read';

interface ShelfEntry {
  id: number;
  status: ShelfStatus;
}

const SHELF_OPTIONS: {
  value: ShelfStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: 'to_read', label: 'To Read', icon: <Bookmark size={14} /> },
  { value: 'reading', label: 'Reading', icon: <BookOpen size={14} /> },
  { value: 'read', label: 'Read', icon: <BookCheck size={14} /> },
];

const STATUS_STYLES: Record<ShelfStatus, string> = {
  to_read: 'bg-blue-50 text-blue-700 border-blue-200',
  reading: 'bg-amber-50 text-amber-700 border-amber-200',
  read: 'bg-green-50 text-green-700 border-green-200',
};

// --- Helpers ---
async function fetchBook(id: string): Promise<BookDetail> {
  const res = await fetch(`${API_BASE_URL}/books/${id}/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to fetch book (status ${res.status})`);
  return res.json();
}

// --- ShelfButton ---
interface ShelfButtonProps {
  bookId: number;
}

function ShelfButton({ bookId }: ShelfButtonProps) {
  const { user } = useAuth();
  const [entry, setEntry] = useState<ShelfEntry | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // On mount, check if this book is already on the user's shelf
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchShelf()
      .then((res) => {
        const existing = res.data.find(
          (e: { book: { id: number }; id: number; status: ShelfStatus }) =>
            e.book.id === bookId
        );
        if (existing) setEntry({ id: existing.id, status: existing.status });
      })
      .finally(() => setLoading(false));
  }, [bookId, user]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const handleSelect = async (status: ShelfStatus) => {
    setSaving(true);
    setOpen(false);
    try {
      const res = await addToShelf(bookId, status);
      setEntry({ id: res.data.id, status });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!entry) return;
    setSaving(true);
    setOpen(false);
    try {
      await removeFromShelf(entry.id);
      setEntry(null);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="bp-shelf-btn bp-shelf-btn--ghost">
        <Loader2 size={14} className="animate-spin" />
        <span>Loading…</span>
      </div>
    );
  }

  const currentOption = SHELF_OPTIONS.find((o) => o.value === entry?.status);

  return (
    <div className="bp-shelf-wrapper" onClick={(e) => e.stopPropagation()}>
      {/* Main button */}
      <button
        className={`bp-shelf-btn ${
          entry
            ? `bp-shelf-btn--active ${STATUS_STYLES[entry.status]}`
            : 'bp-shelf-btn--default'
        } ${saving ? 'opacity-60 pointer-events-none' : ''}`}
        onClick={() => setOpen((o) => !o)}
        disabled={saving}
      >
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : entry ? (
          currentOption?.icon
        ) : (
          <BookMarked size={14} />
        )}
        <span>
          {saving ? 'Saving…' : entry ? currentOption?.label : 'Add to Shelf'}
        </span>
        <ChevronDown
          size={13}
          className={`bp-shelf-chevron ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="bp-shelf-dropdown">
          <p className="bp-shelf-dropdown-label">Move to shelf</p>
          {SHELF_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`bp-shelf-dropdown-item ${
                entry?.status === opt.value
                  ? 'bp-shelf-dropdown-item--active'
                  : ''
              }`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.icon}
              {opt.label}
              {entry?.status === opt.value && (
                <span className="bp-shelf-dropdown-check">✓</span>
              )}
            </button>
          ))}

          {entry && (
            <>
              <div className="bp-shelf-dropdown-divider" />
              <button
                className="bp-shelf-dropdown-item bp-shelf-dropdown-item--remove"
                onClick={handleRemove}
              >
                Remove from shelf
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// --- StarRow ---
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="bp-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`bp-star ${
            i < Math.round(rating) ? 'bp-star--on' : 'bp-star--off'
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
          width={14}
          height={14}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// --- BookPage ---
export default function BookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.slug as string;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchBook(id)
      .then((data) => setBook(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading book details...</p>;
  if (error || !book)
    return <p className="error">Error loading book details: {error}</p>;

  const year = book.published_date ? book.published_date.slice(0, 4) : null;
  const hasCover = book.thumbnail && !imgFailed;
  const coverSrc = book.thumbnail?.replace('http:', 'https:');

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="center">
          <button className="btn-icon" onClick={() => router.back()}>
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to results
          </button>

          <div className="bp-hero">
            {/* Left: cover panel */}
            <div className="bp-cover-panel">
              <div className="bp-cover-frame">
                {hasCover ? (
                  <img
                    src={coverSrc}
                    alt={`Cover of ${book.title}`}
                    className="bp-cover-img"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="bp-cover-fallback">
                    <BookOpen size={48} strokeWidth={1} />
                    <span>No cover</span>
                  </div>
                )}
                <div className="bp-spine" />
              </div>

              {book.average_rating && (
                <div className="bp-rating-badge">
                  <StarRow rating={book.average_rating} />
                  <span className="bp-rating-num">
                    {book.average_rating.toFixed(1)}
                  </span>
                  {book.ratings_count && (
                    <span className="bp-rating-count">
                      {book.ratings_count.toLocaleString()} ratings
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: metadata */}
            <div className="bp-meta-panel">
              {book.categories && book.categories.length > 0 && (
                <div className="bp-chips">
                  {book.categories.slice(0, 3).map((c) => (
                    <span key={c} className="bp-chip">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="bp-title">{book.title}</h1>

              {book.authors?.length > 0 && (
                <p className="bp-authors">
                  <User size={14} strokeWidth={2} className="bp-icon" />
                  {book.authors.join(', ')}
                </p>
              )}

              <div className="bp-facts">
                {year && (
                  <span className="bp-fact">
                    <Calendar size={13} strokeWidth={2} />
                    {year}
                  </span>
                )}
                {book.publisher && (
                  <span className="bp-fact">
                    <BookOpen size={13} strokeWidth={2} />
                    {book.publisher}
                  </span>
                )}
                {book.page_count && (
                  <span className="bp-fact">
                    {book.page_count.toLocaleString()} pp.
                  </span>
                )}
              </div>

              {/* ── Shelf + Preview buttons ── */}
              <div className="bp-actions">
                <ShelfButton bookId={Number(book.id)} />
              </div>
            </div>
          </div>

          {book.description ? (
            <section className="bp-desc-section">
              <h2 className="bp-desc-heading">About this book</h2>
              <div
                className="bp-desc-body"
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            </section>
          ) : (
            <section className="bp-desc-section">
              <p className="bp-no-desc">
                No description available for this title.
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
