'use client';

import { useEffect, useState, type ReactNode } from 'react';
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
} from '@/services/api/shelf';
import { useAuth } from '@/context/AuthContext';
import styles from './ShelfButton.module.css';

const SHELF_OPTIONS: {
  value: ShelfStatus;
  label: string;
  icon: ReactNode;
}[] = [
  { value: 'to_read', label: 'To Read', icon: <Bookmark size={14} /> },
  { value: 'reading', label: 'Reading', icon: <BookOpen size={14} /> },
  { value: 'read', label: 'Read', icon: <BookCheck size={14} /> },
];

const STATUS_CLASSES: Record<ShelfStatus, string> = {
  to_read: styles.statusToRead,
  reading: styles.statusReading,
  read: styles.statusRead,
};

interface ShelfEntry {
  id: number;
  status: ShelfStatus;
}

function ShelfButtonRow({
  entryId,
  status,
  onStatusChange,
  onRemove,
}: {
  entryId: number;
  status: ShelfStatus;
  onStatusChange: (entryId: number, newStatus: ShelfStatus) => Promise<void>;
  onRemove: (entryId: number) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const handleSelect = async (newStatus: ShelfStatus) => {
    setSaving(true);
    setOpen(false);
    try {
      await onStatusChange(entryId, newStatus);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    setOpen(false);
    try {
      await onRemove(entryId);
    } finally {
      setSaving(false);
    }
  };

  const currentOption = SHELF_OPTIONS.find((o) => o.value === status);

  return (
    <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
      <button
        className={[
          styles.button,
          `${styles.buttonActive} ${STATUS_CLASSES[status]}`,
        ].join(' ')}
        onClick={() => setOpen((o) => !o)}
        disabled={saving}
        aria-haspopup="menu"
        aria-expanded={open}
        type="button"
      >
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          currentOption?.icon
        )}
        <span>{saving ? 'Saving…' : currentOption?.label}</span>
        <ChevronDown
          size={13}
          className={[styles.chevron, open ? styles.chevronOpen : ''].join(' ')}
        />
      </button>

      {open && (
        <div className={styles.dropdown} role="menu" aria-label="Move to shelf">
          <p className={styles.dropdownLabel}>Move to shelf</p>
          {SHELF_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={[
                styles.dropdownItem,
                status === opt.value ? styles.dropdownItemActive : '',
              ].join(' ')}
              onClick={() => handleSelect(opt.value)}
              role="menuitem"
              type="button"
            >
              {opt.icon}
              {opt.label}
              {status === opt.value && (
                <span className={styles.dropdownCheck}>✓</span>
              )}
            </button>
          ))}
          <div className={styles.dropdownDivider} />
          <button
            className={`${styles.dropdownItem} ${styles.dropdownItemRemove}`}
            onClick={handleRemove}
            role="menuitem"
            type="button"
          >
            Remove from shelf
          </button>
        </div>
      )}
    </div>
  );
}

type ShelfFilterButtonProps = {
  variant: 'filter';
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
};

type ShelfBookButtonProps = {
  bookId: number;
  variant?: 'book';
};

type ShelfRowButtonProps = {
  variant: 'row';
  entryId: number;
  status: ShelfStatus;
  onStatusChange: (entryId: number, newStatus: ShelfStatus) => Promise<void>;
  onRemove: (entryId: number) => Promise<void>;
};

type ShelfButtonProps =
  | ShelfFilterButtonProps
  | ShelfBookButtonProps
  | ShelfRowButtonProps;

function ShelfButtonBook({ bookId }: { bookId: number }) {
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
      <div className={`${styles.button} ${styles.buttonGhost}`}>
        <Loader2 size={14} className="animate-spin" />
      </div>
    );
  }

  const currentOption = SHELF_OPTIONS.find((o) => o.value === entry?.status);

  return (
    <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
      <button
        className={[
          styles.button,
          entry
            ? `${styles.buttonActive} ${STATUS_CLASSES[entry.status]}`
            : styles.buttonDefault,
        ].join(' ')}
        onClick={() => setOpen((o) => !o)}
        disabled={saving}
        aria-haspopup="menu"
        aria-expanded={open}
        type="button"
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
          className={[styles.chevron, open ? styles.chevronOpen : ''].join(' ')}
        />
      </button>

      {open && (
        <div className={styles.dropdown} role="menu" aria-label="Move to shelf">
          <p className={styles.dropdownLabel}>Move to shelf</p>
          {SHELF_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={[
                styles.dropdownItem,
                entry?.status === opt.value ? styles.dropdownItemActive : '',
              ].join(' ')}
              onClick={() => handleSelect(opt.value)}
              role="menuitem"
              type="button"
            >
              {opt.icon}
              {opt.label}
              {entry?.status === opt.value && (
                <span className={styles.dropdownCheck}>✓</span>
              )}
            </button>
          ))}
          {entry && (
            <>
              <div className={styles.dropdownDivider} />
              <button
                className={`${styles.dropdownItem} ${styles.dropdownItemRemove}`}
                onClick={handleRemove}
                role="menuitem"
                type="button"
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

export function ShelfButton(props: ShelfButtonProps) {
  if (props.variant === 'filter') {
    const { label, active, count, onClick } = props;

    return (
      <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          active
            ? 'secondary-active'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        type="button"
      >
        {label}
        {count ? <span className="ml-1.5 opacity-75">({count})</span> : null}
      </button>
    );
  }

  if (props.variant === 'row') {
    return (
      <ShelfButtonRow
        entryId={props.entryId}
        status={props.status}
        onStatusChange={props.onStatusChange}
        onRemove={props.onRemove}
      />
    );
  }

  return <ShelfButtonBook bookId={props.bookId} />;
}

export default ShelfButton;
