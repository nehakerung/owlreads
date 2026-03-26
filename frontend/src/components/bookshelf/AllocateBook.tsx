'use client';

import { Users } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { AllocateBookModal } from '@/features/allocations/components/AllocateBookModal';
import { useAllocateBookModal } from '@/features/allocations/hooks/useAllocateBookModal';

export default function AllocateBookButton({ bookId }: { bookId: number }) {
  const { isTeacher, user } = useAuth();

  const allocateModal = useAllocateBookModal({ bookId, isTeacher });

  if (!user || !isTeacher) return null;

  return (
    <>
      <button
        onClick={() => allocateModal.setIsModalOpen((open) => !open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:shadow transition"
      >
        <Users size={16} />
        <span>
          {allocateModal.selectedStudentIds.length > 0
            ? `${allocateModal.selectedStudentIds.length} selected`
            : 'Allocate'}
        </span>
      </button>

      <AllocateBookModal
        students={allocateModal.students}
        selectedStudentIds={allocateModal.selectedStudentIds}
        isOpen={allocateModal.isModalOpen}
        isLoadingStudents={allocateModal.isLoadingStudents}
        isAllocating={allocateModal.isAllocating}
        isAllSelected={allocateModal.isAllSelected}
        onClose={() => allocateModal.setIsModalOpen(false)}
        onToggleAll={allocateModal.toggleAll}
        onToggleStudent={allocateModal.toggleStudent}
        onSubmitAllocate={allocateModal.submitAllocate}
      />

      {allocateModal.allocatedAt && (
        <p className="text-xs text-muted-foreground mt-1">
          Allocated on {new Date(allocateModal.allocatedAt).toLocaleString()}
        </p>
      )}
    </>
  );
}
