'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Users, Loader2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Student {
  id: number;
  username: string;
  full_name: string;
}

export default function AllocateButton({ bookId }: { bookId: number }) {
  const { isTeacher, user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [allocatedAt, setAllocatedAt] = useState<string | null>(null);

  const toggleStudent = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (students.length === 0) return;
    if (selected.length === students.length) {
      setSelected([]);
      return;
    }
    setSelected(students.map((student) => student.id));
  };

  useEffect(() => {
    if (!open || students.length > 0 || !isTeacher) return;

    const fetchStudents = async () => {
      setFetching(true);
      try {
        const token = Cookies.get('access_token');
        const res = await axios.get(
          'http://localhost:8000/api/auth/students/list/',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const mapped = (res.data ?? []).map(
          (student: {
            id: number;
            first_name?: string;
            last_name?: string;
            username: string;
          }) => ({
            id: student.id,
            username: student.username,
            full_name: `${student.first_name ?? ''} ${
              student.last_name ?? ''
            }`.trim(),
          })
        );
        setStudents(mapped);
      } catch (err) {
        console.error('Failed to fetch students', err);
      } finally {
        setFetching(false);
      }
    };

    fetchStudents();
  }, [open, students.length, isTeacher]);

  useEffect(() => {
    if (!open || !isTeacher) return;

    const fetchExistingAllocations = async () => {
      try {
        const token = Cookies.get('access_token');
        const res = await axios.get('http://localhost:8000/api/allocate/', {
          params: { book_id: bookId },
          headers: { Authorization: `Bearer ${token}` },
        });
        const ids: number[] = Array.isArray(res.data?.student_ids)
          ? res.data.student_ids
          : [];
        setSelected(ids);
      } catch (err) {
        console.error('Failed to fetch existing allocations', err);
      }
    };

    fetchExistingAllocations();
  }, [open, isTeacher, bookId]);

  const handleAllocate = async () => {
    if (selected.length === 0) return;

    setLoading(true);

    try {
      const token = Cookies.get('access_token');

      const res = await axios.post(
        'http://localhost:8000/api/allocate/',
        {
          book_id: bookId,
          student_ids: selected,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAllocatedAt(res.data.allocated_at);
      setSelected([]);
      setOpen(false);
    } catch (err) {
      console.error('Allocation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isTeacher) return null;

  const allSelected =
    students.length > 0 && selected.length === students.length;

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:shadow transition"
      >
        <Users size={16} />
        <span>
          {selected.length > 0 ? `${selected.length} selected` : 'Allocate'}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl w-[28rem] max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Allocate Book</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close allocate modal"
              >
                <X size={18} />
              </button>
            </div>

            {fetching ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin" size={18} />
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="mb-3 text-sm text-blue-700 hover:text-blue-800 font-medium"
                >
                  {allSelected ? 'Deselect all' : 'Select all'}
                </button>

                <div className="border rounded-lg max-h-64 overflow-y-auto p-2">
                  {students.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2">
                      No students available to allocate.
                    </p>
                  ) : (
                    students.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(student.id)}
                          onChange={() => toggleStudent(student.id)}
                        />
                        <span className="text-sm">
                          {student.full_name || student.username}
                        </span>
                      </label>
                    ))
                  )}
                </div>

                <button
                  onClick={handleAllocate}
                  disabled={loading || selected.length === 0}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" size={16} />
                  ) : (
                    `Allocate (${selected.length})`
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {allocatedAt && (
        <p className="text-xs text-muted-foreground mt-1">
          Allocated on {new Date(allocatedAt).toLocaleString()}
        </p>
      )}
    </>
  );
}
