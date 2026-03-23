'use client';

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2, Users } from 'lucide-react';

interface AllocateButtonProps {
  bookId: number;
  selectedStudentIds: number[];
  onSuccess?: () => void;
}

export default function AllocateButton({
  bookId,
  selectedStudentIds,
  onSuccess,
}: AllocateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [lastAllocatedAt, setLastAllocatedAt] = useState<string | null>(null);

  const handleAllocate = async () => {
    if (selectedStudentIds.length === 0) return;

    setLoading(true);

    try {
      const token = Cookies.get('access_token');

      const response = await axios.post(
        'http://localhost:8000/api/shelf/allocate/',
        {
          book_id: bookId,
          student_ids: selectedStudentIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // assuming backend returns timestamp
      setLastAllocatedAt(response.data.allocated_at);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Allocation failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleAllocate}
        disabled={loading || selectedStudentIds.length === 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition 
        ${
          selectedStudentIds.length === 0
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Users size={16} />
        )}

        {loading
          ? 'Allocating...'
          : `Allocate to ${selectedStudentIds.length} student${
              selectedStudentIds.length !== 1 ? 's' : ''
            }`}
      </button>

      {lastAllocatedAt && (
        <span className="text-xs text-muted-foreground">
          Allocated on: {new Date(lastAllocatedAt).toLocaleString()}
        </span>
      )}
    </div>
  );
}
