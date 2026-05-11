'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function CreateStudentPage() {
  const [username, setUsername] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = Cookies.get('access_token');

      await axios.post(
        'http://localhost:8000/api/auth/students/',
        {
          username,
          first_name,
          last_name,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Student account created successfully');

      setUsername('');
      setFirstName('');
      setLastName('');
      setPassword('');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.username?.[0] || 'Failed to create student');
    }
  };

  return (
    <div className="p-10 min-h-screen flex items-center justify-center">
      <div className="bg-card max-w-md w-full space-y-8 p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">
          Create Student Account
        </h2>
        <p className="text-sm text-center max-w-md mx-auto">
          Students sign in with the username and password you set here. Share
          these credentials securely; you can reset a forgotten password from
          the teacher dashboard.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <p className="mt-0.5 mb-1.5 text-xs text-muted-foreground">
              They will use this every time they sign in, so keep it memorable
              and unique in your class.
            </p>
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
            <p className="mt-0.5 mb-1.5 text-xs text-muted-foreground">
              Shown in your roster and can help you match accounts to learners.
            </p>
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
            <p className="mt-0.5 mb-1.5 text-xs text-muted-foreground">
              Used with first name on your roster and when you look up this
              student.
            </p>
            <input
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Temporary Password
            </label>
            <p className="mt-0.5 mb-1.5 text-xs text-muted-foreground">
              Initial password for their first login. Use something easy to
              communicate in person; you can reset it anytime from the
              dashboard.
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

        <p className="text-center text-sm">
          <Link href="/teacher" className="secondary-link hover:underline">
            Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
