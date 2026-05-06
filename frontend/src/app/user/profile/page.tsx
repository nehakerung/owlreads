'use client';
import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  CollectionSummaryHeader,
  useCollectionSummaryStats,
  useUserCollection,
} from '@/components/collection';

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { collection, fetching, error } = useUserCollection(user);
  const summary = useCollectionSummaryStats(collection);

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
      <div className="page-container">
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

        {/* Bookshelf Statistics */}
        <div className="bg-card rounded-lg shadow p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">Bookshelf Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/user/bookshelf?status=read"
              className="text-center p-4 bg-green-50 rounded-lg block hover:ring-2 hover:ring-green-200/80 transition"
            >
              <div className="text-2xl font-bold text-green-600">
                {user.books_read_count || 0}
              </div>
              <div className="text-sm text-green-700">Books Read</div>
            </Link>
            <Link
              href="/user/bookshelf?status=reading"
              className="text-center p-4 bg-blue-50 rounded-lg block hover:ring-2 hover:ring-blue-200/80 transition"
            >
              <div className="text-2xl font-bold text-blue-600">
                {user.books_reading_count || 0}
              </div>
              <div className="text-sm text-blue-700">Currently Reading</div>
            </Link>
            <Link
              href="/user/bookshelf?status=to_read"
              className="text-center p-4 bg-yellow-50 rounded-lg block hover:ring-2 hover:ring-yellow-200/80 transition"
            >
              <div className="text-2xl font-bold text-yellow-600">
                {user.books_to_read_count || 0}
              </div>
              <div className="text-sm text-yellow-700">To Read</div>
            </Link>
            <Link
              href="/user/bookshelf"
              className="text-center p-4 bg-gray-50 rounded-lg block hover:ring-2 hover:ring-gray-200/80 transition"
            >
              <div className="text-2xl font-bold text-gray-600">
                {(user.books_read_count || 0) +
                  (user.books_reading_count || 0) +
                  (user.books_to_read_count || 0)}
              </div>
              <div className="text-sm text-gray-700">Total Books</div>
            </Link>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Last Activity:</span>{' '}
              {user.last_shelf_update
                ? new Date(user.last_shelf_update).toLocaleDateString()
                : 'No activity yet'}
            </p>
          </div>
        </div>

        {fetching && !collection ? (
          <div className="bg-card rounded-lg shadow p-6 mt-6 text-muted-foreground">
            Loading collection…
          </div>
        ) : null}
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">
            {error}
          </div>
        ) : null}
        {!(fetching && !collection) && !error ? (
          <CollectionSummaryHeader {...summary} className="mt-6 mb-0" />
        ) : null}
      </div>
    </div>
  );
}
