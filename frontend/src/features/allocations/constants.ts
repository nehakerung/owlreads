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
    pill: 'bg-red-100 text-[var(--red)]-700 border-[var(--red)]-200',
    dot: 'bg-red-400',
    sortRank: 0,
  },
  reading: {
    label: 'Reading',
    pill: 'bg-yellow-50 text-[var(--yellow)] border-[var(--yellow)]-200',
    dot: 'bg-yellow-500',
    sortRank: 1,
  },
  read: {
    label: 'Read',
    pill: 'bg-green-50 text-[var(--mint)] border-[var(--mint)]-200',
    dot: 'bg-green-500',
    sortRank: 2,
  },
};
