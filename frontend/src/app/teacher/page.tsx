'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RequireTeacher from '@/components/auth/RequireTeacher';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { InlineLoadingCard } from '@/components/ui/InlineLoadingCard';
import { apiClient } from '@/services/api/client';

interface Student {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string | null;
  student_id: string;
  classname: string | null;
  last_shelf_update?: string;
  books_read_count?: number;
}

function getActiveStudents(students: Student[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return students.filter((student) => {
    if (!student.last_shelf_update) return false;
    const updateDate = new Date(student.last_shelf_update);
    updateDate.setHours(0, 0, 0, 0);
    return updateDate >= yesterday;
  });
}

function TeacherDashboardContent() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiClient.get<Student[]>('/auth/students/list/');
        setStudents(response.data);
      } catch {
        setError('Failed to load students');
      } finally {
        setLoadingStudents(false);
      }
    };

    void fetchStudents();
  }, []);

  const activeCount = getActiveStudents(students).length;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      <p className="mt-2 mb-6 text-sm max-w-2xl">
        View your class, see who has been reading recently, register new student
        logins, manage allocations, and reset passwords when needed.
      </p>

      <div className="update-card rounded-lg p-4 mb-6">
        <p className="font-semibold">
          Activity Summary:{' '}
          <span className="text-blue-600">
            {activeCount} of {students.length}
          </span>{' '}
          students were active today or yesterday
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          A student counts as active if they updated their bookshelf on
          today&apos;s date or yesterday&apos;s date (based on their last shelf
          update).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <Link href="/teacher/create-student" className="btnprimary">
            Create Student Account
          </Link>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Create Student</span>{' '}
            adds a new login you can share with the learner.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/teacher/allocations" className="btnsecondary">
            Manage Allocations
          </Link>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Manage Allocations
            </span>{' '}
            is where you allocate books from your collection to students and
            adjust those allocations.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">
          Your Students ({students.length})
        </h2>

        {error ? <AlertBanner className="mb-4">{error}</AlertBanner> : null}

        {loadingStudents ? (
          <InlineLoadingCard
            message="Loading students..."
            className="mt-4 shadow-none"
          />
        ) : students.length === 0 ? (
          <p className="text-gray-500 mt-4">
            No students yet. Create one to get started.
          </p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse bg-card rounded-lg shadow">
              <thead>
                <tr className="border-b border-input text-left">
                  <th className="px-4 py-3 text-sm font-semibold">
                    Student ID
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-sm font-semibold">Username</th>
                  <th className="px-4 py-3 text-sm font-semibold">
                    Last Updated
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold">
                    Books Read
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-input hover:bg-muted transition"
                  >
                    <td className="px-4 py-3 text-sm">
                      {student.student_id ?? student.id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm">{student.username}</td>
                    <td className="px-4 py-3 text-sm">
                      {student.last_shelf_update
                        ? new Date(
                            student.last_shelf_update
                          ).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">
                      {student.books_read_count || 0}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/teacher/reset-password/${student.student_id}`
                          )
                        }
                        className="text-sm text-[var(--green)]-500 hover:underline"
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <RequireTeacher onBack={() => window.history.back()} backLabel="Go Back">
      <TeacherDashboardContent />
    </RequireTeacher>
  );
}
