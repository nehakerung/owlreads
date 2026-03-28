'use client';

import { X } from 'lucide-react';

import type { Allocation, Student } from '../types';
import { AllocationStatusBadge } from './AllocationStatusBadge';

export function AllocationEditModal(props: {
  editingAllocation: Allocation;
  students: Student[];
  draftStudentId: number | '';
  draftAllocatedAt: string;
  onChangeDraftStudentId: (value: number | '') => void;
  onChangeDraftAllocatedAt: (value: string) => void;
  onClose: () => void;
  onSubmitEdit: () => void;
  onSubmitDeallocate: () => void;
}) {
  const {
    editingAllocation,
    students,
    draftStudentId,
    draftAllocatedAt,
    onChangeDraftStudentId,
    onChangeDraftAllocatedAt,
    onClose,
    onSubmitEdit,
    onSubmitDeallocate,
  } = props;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl w-[32rem] max-h-[85vh] overflow-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Allocation</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close edit modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Book</div>
            <div className="font-medium">{editingAllocation.book_title}</div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-input bg-white p-3">
            <div>
              <div className="text-sm font-medium">Student status</div>
              <div className="text-xs text-muted-foreground">
                This is based on the student’s shelf status for the book.
              </div>
            </div>
            <AllocationStatusBadge shelfStatus={editingAllocation.status} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <select
              className="input-field w-full"
              value={draftStudentId}
              onChange={(event) =>
                onChangeDraftStudentId(Number(event.target.value))
              }
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name} ({student.username})
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
              onChange={(event) => onChangeDraftAllocatedAt(event.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              className="btnsecondary text-red-600 border-red-200 hover:bg-red-50"
              onClick={onSubmitDeallocate}
            >
              Remove allocation
            </button>
            <button type="button" className="btnsecondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btnprimary"
              onClick={onSubmitEdit}
              disabled={draftStudentId === '' || !draftAllocatedAt}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
