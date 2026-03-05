'use client';

import { useState } from 'react';
import { addToShelf } from '@/lib/api/shelf';

const STATUS_OPTIONS = [
  { value: 'to_read', label: 'To Read' },
  { value: 'reading', label: 'Reading' },
  { value: 'read', label: 'Read' },
];

export default function AddToShelfButton({ bookId, currentStatus = null }) {
  const [status, setStatus] = useState(currentStatus);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (value) => {
    setLoading(true);
    setOpen(false);
    await addToShelf(bookId, value);
    setStatus(value);
    setLoading(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${
            status
              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading
          ? 'Saving...'
          : status
            ? `📚 ${status.replace('_', ' ')}`
            : '+ Add to Shelf'}
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                ${
                  status === opt.value
                    ? 'font-semibold text-indigo-600'
                    : 'text-gray-700'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
