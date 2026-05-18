'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthFormLayout } from '@/components/ui/AuthFormLayout';
import { AlertBanner } from '@/components/ui/AlertBanner';
import RequireTeacher from '@/components/user/RequireTeacher';
import { apiClient } from '@/services/api/client';
import { getApiErrorMessage } from '@/lib/apiError';

function CreateStudentForm() {
  const [username, setUsername] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await apiClient.post('/auth/students/', {
        username,
        first_name,
        last_name,
        password,
      });

      setSuccess('Student account created successfully');
      setUsername('');
      setFirstName('');
      setLastName('');
      setPassword('');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to create student'));
    }
  };

  return (
    <AuthFormLayout
      title="Create Student Account"
      description={
        <p className="max-w-md mx-auto">
          Students sign in with the username and password you set here. Share
          these credentials securely; you can reset a forgotten password from
          the teacher dashboard.
        </p>
      }
      footer={
        <Link href="/teacher" className="secondary-link hover:underline">
          Back to Dashboard
        </Link>
      }
    >
      {error ? <AlertBanner>{error}</AlertBanner> : null}
      {success ? (
        <AlertBanner variant="success">{success}</AlertBanner>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Temporary Password</label>
          <p className="mt-0.5 mb-1.5 text-xs text-muted-foreground">
            Initial password for their first login.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <button type="submit" className="btnsecondary w-full">
          Create Student
        </button>
      </form>
    </AuthFormLayout>
  );
}

export default function CreateStudentPage() {
  return (
    <RequireTeacher>
      <CreateStudentForm />
    </RequireTeacher>
  );
}
