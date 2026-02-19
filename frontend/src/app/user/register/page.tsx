'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
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
      await register(username, email, password, password2);
      router.push('/');
    } catch (err: any) {
      console.log('Fetching:', err);
      setError(err.response?.data?.username?.[0] || 'Registration failed');
    }
  };

  return (
    <div className="p-10 min-h-screen flex items-center justify-center">
      <div className="bg-card max-w-md w-full space-y-8 p-8 rounded-lg shadow">
        <div className="flex items-center justify-center">
          <Image
            src="/OwlReadsLogo.png"
            alt="OwlReads Logo"
            width={250}
            height={250}
            className="mr-3"
          />
        </div>
        <h2 className="text-3xl font-bold text-center">Create Account</h2>

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
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
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

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/user/login" className="text-[#9dcd5a] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
