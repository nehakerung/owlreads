// components/ShelfButton.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  BookMarked,
  BookOpen,
  BookCheck,
  Bookmark,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import {
  addToShelf,
  removeFromShelf,
  fetchShelf,
  ShelfStatus,
} from '@/lib/api/shelf';
import { useAuth } from '@/context/AuthContext';

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

interface ShelfEntry {
  id: number;
  status: ShelfStatus;
}

export function ShelfButton({ bookId }: { bookId: number }) {
  const { user } = useAuth();
  const [entry, setEntry] = useState<ShelfEntry | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      </div>
    );
  }

  const currentOption = SHELF_OPTIONS.find((o) => o.value === entry?.status);

  return (
    <div className="bp-shelf-wrapper" onClick={(e) => e.stopPropagation()}>
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

export default ShelfButton;
