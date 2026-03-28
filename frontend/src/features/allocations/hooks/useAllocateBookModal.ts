import { useEffect, useMemo, useState } from 'react';

import type { Student } from '../types';
import {
  allocateBookToStudents,
  fetchExistingBookAllocations,
  fetchTeacherStudents,
} from '../api';

export function useAllocateBookModal(args: {
  bookId: number;
  isTeacher: boolean;
}) {
  const { bookId, isTeacher } = args;

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAllocating, setIsAllocating] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [allocatedAt, setAllocatedAt] = useState<string | null>(null);

  const isAllSelected = useMemo(() => {
    return students.length > 0 && selectedStudentIds.length === students.length;
  }, [selectedStudentIds.length, students.length]);

  const toggleStudent = (studentId: number) => {
    setSelectedStudentIds((previousSelected) => {
      if (previousSelected.includes(studentId)) {
        return previousSelected.filter((id) => id !== studentId);
      }

      return [...previousSelected, studentId];
    });
  };

  const toggleAll = () => {
    if (students.length === 0) return;

    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
      return;
    }

    setSelectedStudentIds(students.map((student) => student.id));
  };

  useEffect(() => {
    if (!isModalOpen || students.length > 0 || !isTeacher) return;

    let isCancelled = false;
    setIsLoadingStudents(true);

    fetchTeacherStudents()
      .then((studentList) => {
        if (isCancelled) return;
        setStudents(studentList);
      })
      .catch(() => {
        // Preserve existing behavior: log errors, but don't crash the UI.
        // The modal can still be opened once students are available.
        console.error('Failed to fetch students');
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoadingStudents(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [isModalOpen, isTeacher, students.length]);

  useEffect(() => {
    if (!isModalOpen || !isTeacher) return;

    let isCancelled = false;

    fetchExistingBookAllocations({ bookId })
      .then((studentIds) => {
        if (isCancelled) return;
        setSelectedStudentIds(studentIds);
      })
      .catch(() => {
        console.error('Failed to fetch existing allocations');
      });

    return () => {
      isCancelled = true;
    };
  }, [isModalOpen, isTeacher, bookId]);

  const submitAllocate = async () => {
    if (selectedStudentIds.length === 0) return;

    setIsAllocating(true);
    try {
      const response = await allocateBookToStudents({
        bookId,
        studentIds: selectedStudentIds,
      });

      setAllocatedAt(response.allocatedAt);
      setSelectedStudentIds([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Allocation failed', err);
    } finally {
      setIsAllocating(false);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    students,
    selectedStudentIds,
    allocatedAt,
    isAllocating,
    isLoadingStudents,
    isAllSelected,
    toggleStudent,
    toggleAll,
    submitAllocate,
  };
}
