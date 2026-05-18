'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RequireAuth from '@/components/user/RequireAuth';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/services/api/client';

type PublicUser = NonNullable<ReturnType<typeof useAuth>['user']>;

export default function UserProfile() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user: authedUser, loading } = useAuth();

  const profileId = useMemo(() => `${params?.id ?? ''}`, [params]);

  const [profileUser, setProfileUser] = useState<PublicUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const isOwnProfile =
    !!authedUser &&
    (profileId === String(authedUser.id) || profileId === authedUser.username);

  useEffect(() => {
    const loadProfile = async () => {
      if (loading) return;
      if (!authedUser) {
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      try {
        if (isOwnProfile) {
          setProfileUser(authedUser);
          return;
        }

        const resp = await apiClient.get<PublicUser>(
          `/auth/users/${encodeURIComponent(profileId)}/`
        );
        setProfileUser(resp.data);
      } catch {
        setProfileUser(null);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [authedUser, isOwnProfile, loading, profileId]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Profile not available</h1>
            <p className="text-sm text-gray-500 mt-2">
              This profile could not be found.
            </p>
            <button
              onClick={() => router.back()}
              className="btnsecondary inline-block mt-6"
            >
              Go back
            </button>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen">
        <div className="page-container">
          <div className="bg-card rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{profileUser.username}</h2>
              {isOwnProfile && (
                <button
                  onClick={() => router.push('/user/profile/edit')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Email:</span>{' '}
                {profileUser.email ?? '—'}
              </p>
              <p>
                <span className="font-semibold">Username:</span>{' '}
                {profileUser.username}
              </p>
              <p>
                <span className="font-semibold">User ID:</span> {profileUser.id}
              </p>
              <p>
                <span className="font-semibold">First Name:</span>{' '}
                {profileUser.first_name}
              </p>
              <p>
                <span className="font-semibold">Last Name:</span>{' '}
                {profileUser.last_name}
              </p>
              <p>
                <span className="font-semibold">Class Name:</span>{' '}
                {profileUser.classname ?? '—'}
              </p>
              <p>
                <span className="font-semibold">Teacher Name:</span>{' '}
                {profileUser.teachername ?? '—'}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 mt-6">
            <h3 className="text-xl font-bold mb-4">Bookshelf Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--mint)]">
                  {profileUser.books_read_count || 0}
                </div>
                <div className="text-sm text-[var(--mint)]">Books Read</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--yellow)]">
                  {profileUser.books_reading_count || 0}
                </div>
                <div className="text-sm text-[var(--yellow)]">
                  Currently Reading
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--red)]">
                  {profileUser.books_to_read_count || 0}
                </div>
                <div className="text-sm text-[var(--red)]">To Read</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {(profileUser.books_read_count || 0) +
                    (profileUser.books_reading_count || 0) +
                    (profileUser.books_to_read_count || 0)}
                </div>
                <div className="text-sm text-gray-700">Total Books</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Last Activity:</span>{' '}
                {profileUser.last_shelf_update
                  ? new Date(profileUser.last_shelf_update).toLocaleDateString()
                  : 'No activity yet'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
