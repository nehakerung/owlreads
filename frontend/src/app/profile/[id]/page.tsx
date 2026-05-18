'use client';

import { useParams, useRouter } from 'next/navigation';
import { ProfilePageContent } from '@/features/profile';
import { usePublicProfile } from '@/features/profile/hooks/usePublicProfile';
import RequireAuth from '@/components/auth/RequireAuth';
import { PageLoading } from '@/components/ui/PageLoading';

export default function UserProfile() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const profileId = `${params?.id ?? ''}`;

  const { profileUser, loading, isOwnProfile, heading, collectionLookup } =
    usePublicProfile(profileId);

  if (loading) {
    return <PageLoading />;
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
        <ProfilePageContent
          user={profileUser}
          heading={heading}
          isOwnProfile={isOwnProfile}
          collectionLookup={collectionLookup}
        />
      </div>
    </RequireAuth>
  );
}
