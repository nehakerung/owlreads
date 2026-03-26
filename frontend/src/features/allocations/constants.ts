import type { AllocationSortOrder, AllocationStatusKey } from './types';

export const ALLOCATION_SORT_OPTIONS: AllocationSortOrder[] = [
  'newest',
  'oldest',
];

export const ALLOCATION_STATUS_META: Record<
  AllocationStatusKey,
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

// Keep existing behavior: current code hardcodes the backend origin.
export const API_BASE_URL = 'http://localhost:8000/api';

export const AUTH_STUDENTS_LIST_URL = `${API_BASE_URL}/auth/students/list/`;

export const TEACHER_ALLOCATIONS_LIST_URL = `${API_BASE_URL}/allocations/`;
export const teacherAllocationDetailUrl = (entryId: number) =>
  `${API_BASE_URL}/allocations/${entryId}/`;

export const TEACHER_ALLOCATE_URL = `${API_BASE_URL}/allocate/`;
export const teacherAllocateDetailUrl = (entryId: number) =>
  `${API_BASE_URL}/allocate/${entryId}/`;
