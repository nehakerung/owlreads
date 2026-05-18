'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AuthFormLayout } from '@/components/ui/AuthFormLayout';
import { AlertBanner } from '@/components/ui/AlertBanner';
import RequireTeacher from '@/components/auth/RequireTeacher';
import { apiClient } from '@/services/api/client';
import { getApiErrorMessage } from '@/lib/apiError';

function ResetPasswordForm() {
  const params = useParams();
  const studentId = params.studentId as string;

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await apiClient.post(
        `/auth/students/${encodeURIComponent(studentId)}/reset-password/`,
        {}
      );
      setSuccess("This student's password has been reset to the default.");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not reset password.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFormLayout
      title="Reset student password"
      className="max-w-md"
      description={
        <>
          <p>
            Student ID:{' '}
            <span className="font-mono font-semibold">{studentId}</span>
          </p>
          <p className="mt-2 max-w-sm mx-auto">
            Use this when the student cannot log in. They should change this
            default as soon as they are back in their account.
          </p>
          <p className="mt-2">
            Their login password will be set to the default:{' '}
            <span className="font-mono font-semibold">password</span>
          </p>
        </>
      }
    >
      {error ? <AlertBanner>{error}</AlertBanner> : null}
      {success ? <AlertBanner variant="success">{success}</AlertBanner> : null}

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
    </AuthFormLayout>
  );
}

export default function TeacherResetStudentPasswordPage() {
  return (
    <RequireTeacher>
      <ResetPasswordForm />
    </RequireTeacher>
  );
}
