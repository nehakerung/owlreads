import { useState } from 'react';

import type { Allocation } from '../types';
import { dateTimeLocalToIso, toDateTimeLocal } from '../mappers';
import { removeTeacherAllocation, updateTeacherAllocation } from '../api';

export function useAllocationEditor(args: {
  reloadAllocations: () => Promise<void>;
}) {
  const { reloadAllocations } = args;

  const [editingAllocation, setEditingAllocation] = useState<Allocation | null>(
    null
  );
  const [draftStudentId, setDraftStudentId] = useState<number | ''>('');
  const [draftAllocatedAt, setDraftAllocatedAt] = useState<string>('');

  const startEditingAllocation = (allocation: Allocation) => {
    setEditingAllocation(allocation);
    setDraftStudentId(allocation.student_id);
    setDraftAllocatedAt(
      allocation.allocated_at
        ? toDateTimeLocal(allocation.allocated_at)
        : toDateTimeLocal(new Date().toISOString())
    );
  };

  const closeEditor = () => {
    setEditingAllocation(null);
  };

  const submitEdit = async () => {
    if (!editingAllocation) return;
    if (draftStudentId === '') return;

    await updateTeacherAllocation({
      entryId: editingAllocation.entry_id,
      studentId: Number(draftStudentId),
      allocatedAtIso: dateTimeLocalToIso(draftAllocatedAt),
    });

    setEditingAllocation(null);
    await reloadAllocations();
  };

  const submitDeallocate = async () => {
    if (!editingAllocation) return;

    const confirmation = window.confirm('Remove this allocation?');
    if (!confirmation) return;

    await removeTeacherAllocation(editingAllocation.entry_id);
    await reloadAllocations();
  };

  return {
    editingAllocation,
    draftStudentId,
    draftAllocatedAt,
    setDraftStudentId,
    setDraftAllocatedAt,
    startEditingAllocation,
    closeEditor,
    submitEdit,
    submitDeallocate,
  };
}
