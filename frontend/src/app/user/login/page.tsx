'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthFormLayout } from '@/components/ui/AuthFormLayout';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { getApiErrorMessage } from '@/lib/apiError';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      router.push('/user/profile');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Invalid credentials'));
    }
  };

  return (
    <AuthFormLayout
      title="Sign In"
      showLogo
      logoSize={500}
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            href="/user/register"
            className="secondary-link hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      {error ? <AlertBanner>{error}</AlertBanner> : null}

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
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <button type="submit" className="btnsecondary w-full">
          Sign In
        </button>
      </form>
    </AuthFormLayout>
  );
}
