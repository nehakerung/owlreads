'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

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
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    }
  };

  return (
    <div className="p-10 min-h-screen flex items-center justify-center">
      <div className="bg-card max-w-md w-full space-y-8 p-8 rounded-lg shadow">
        <div className="flex items-center justify-center">
          <Image
            src="/OwlReadsLogo.png"
            alt="OwlReads Logo"
            width={500}
            height={500}
            className="mr-3"
          />
        </div>
        <h2 className="text-3xl font-bold text-center">Sign In</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

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

        <p className="text-center text-sm">
          Don't have an account?{' '}
          <Link
            href="/user/register"
            className="text-[#9dcd5a] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
