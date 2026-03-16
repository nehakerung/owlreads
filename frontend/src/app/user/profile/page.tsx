'use client';
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Please Login</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Welcome back, {user.username}!
            </h2>
            <button
              onClick={() => router.push('/user/profile/edit')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
            >
              Edit Profile
            </button>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p>
              <span className="font-semibold">User ID:</span> {user.id}
            </p>
            <p>
              <span className="font-semibold">First Name:</span>{' '}
              {user.first_name}
            </p>
            <p>
              <span className="font-semibold">Last Name:</span> {user.last_name}
            </p>
            <p>
              <span className="font-semibold">Class Name:</span>{' '}
              {user.classname}
            </p>
            <p>
              <span className="font-semibold">Teacher Name:</span>{' '}
              {user.teachername}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
