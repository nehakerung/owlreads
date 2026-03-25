'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import RequireAuth from '@/components/user/RequireAuth';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Pencil, Trash2, X } from 'lucide-react';

type Student = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
};

type Allocation = {
  entry_id: number;
  book_id: number;
  book_title: string;
  student_id: number;
  student_name: string;
  allocated_at: string | null;
  status: string;
  updated_at?: string | null;
};

function toDateTimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function TeacherAllocationsPage() {
  const { isTeacher } = useAuth();

  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const [editing, setEditing] = useState<Allocation | null>(null);
  const [draftStudentId, setDraftStudentId] = useState<number | ''>('');
  const [draftAllocatedAt, setDraftAllocatedAt] = useState<string>('');

  const getAuthHeaders = () => {
    const token = Cookies.get('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchStudents = async () => {
    const res = await axios.get(
      'http://localhost:8000/api/auth/students/list/',
      {
        headers: getAuthHeaders(),
      }
    );
    setStudents(res.data ?? []);
  };

  const fetchAllocations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:8000/api/allocations/', {
        headers: getAuthHeaders(),
        params: { q: query.trim() || undefined },
      });
      const list: Allocation[] = res.data?.allocations ?? [];
      // Client-side sort; server already uses newest-first.
      list.sort((a, b) => {
        const aTime = a.allocated_at ? new Date(a.allocated_at).getTime() : 0;
        const bTime = b.allocated_at ? new Date(b.allocated_at).getTime() : 0;
        return sort === 'newest' ? bTime - aTime : aTime - bTime;
      });
      setAllocations(list);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load allocations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isTeacher) return;
    fetchStudents().catch(() => {});
    fetchAllocations().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher]);

  useEffect(() => {
    if (!isTeacher) return;
    // When sort/query changes, re-fetch to keep server filtering correct.
    fetchAllocations().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sort, isTeacher]);

  useEffect(() => {
    if (!editing) return;
    setDraftStudentId(editing.student_id);
    setDraftAllocatedAt(
      editing.allocated_at
        ? toDateTimeLocal(editing.allocated_at)
        : toDateTimeLocal(new Date().toISOString())
    );
  }, [editing]);

  const submitEdit = async () => {
    if (!editing) return;
    if (draftStudentId === '') return;
    const allocated_at_iso = new Date(draftAllocatedAt).toISOString();

    await axios.patch(
      `http://localhost:8000/api/allocations/${editing.entry_id}/`,
      {
        student_id: draftStudentId,
        allocated_at: allocated_at_iso,
      },
      { headers: getAuthHeaders() }
    );

    setEditing(null);
    await fetchAllocations();
  };

  const submitDeallocate = async (entryId: number) => {
    const ok = window.confirm('Remove this allocation?');
    if (!ok) return;
    await axios.delete(`http://localhost:8000/api/allocations/${entryId}/`, {
      headers: getAuthHeaders(),
    });
    await fetchAllocations();
  };

  if (!isTeacher) {
    return (
      <RequireAuth>
        <div className="p-8 text-center">
          <p className="text-red-500">
            You are not authorized to view this page.
          </p>
          <Link
            href="/teacher"
            className="mt-4 text-sm text-gray-500 underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Allocations</h1>
          <Link href="/teacher" className="btnsecondary">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-card rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-2 items-center">
              <input
                className="input-field"
                placeholder="Search by book or student"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select
                className="input-field"
                value={sort}
                onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-semibold">{allocations.length}</span>{' '}
              allocations
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading allocations...</p>
        ) : allocations.length === 0 ? (
          <p className="text-gray-500">No allocations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-card rounded-lg shadow">
              <thead>
                <tr className="border-b border-input text-left">
                  <th className="px-4 py-3 text-sm font-semibold">Book</th>
                  <th className="px-4 py-3 text-sm font-semibold">Student</th>
                  <th className="px-4 py-3 text-sm font-semibold">
                    Allocated At
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((a) => (
                  <tr
                    key={a.entry_id}
                    className="border-b border-input hover:bg-muted transition"
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {a.book_title}
                    </td>
                    <td className="px-4 py-3 text-sm">{a.student_name}</td>
                    <td className="px-4 py-3 text-sm">
                      {a.allocated_at
                        ? new Date(a.allocated_at).toLocaleString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-muted-foreground">{a.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() => setEditing(a)}
                          className="text-blue-500 hover:underline inline-flex items-center gap-1"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => submitDeallocate(a.entry_id)}
                          className="text-red-500 hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editing && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={() => setEditing(null)}
          >
            <div
              className="bg-white p-6 rounded-2xl w-[32rem] max-h-[85vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Allocation</h3>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close edit modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Book</div>
                  <div className="font-medium">{editing.book_title}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Student
                  </label>
                  <select
                    className="input-field w-full"
                    value={draftStudentId}
                    onChange={(e) => setDraftStudentId(Number(e.target.value))}
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.first_name} {s.last_name} ({s.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Allocated date
                  </label>
                  <input
                    type="datetime-local"
                    className="input-field w-full"
                    value={draftAllocatedAt}
                    onChange={(e) => setDraftAllocatedAt(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    className="btnsecondary"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btnprimary"
                    onClick={submitEdit}
                    disabled={draftStudentId === '' || !draftAllocatedAt}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
