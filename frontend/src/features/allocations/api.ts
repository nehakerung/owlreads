import { apiClient } from '@/services/api/client';

import type { Allocation, AllocationSortOrder, Student } from './types';

export async function fetchTeacherStudents(): Promise<Student[]> {
  const response = await apiClient.get('/auth/students/list/');

  type RawStudent = {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    student_id?: string | null;
  };

  const students = (response.data ?? []) as RawStudent[];

  return students.map((student) => {
    const firstName = student.first_name ?? '';
    const lastName = student.last_name ?? '';
    const fullName = `${firstName} ${lastName}`.trim();

    return {
      id: student.id,
      username: student.username,
      first_name: String(firstName),
      last_name: String(lastName),
      full_name: fullName || undefined,
      student_id: student.student_id ?? null,
    };
  });
}

export type FetchTeacherAllocationsArgs = {
  query?: string;
  sortOrder?: AllocationSortOrder;
};

export async function fetchTeacherAllocations(
  args: FetchTeacherAllocationsArgs
): Promise<Allocation[]> {
  const query = args.query?.trim();
  const response = await apiClient.get('/allocations/', {
    params: { q: query || undefined },
  });

  return (response.data?.allocations ?? []) as Allocation[];
}

export async function updateTeacherAllocation(args: {
  entryId: number;
  studentId: number;
  allocatedAtIso: string;
}): Promise<void> {
  await apiClient.patch(`/allocations/${args.entryId}/`, {
    student_id: args.studentId,
    allocated_at: args.allocatedAtIso,
  });
}

export async function removeTeacherAllocation(entryId: number): Promise<void> {
  await apiClient.delete(`/allocations/${entryId}/`);
}

export async function fetchExistingBookAllocations(args: {
  bookId: number;
}): Promise<number[]> {
  const response = await apiClient.get('/allocate/', {
    params: { book_id: args.bookId },
  });

  const studentIds = response.data?.student_ids;
  return Array.isArray(studentIds) ? (studentIds as number[]) : [];
}

export async function allocateBookToStudents(args: {
  bookId: number;
  studentIds: number[];
}): Promise<{ allocatedAt: string | null }> {
  const response = await apiClient.post('/allocate/', {
    book_id: args.bookId,
    student_ids: args.studentIds,
  });

  return { allocatedAt: response.data?.allocated_at ?? null };
}

export async function deleteBookAllocation(args: {
  entryId: number;
}): Promise<void> {
  await apiClient.delete(`/allocate/${args.entryId}/`);
}
