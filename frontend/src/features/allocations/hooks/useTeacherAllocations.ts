import { useEffect, useMemo, useState } from 'react';

import type {
  Allocation,
  AllocationGroup,
  AllocationStats,
  AllocationSortOrder,
  Student,
} from '../types';
import { groupAllocationsByBook, computeAllocationStats } from '../mappers';
import { fetchTeacherAllocations, fetchTeacherStudents } from '../api';
import type { FetchTeacherAllocationsArgs } from '../api';

export type UseTeacherAllocationsResult = {
  students: Student[];
  allocations: Allocation[];
  allocationGroups: AllocationGroup[];
  overallStats: AllocationStats;
  query: string;
  sortOrder: AllocationSortOrder;
  loading: boolean;
  error: string;
  setQuery: (value: string) => void;
  setSortOrder: (value: AllocationSortOrder) => void;
  reloadAllocations: () => Promise<void>;
};

export function useTeacherAllocations(
  isTeacher: boolean
): UseTeacherAllocationsResult {
  const [students, setStudents] = useState<Student[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<AllocationSortOrder>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reloadAllocations = async () => {
    setLoading(true);
    setError('');

    const fetchArgs: FetchTeacherAllocationsArgs = {
      query,
      sortOrder,
    };

    const allocationList = await fetchTeacherAllocations(fetchArgs);
    setAllocations(allocationList);
    setLoading(false);
  };

  useEffect(() => {
    if (!isTeacher) return;
    fetchTeacherStudents()
      .then((studentList) => {
        setStudents(studentList);
      })
      .catch((e) => {
        setError(e?.response?.data?.error || 'Failed to load allocations');
      });
  }, [isTeacher]);

  useEffect(() => {
    if (!isTeacher) return;

    reloadAllocations().catch((e) => {
      setError(e?.response?.data?.error || 'Failed to load allocations');
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sortOrder, isTeacher]);

  const allocationGroups = useMemo(
    () => groupAllocationsByBook(allocations, sortOrder),
    [allocations, sortOrder]
  );

  const overallStats = useMemo(
    () => computeAllocationStats(allocations),
    [allocations]
  );

  return {
    students,
    allocations,
    allocationGroups,
    overallStats,
    query,
    sortOrder,
    loading,
    error,
    setQuery,
    setSortOrder,
    reloadAllocations,
  };
}
