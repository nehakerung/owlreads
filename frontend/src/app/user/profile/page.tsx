'use client';

import RequireAuth from '@/components/user/RequireAuth';
import { ProfilePageContent } from '@/components/profile';
import { useAuth } from '@/context/AuthContext';

function OwnProfileContent() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen">
      <ProfilePageContent
        user={user}
        heading={`Welcome back, ${user.first_name}!`}
        isOwnProfile
      />
    </div>
  );
}

export default function Profile() {
  return (
    <RequireAuth>
      <OwnProfileContent />
    </RequireAuth>
  );
}
