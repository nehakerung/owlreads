import axios from 'axios';
import Cookies from 'js-cookie';

import type { Allocation, AllocationSortOrder, Student } from './types';
import {
  AUTH_STUDENTS_LIST_URL,
  TEACHER_ALLOCATIONS_LIST_URL,
  TEACHER_ALLOCATE_URL,
  teacherAllocationDetailUrl,
  teacherAllocateDetailUrl,
} from './constants';

export function getAuthHeadersFromCookies() {
  const token = Cookies.get('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchTeacherStudents(): Promise<Student[]> {
  const response = await axios.get(AUTH_STUDENTS_LIST_URL, {
    headers: getAuthHeadersFromCookies(),
  });

  type RawStudent = {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
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
    };
  });
}

export type FetchTeacherAllocationsArgs = {
  query?: string;
  sortOrder?: AllocationSortOrder;
};

// Keep sort semantics aligned with the existing frontend:
// - The backend returns newest first by allocated_at.
// - The UI re-sorts by sortOrder client-side.
export async function fetchTeacherAllocations(
  args: FetchTeacherAllocationsArgs
): Promise<Allocation[]> {
  const query = args.query?.trim();
  const response = await axios.get(TEACHER_ALLOCATIONS_LIST_URL, {
    headers: getAuthHeadersFromCookies(),
    params: { q: query || undefined },
  });

  return (response.data?.allocations ?? []) as Allocation[];
}

export async function updateTeacherAllocation(args: {
  entryId: number;
  studentId: number;
  allocatedAtIso: string;
}): Promise<void> {
  await axios.patch(
    teacherAllocationDetailUrl(args.entryId),
    {
      student_id: args.studentId,
      allocated_at: args.allocatedAtIso,
    },
    { headers: getAuthHeadersFromCookies() }
  );
}

export async function removeTeacherAllocation(entryId: number): Promise<void> {
  await axios.delete(teacherAllocationDetailUrl(entryId), {
    headers: getAuthHeadersFromCookies(),
  });
}

// AllocateBook modal (existing allocate endpoints)
export async function fetchExistingBookAllocations(args: {
  bookId: number;
}): Promise<number[]> {
  const response = await axios.get(TEACHER_ALLOCATE_URL, {
    params: { book_id: args.bookId },
    headers: getAuthHeadersFromCookies(),
  });

  const studentIds = response.data?.student_ids;
  return Array.isArray(studentIds) ? (studentIds as number[]) : [];
}

export async function allocateBookToStudents(args: {
  bookId: number;
  studentIds: number[];
}): Promise<{ allocatedAt: string | null }> {
  const response = await axios.post(
    TEACHER_ALLOCATE_URL,
    {
      book_id: args.bookId,
      student_ids: args.studentIds,
    },
    { headers: getAuthHeadersFromCookies() }
  );

  return { allocatedAt: response.data?.allocated_at ?? null };
}

export async function deleteBookAllocation(args: {
  entryId: number;
}): Promise<void> {
  await axios.delete(teacherAllocateDetailUrl(args.entryId), {
    headers: getAuthHeadersFromCookies(),
  });
}
