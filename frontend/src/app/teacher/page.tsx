'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [studentId, setStudentId] = useState('');

  return (
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

        <Link
          href="/teacher/create-student"
          className="bg-green-600 text-white px-4 py-2 rounded inline-block"
        >
          Create Student Account
        </Link>

        <Link
          href={`/teacher/reset-password/${studentId}`}
          className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
        >
          Reset Student Password
        </Link>
      </div>
    </div>
  );
}
