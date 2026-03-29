import type {
  Allocation,
  AllocationGroup,
  AllocationSortOrder,
  AllocationStatusKey,
  AllocationStats,
} from './types';
import { ALLOCATION_STATUS_META } from './constants';

export function allocationStatusKeyFromShelfStatus(
  shelfStatus: string
): AllocationStatusKey {
  if (shelfStatus === 'read') return 'read';
  if (shelfStatus === 'reading') return 'reading';
  return 'not_started';
}

export function allocationStatusMetaFromShelfStatus(
  shelfStatus: string
): (typeof ALLOCATION_STATUS_META)[AllocationStatusKey] {
  return ALLOCATION_STATUS_META[
    allocationStatusKeyFromShelfStatus(shelfStatus)
  ];
}

export function toDateTimeLocal(iso: string) {
  const dateObject = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${dateObject.getFullYear()}-${pad(dateObject.getMonth() + 1)}-${pad(
    dateObject.getDate()
  )}T${pad(dateObject.getHours())}:${pad(dateObject.getMinutes())}`;
}

export function dateTimeLocalToIso(dateTimeLocalValue: string): string {
  return new Date(dateTimeLocalValue).toISOString();
}

export function computeAllocationStats(
  allocations: Allocation[]
): AllocationStats {
  const total = allocations.length;
  let notStarted = 0;
  let reading = 0;
  let read = 0;

  for (const allocation of allocations) {
    const statusKey = allocationStatusKeyFromShelfStatus(allocation.status);
    if (statusKey === 'not_started') notStarted += 1;
    else if (statusKey === 'reading') reading += 1;
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
}

export function groupAllocationsByBook(
  allocations: Allocation[],
  sortOrder: AllocationSortOrder
): AllocationGroup[] {
  const groupsByBook = new Map<number, AllocationGroup>();

  for (const allocation of allocations) {
    const allocationTimeMs = allocation.allocated_at
      ? new Date(allocation.allocated_at).getTime()
      : 0;

    const existingGroup = groupsByBook.get(allocation.book_id);
    if (!existingGroup) {
      groupsByBook.set(allocation.book_id, {
        book_id: allocation.book_id,
        book_title: allocation.book_title,
        allocations: [allocation],
        sortTimeMs: allocationTimeMs,
      });
      continue;
    }

    existingGroup.allocations.push(allocation);
    if (allocationTimeMs > existingGroup.sortTimeMs) {
      existingGroup.sortTimeMs = allocationTimeMs;
    }
  }

  const groups = Array.from(groupsByBook.values());

  for (const group of groups) {
    group.allocations.sort((firstAllocation, secondAllocation) => {
      const firstStatusRank =
        ALLOCATION_STATUS_META[
          allocationStatusKeyFromShelfStatus(firstAllocation.status)
        ].sortRank;
      const secondStatusRank =
        ALLOCATION_STATUS_META[
          allocationStatusKeyFromShelfStatus(secondAllocation.status)
        ].sortRank;

      if (firstStatusRank !== secondStatusRank) {
        // Not Started first
        return firstStatusRank - secondStatusRank;
      }

      const firstTimeMs = firstAllocation.allocated_at
        ? new Date(firstAllocation.allocated_at).getTime()
        : 0;
      const secondTimeMs = secondAllocation.allocated_at
        ? new Date(secondAllocation.allocated_at).getTime()
        : 0;

      // Newest first within same status
      return secondTimeMs - firstTimeMs;
    });
  }

  groups.sort((firstGroup, secondGroup) => {
    return sortOrder === 'newest'
      ? secondGroup.sortTimeMs - firstGroup.sortTimeMs
      : firstGroup.sortTimeMs - secondGroup.sortTimeMs;
  });

  return groups;
}
