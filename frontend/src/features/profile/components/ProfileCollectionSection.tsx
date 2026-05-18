'use client';

import {
  CollectionSummaryHeader,
  type CollectionProgressStats,
} from '@/features/collection';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { InlineLoadingCard } from '@/components/ui/InlineLoadingCard';
import type { Collection } from '@/features/collection';

type ProfileCollectionSectionProps = {
  collection: Collection | null;
  fetching: boolean;
  error: string;
  summary: CollectionProgressStats;
  title?: string;
};

export function ProfileCollectionSection({
  collection,
  fetching,
  error,
  summary,
  title,
}: ProfileCollectionSectionProps) {
  if (fetching && !collection) {
    return (
      <InlineLoadingCard message="Loading achievements…" className="mt-6" />
    );
  }

  if (error) {
    return <AlertBanner className="mt-6">{error}</AlertBanner>;
  }

  return (
    <CollectionSummaryHeader {...summary} title={title} className="mt-6 mb-0" />
  );
}
