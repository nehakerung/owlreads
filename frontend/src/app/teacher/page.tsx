'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import RequireAuth from '@/components/user/RequireAuth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Student {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string | null;
  student_id: string;
  classname: string | null;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const { isTeacher } = useAuth();
  const [studentId, setStudentId] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isTeacher) return;

    const fetchStudents = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(
          'http://localhost:8000/api/auth/students/list/',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(response.data);
      } catch (err) {
        setError('Failed to load students');
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [isTeacher]);

  if (!isTeacher) {
    return (
      <RequireAuth>
        <div className="p-8 text-center">
          <p className="text-red-500">
            You are not authorized to view this page.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm text-gray-500 underline"
          >
            Go Back
          </button>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

        <div className="flex gap-4 mb-8">
          <Link href="/teacher/create-student" className="btnprimary">
            Create Student Account
          </Link>
        </div>

        {/* Reset password by student ID */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Enter Student ID to reset password"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="input-field flex-1"
          />
          <Link
            href={`/teacher/reset-password/${studentId}`}
            className="btnsecondary"
          >
            Reset Password
          </Link>
        </div>

        {/* Student list */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Your Students ({students.length})
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loadingStudents ? (
            <p className="text-gray-500">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-gray-500">
              No students yet. Create one to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-card rounded-lg shadow">
                <thead>
                  <tr className="border-b border-input text-left">
                    <th className="px-4 py-3 text-sm font-semibold">
                      Student ID
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Username
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
                      <td className="px-4 py-3 text-sm">{student.id}</td>
                      <td className="px-4 py-3 text-sm">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-4 py-3 text-sm">{student.username}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() =>
                            router.push(
                              `/teacher/reset-password/${student.student_id}`
                            )
                          }
                          className="text-sm text-blue-500 hover:underline"
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
    </RequireAuth>
  );
}
