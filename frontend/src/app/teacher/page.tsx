'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import RequireAuth from '@/components/user/RequireAuth';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
  const router = useRouter();
  const { isTeacher } = useAuth();
  const [studentId, setStudentId] = useState('');
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
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <Link href="/teacher/create-student" className="btnprimary">
            Create Student Account
          </Link>

          <Link
            href={`/teacher/reset-password/${studentId}`}
            className="btnsecondary"
          >
            Reset Student Password
          </Link>
        </div>
      </div>
    </RequireAuth>
  );
}
