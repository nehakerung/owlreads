'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthFormLayout } from '@/components/ui/AuthFormLayout';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { getApiErrorMessage } from '@/lib/apiError';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [classname, setClassName] = useState('');
  const [teachername, setTeacherName] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(
        username,
        email,
        first_name,
        last_name,
        classname,
        teachername,
        password,
        password2
      );
      router.push('/');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Registration failed'));
    }
  };

  return (
    <AuthFormLayout
      title="Create Account"
      showLogo
      footer={
        <>
          Already have an account?{' '}
          <Link href="/user/login" className="secondary-link hover:underline">
            Sign in
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
          <label className="block text-sm font-medium">First name</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Last name</label>
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Class Name</label>
          <input
            type="text"
            value={classname}
            onChange={(e) => setClassName(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Teacher Name</label>
          <input
            type="text"
            value={teachername}
            onChange={(e) => setTeacherName(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <button type="submit" className="btnsecondary w-full">
          Sign Up
        </button>
      </form>
    </AuthFormLayout>
  );
}
