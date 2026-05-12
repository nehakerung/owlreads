'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import RequireAuth from '@/components/user/RequireAuth';
import { useAuth } from '@/context/AuthContext';
import { AllocationBookCard } from '@/features/allocations/components/AllocationBookCard';
import { AllocationEditModal } from '@/features/allocations/components/AllocationEditModal';
import { TeacherAllocationSummaryCards } from '@/features/allocations/components/TeacherAllocationSummaryCards';
import { useAllocationEditor } from '@/features/allocations/hooks/useAllocationEditor';
import { useTeacherAllocations } from '@/features/allocations/hooks/useTeacherAllocations';
import type { AllocationSortOrder } from '@/features/allocations/types';

export default function TeacherAllocationsPage() {
  const { isTeacher } = useAuth();

  const teacherAllocations = useTeacherAllocations(isTeacher);
  const allocationEditor = useAllocationEditor({
    reloadAllocations: teacherAllocations.reloadAllocations,
  });

  const [searchDraft, setSearchDraft] = useState(teacherAllocations.query);
  const setQueryRef = useRef(teacherAllocations.setQuery);
  setQueryRef.current = teacherAllocations.setQuery;

  useEffect(() => {
    const id = window.setTimeout(() => {
      setQueryRef.current(searchDraft);
    }, 350);
    return () => window.clearTimeout(id);
  }, [searchDraft]);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await teacherAllocations.reloadAllocations();
    } finally {
      setRefreshing(false);
    }
  };

  if (!isTeacher) {
    return (
      <RequireAuth>
        <div className="page-container">
          <div className="update-card rounded-lg p-8 text-center">
            <p className="font-medium text-destructive">
              You are not authorized to view this page.
            </p>
            <Link href="/teacher" className="btnsecondary mt-4 inline-block">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="page-container">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
          <h1 className="text-2xl font-bold text-foreground">
            Manage Allocations
          </h1>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              className="btnsecondary inline-flex items-center justify-center gap-2"
              onClick={() => void handleRefresh()}
              disabled={refreshing || teacherAllocations.loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                aria-hidden
              />
              Refresh
            </button>
            <Link href="/teacher" className="btnsecondary text-center">
              Dashboard
            </Link>
          </div>
        </div>
        <p className="mb-6 text-sm max-w-3xl text-muted-foreground">
          Books you have assigned appear grouped by title. Search by book name,
          student name, login, or roster ID. Open a row to reassign another
          learner, fix the assigned date, or remove the assignment. Summary
          numbers reflect the current filter.
        </p>

        <div className="bg-card rounded-lg p-4 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-1 flex-1 min-w-0 max-w-md">
              <label
                htmlFor="allocation-search"
                className="text-xs font-medium uppercase tracking-wide"
              >
                Search
              </label>
              <input
                id="allocation-search"
                type="search"
                placeholder="Book title, student name, @username, or roster ID"
                className="block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1 sm:gap-2">
              <label
                htmlFor="allocation-sort"
                className="text-xs font-medium uppercase tracking-wide"
              >
                Sort books
              </label>
              <select
                id="allocation-sort"
                className="block w-full max-w-[220px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={teacherAllocations.sortOrder}
                onChange={(event) =>
                  teacherAllocations.setSortOrder(
                    event.target.value as AllocationSortOrder
                  )
                }
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <p className="text-xs text-muted-foreground max-w-xs">
                Order uses the latest assignment time on each book.
              </p>
            </div>
            <div className="text-sm text-muted-foreground lg:text-right">
              <span className="font-semibold text-foreground">
                {teacherAllocations.allocationGroups.length}
              </span>{' '}
              book
              {teacherAllocations.allocationGroups.length === 1 ? '' : 's'}
              {teacherAllocations.query.trim() ? ' (filtered)' : ''}
            </div>
          </div>
        </div>

        <TeacherAllocationSummaryCards
          overallStats={teacherAllocations.overallStats}
        />

        {teacherAllocations.error && (
          <div
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive"
            role="alert"
          >
            {teacherAllocations.error}
          </div>
        )}

        {teacherAllocations.loading ? (
          <p className="text-muted-foreground">Loading allocations...</p>
        ) : teacherAllocations.allocationGroups.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-5 text-sm text-muted-foreground max-w-xl">
            <p className="font-medium text-foreground">No allocations yet</p>
            <p className="mt-2">
              Assign books from a book&apos;s page when you are logged in as a
              teacher, then return here to review progress.{' '}
              <Link href="/book/search" className="underline text-foreground">
                Browse books
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {teacherAllocations.allocationGroups.map((group) => (
              <AllocationBookCard
                key={group.book_id}
                group={group}
                onSelectAllocation={allocationEditor.startEditingAllocation}
              />
            ))}
          </div>
        )}

        {allocationEditor.editingAllocation && (
          <AllocationEditModal
            editingAllocation={allocationEditor.editingAllocation}
            students={teacherAllocations.students}
            draftStudentId={allocationEditor.draftStudentId}
            draftAllocatedAt={allocationEditor.draftAllocatedAt}
            onChangeDraftStudentId={allocationEditor.setDraftStudentId}
            onChangeDraftAllocatedAt={allocationEditor.setDraftAllocatedAt}
            onClose={allocationEditor.closeEditor}
            onSubmitEdit={allocationEditor.submitEdit}
            onSubmitDeallocate={allocationEditor.submitDeallocate}
          />
        )}
      </div>
    </RequireAuth>
  );
}
