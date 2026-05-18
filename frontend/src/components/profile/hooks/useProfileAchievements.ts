'use client';

import {
  useCollectionSummaryStats,
  useUserCollection,
} from '@/components/collection';
import type { ProfileUser } from '../types';

type UseProfileAchievementsOptions = {
  isOwnProfile: boolean;
  lookup?: string;
};

export function useProfileAchievements(
  user: ProfileUser | null,
  { isOwnProfile, lookup }: UseProfileAchievementsOptions
) {
  const { collection, fetching, error } = useUserCollection(
    user,
    isOwnProfile ? undefined : { lookup }
  );
  const summary = useCollectionSummaryStats(collection);

  const achievementsTitle = isOwnProfile
    ? 'My Achievements'
    : `${user?.username ?? 'User'}'s Achievements`;

  return {
    collection,
    fetching,
    error,
    summary,
    achievementsTitle,
  };
}
