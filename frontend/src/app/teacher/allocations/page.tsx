'use client';

import Link from 'next/link';

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Manage Allocations
          </h1>
          <Link href="/teacher" className="btnsecondary shrink-0 text-center">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-card rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-2 items-center">
              <select
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
            </div>
            <div className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-semibold">
                {teacherAllocations.allocationGroups.length}
              </span>{' '}
              books
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
          <p className="text-muted-foreground">No allocations found.</p>
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
