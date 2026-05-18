'use client';

import { useRouter } from 'next/navigation';
import { BookshelfStatsGrid } from './BookshelfStatsGrid';
import { ProfileCollectionSection } from './ProfileCollectionSection';
import { ProfileDetailsCard } from './ProfileDetailsCard';
import { useProfileAchievements } from '../hooks/useProfileAchievements';
import { bookshelfStatsFromUser, type ProfileUser } from '../types';

type ProfilePageContentProps = {
  user: ProfileUser;
  heading: string;
  isOwnProfile: boolean;
  collectionLookup?: string;
};

export function ProfilePageContent({
  user,
  heading,
  isOwnProfile,
  collectionLookup,
}: ProfilePageContentProps) {
  const router = useRouter();
  const achievements = useProfileAchievements(user, {
    isOwnProfile,
    lookup: collectionLookup,
  });

  return (
    <div className="page-container">
      <ProfileDetailsCard
        user={user}
        heading={heading}
        showEditButton={isOwnProfile}
        onEdit={
          isOwnProfile ? () => router.push('/user/profile/edit') : undefined
        }
      />

      <BookshelfStatsGrid
        stats={bookshelfStatsFromUser(user)}
        linkable={isOwnProfile}
      />

      <ProfileCollectionSection
        collection={achievements.collection}
        fetching={achievements.fetching}
        error={achievements.error}
        summary={achievements.summary}
        title={achievements.achievementsTitle}
      />
    </div>
  );
}
