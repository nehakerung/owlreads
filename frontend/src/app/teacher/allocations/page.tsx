'use client';

import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import RequireAuth from '@/components/user/RequireAuth';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { X } from 'lucide-react';

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

type AllocationGroup = {
  book_id: number;
  book_title: string;
  allocations: Allocation[];
  sortTimeMs: number;
};

type StatusKey = 'not_started' | 'reading' | 'read';

const STATUS_META: Record<
  StatusKey,
  { label: string; pill: string; dot: string; sortRank: number }
> = {
  not_started: {
    label: 'Not Started',
    pill: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    sortRank: 0,
  },
  reading: {
    label: 'Reading',
    pill: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    sortRank: 1,
  },
  read: {
    label: 'Read',
    pill: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    sortRank: 2,
  },
};

function statusKeyFromShelfStatus(status: string): StatusKey {
  if (status === 'read') return 'read';
  if (status === 'reading') return 'reading';
  return 'not_started';
}

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

  const allocationGroups = useMemo<AllocationGroup[]>(() => {
    const map = new Map<number, AllocationGroup>();

    for (const a of allocations) {
      const timeMs = a.allocated_at ? new Date(a.allocated_at).getTime() : 0;
      const existing = map.get(a.book_id);
      if (!existing) {
        map.set(a.book_id, {
          book_id: a.book_id,
          book_title: a.book_title,
          allocations: [a],
          sortTimeMs: timeMs,
        });
      } else {
        existing.allocations.push(a);
        if (timeMs > existing.sortTimeMs) existing.sortTimeMs = timeMs;
      }
    }

    const groups = Array.from(map.values());

    for (const g of groups) {
      g.allocations.sort((a, b) => {
        const aStatus = STATUS_META[statusKeyFromShelfStatus(a.status)].sortRank;
        const bStatus = STATUS_META[statusKeyFromShelfStatus(b.status)].sortRank;
        if (aStatus !== bStatus) return aStatus - bStatus; // Not Started first
        const aTime = a.allocated_at ? new Date(a.allocated_at).getTime() : 0;
        const bTime = b.allocated_at ? new Date(b.allocated_at).getTime() : 0;
        return bTime - aTime; // newest first within same status
      });
    }

    groups.sort((a, b) => {
      return sort === 'newest'
        ? b.sortTimeMs - a.sortTimeMs
        : a.sortTimeMs - b.sortTimeMs;
    });

    return groups;
  }, [allocations, sort]);

  const overallStats = useMemo(() => {
    const total = allocations.length;
    let notStarted = 0;
    let reading = 0;
    let read = 0;

    for (const a of allocations) {
      const key = statusKeyFromShelfStatus(a.status);
      if (key === 'not_started') notStarted += 1;
      else if (key === 'reading') reading += 1;
      else read += 1;
    }

    const engaged = reading + read;
    const engagedPct = total > 0 ? Math.round((engaged / total) * 100) : 0;
    const readPct = total > 0 ? Math.round((read / total) * 100) : 0;

    return {
      total,
      notStarted,
      reading,
      read,
      engaged,
      engagedPct,
      readPct,
    };
  }, [allocations]);

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
              <span className="font-semibold">{allocationGroups.length}</span>{' '}
              books
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-input rounded-xl p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Engaged
            </div>
            <div className="mt-1 text-2xl font-bold">
              {overallStats.engaged}/{overallStats.total}
            </div>
            <div className="text-sm text-muted-foreground">
              {overallStats.engagedPct}% engaged (Reading or Read)
            </div>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${overallStats.engagedPct}%` }}
              />
            </div>
          </div>

          <div className="bg-white border border-input rounded-xl p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Not Started
            </div>
            <div className="mt-1 text-2xl font-bold">
              {overallStats.notStarted}/{overallStats.total}
            </div>
            <div className="text-sm text-muted-foreground">
              Students who haven’t moved it yet
            </div>
          </div>

          <div className="bg-white border border-input rounded-xl p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Reading
            </div>
            <div className="mt-1 text-2xl font-bold">
              {overallStats.reading}/{overallStats.total}
            </div>
            <div className="text-sm text-muted-foreground">
              {overallStats.reading} out of {overallStats.total} moved to Reading
            </div>
          </div>

          <div className="bg-white border border-input rounded-xl p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Read
            </div>
            <div className="mt-1 text-2xl font-bold">
              {overallStats.read}/{overallStats.total}
            </div>
            <div className="text-sm text-muted-foreground">
              {overallStats.readPct}% completed
            </div>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${overallStats.readPct}%` }}
              />
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
        ) : allocationGroups.length === 0 ? (
          <p className="text-gray-500">No allocations found.</p>
        ) : (
          <div className="space-y-4">
            {allocationGroups.map((g) => {
              const total = g.allocations.length;
              const notStarted = g.allocations.filter(
                (a) => statusKeyFromShelfStatus(a.status) === 'not_started'
              ).length;
              const reading = g.allocations.filter(
                (a) => statusKeyFromShelfStatus(a.status) === 'reading'
              ).length;
              const read = g.allocations.filter(
                (a) => statusKeyFromShelfStatus(a.status) === 'read'
              ).length;
              const engaged = reading + read;
              const engagedPct = total > 0 ? Math.round((engaged / total) * 100) : 0;

              return (
                <div
                  key={g.book_id}
                  className="bg-white border border-input rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-input">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">
                          Book allocation
                        </div>
                        <div className="text-lg font-semibold truncate">
                          {g.book_title}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                          <span>
                            <span className="font-semibold text-slate-900">
                              {engaged}/{total}
                            </span>{' '}
                            engaged
                          </span>
                          <span>
                            <span className="font-semibold text-slate-900">
                              {read}/{total}
                            </span>{' '}
                            completed
                          </span>
                          <span>
                            <span className="font-semibold text-slate-900">
                              {notStarted}/{total}
                            </span>{' '}
                            not started
                          </span>
                        </div>
                      </div>

                      <div className="w-full md:w-64">
                        <div className="text-xs text-muted-foreground mb-1">
                          Progress
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${engagedPct}%` }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {engagedPct}% engaged
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-700 border-slate-200">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        Not Started: {notStarted}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium bg-amber-50 text-amber-800 border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Reading: {reading}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium bg-emerald-50 text-emerald-800 border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Read: {read}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-input">
                    {g.allocations.map((a, idx) => {
                      const key = statusKeyFromShelfStatus(a.status);
                      const meta = STATUS_META[key];
                      const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60';

                      return (
                        <button
                          key={a.entry_id}
                          type="button"
                          onClick={() => setEditing(a)}
                          className={`w-full text-left px-5 py-3 ${rowBg} hover:bg-blue-50/40 transition`}
                          title="Click to manage this allocation"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-medium truncate text-slate-900">
                                {a.student_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {a.allocated_at
                                  ? `Allocated: ${new Date(
                                      a.allocated_at
                                    ).toLocaleString()}`
                                  : 'Allocated: —'}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${meta.pill}`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${meta.dot}`}
                                />
                                {meta.label}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Click to manage
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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

                <div className="flex items-center justify-between rounded-lg border border-input bg-white p-3">
                  <div>
                    <div className="text-sm font-medium">Student status</div>
                    <div className="text-xs text-muted-foreground">
                      This is based on the student’s shelf status for the book.
                    </div>
                  </div>
                  {(() => {
                    const meta =
                      STATUS_META[statusKeyFromShelfStatus(editing.status)];
                    return (
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${meta.pill}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                    );
                  })()}
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
                    className="btnsecondary text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => submitDeallocate(editing.entry_id)}
                  >
                    Remove allocation
                  </button>
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
