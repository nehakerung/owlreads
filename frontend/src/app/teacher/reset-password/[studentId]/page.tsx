'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import RequireAuth from '@/components/user/RequireAuth';
import { useAuth } from '@/context/AuthContext';

export default function TeacherResetStudentPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const { isTeacher } = useAuth();
  const studentId = params.studentId as string;

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const token = Cookies.get('access_token');
      await axios.post(
        `http://localhost:8000/api/auth/students/${encodeURIComponent(
          studentId
        )}/reset-password/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess("This student's password has been reset to the default.");
    } catch (err: unknown) {
      const data = axios.isAxiosError(err) ? err.response?.data : undefined;
      const message =
        (data &&
        typeof data === 'object' &&
        'error' in data &&
        typeof data.error === 'string'
          ? data.error
          : null) || 'Could not reset password.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isTeacher) {
    return (
      <RequireAuth>
        <div className="p-8 text-center">
          <p className="text-red-500">
            You are not authorized to view this page.
          </p>
          <button
            type="button"
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
      <div className="p-10 min-h-screen flex items-center justify-center">
        <div className="bg-card max-w-md w-full space-y-8 p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center">
            Reset student password
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Student ID:{' '}
            <span className="font-mono font-semibold">{studentId}</span>
          </p>
          <p className="text-sm text-center">
            Their login password will be set to the default:{' '}
            <span className="font-mono font-semibold">password</span>
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleReset}
              disabled={submitting || !studentId || Boolean(success)}
              className="btnprimary disabled:opacity-50"
            >
              {submitting ? 'Resetting…' : 'Confirm reset'}
            </button>
            <Link href="/teacher" className="btnsecondary text-center">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
