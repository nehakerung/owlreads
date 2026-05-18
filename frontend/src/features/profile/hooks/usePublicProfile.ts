'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/services/api/client';
import type { ProfileUser } from '../types';

export function usePublicProfile(profileId: string) {
  const { user: authedUser, loading: authLoading } = useAuth();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const isOwnProfile =
    !!authedUser &&
    (profileId === String(authedUser.id) || profileId === authedUser.username);

  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return;
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

        const resp = await apiClient.get<ProfileUser>(
          `/auth/users/${encodeURIComponent(profileId)}/`
        );
        setProfileUser(resp.data);
      } catch {
        setProfileUser(null);
      } finally {
        setProfileLoading(false);
      }
    };

    void loadProfile();
  }, [authedUser, authLoading, isOwnProfile, profileId]);

  const loading = authLoading || profileLoading;

  const heading = useMemo(() => {
    if (!profileUser) return '';
    if (isOwnProfile) return `Welcome back, ${profileUser.first_name}!`;
    return profileUser.username;
  }, [isOwnProfile, profileUser]);

  return {
    profileUser,
    loading,
    isOwnProfile,
    heading,
    collectionLookup: isOwnProfile ? undefined : profileId,
  };
}
