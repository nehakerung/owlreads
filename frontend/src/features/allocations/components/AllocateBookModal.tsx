'use client';

import { Loader2, X } from 'lucide-react';

import type { Student } from '../types';

export function AllocateBookModal(props: {
  students: Student[];
  selectedStudentIds: number[];
  isOpen: boolean;
  isLoadingStudents: boolean;
  isAllocating: boolean;
  isAllSelected: boolean;
  onClose: () => void;
  onToggleAll: () => void;
  onToggleStudent: (studentId: number) => void;
  onSubmitAllocate: () => void;
}) {
  const {
    students,
    selectedStudentIds,
    isOpen,
    isLoadingStudents,
    isAllocating,
    isAllSelected,
    onClose,
    onToggleAll,
    onToggleStudent,
    onSubmitAllocate,
  } = props;

  if (!isOpen) return null;

  const canSubmit = selectedStudentIds.length > 0 && !isAllocating;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl w-[28rem] max-h-[80vh] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Allocate Book</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close allocate modal"
          >
            <X size={18} />
          </button>
        </div>

        {isLoadingStudents ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin" size={18} />
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onToggleAll}
              className="mb-3 text-sm text-blue-700 hover:text-blue-800 font-medium"
            >
              {isAllSelected ? 'Deselect all' : 'Select all'}
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
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => onToggleStudent(student.id)}
                    />
                    <span className="text-sm">
                      {student.full_name || student.username}
                    </span>
                  </label>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={onSubmitAllocate}
              disabled={!canSubmit || selectedStudentIds.length === 0}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              {isAllocating ? (
                <Loader2 className="animate-spin mx-auto" size={16} />
              ) : (
                `Allocate (${selectedStudentIds.length})`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
