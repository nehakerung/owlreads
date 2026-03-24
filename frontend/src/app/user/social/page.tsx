'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/user/RequireAuth';
import { fetchSocialUpdates, SocialUpdate } from '@/services/api/social';

export default function SocialPage() {
  const [updates, setUpdates] = useState<SocialUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        const response = await fetchSocialUpdates();
        setUpdates(response.data);
      } finally {
        setLoading(false);
      }
    };

    loadUpdates();
  }, []);

  return (
    <RequireAuth>
      <div className="page-container">
        <h1 className="text-2xl font-bold mb-6">Class Social Feed</h1>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🦉</p>
            <p className="font-medium">No class updates yet</p>
            <p className="text-sm mt-1">
              Updates will appear when users in your class add books to their to
              read shelf.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {updates.map((update) => (
              <div key={update.id} className="bg-card rounded-lg shadow p-4">
                <p className="font-medium">{update.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(update.updated_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex-center max-w-4xl w-full mx-auto px-4 py-16">
          <Link href="/" className="btnsecondary inline-block mt-6">
            Go back home
          </Link>
        </div>
      </div>
    </RequireAuth>
  );
}
