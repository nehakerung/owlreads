'use client';

import { useMemo } from 'react';
import { BookCheck, Sparkles } from 'lucide-react';
import { AwardCard } from './AwardCard';
import { buildDisplayAwards } from '../lib/buildDisplayAwards';
import { CollectionSummaryHeader } from './CollectionSummaryHeader';
import { useCollectionSummaryStats } from '../hooks/useCollectionSummaryStats';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { InlineLoadingCard } from '@/components/ui/InlineLoadingCard';
import { cn } from '@/lib/utils';
import type { Collection, DisplayAward } from '../lib/types';

export interface MyCollectionProps {
  collection: Collection | null;
  error: string;
  loading?: boolean;
  className?: string;
  title?: string;
}

export function MyCollection({
  collection,
  error,
  loading = false,
  className,
  title,
}: MyCollectionProps) {
  const displayAwards = useMemo(
    () => buildDisplayAwards(collection),
    [collection?.catalog_genres]
  );

  const earnedTypes = useMemo(
    () => new Set(collection?.awards.map((a) => a.award_type) ?? []),
    [collection?.awards]
  );

  const summary = useCollectionSummaryStats(collection);

  if (loading && !collection) {
    return (
      <div className={cn('max-w-3xl mx-auto px-4 py-8', className)}>
        <InlineLoadingCard message="Loading collection…" />
      </div>
    );
  }

  return (
    <div className={cn('max-w-3xl mx-auto px-4 py-8', className)}>
      <CollectionSummaryHeader {...summary} title={title} />

      {error ? <AlertBanner className="mb-6">{error}</AlertBanner> : null}

      <AwardGridSection
        title="Reading milestones"
        awards={displayAwards.filter((a) => a.kind === 'milestone')}
        earnedTypes={earnedTypes}
        collection={collection}
        variant="milestone"
      />

      <AwardGridSection
        title="Genre medals"
        titleIcon={<Sparkles size={16} className="text-amber-500" />}
        awards={displayAwards.filter((a) => a.kind === 'genre')}
        earnedTypes={earnedTypes}
        collection={collection}
        variant="genre"
        emptyMessage="No genres are stored on books yet. Medals will appear here as your catalog grows."
      />
    </div>
  );
}

type AwardGridSectionProps = {
  title: string;
  titleIcon?: React.ReactNode;
  awards: DisplayAward[];
  earnedTypes: Set<string>;
  collection: Collection | null;
  variant: 'milestone' | 'genre';
  emptyMessage?: string;
};

function AwardGridSection({
  title,
  titleIcon,
  awards,
  earnedTypes,
  collection,
  variant,
  emptyMessage,
}: AwardGridSectionProps) {
  const isMilestone = variant === 'milestone';

  return (
    <>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
        {titleIcon}
        {title}
      </h3>
      {awards.length === 0 && emptyMessage ? (
        <p className="text-sm text-muted-foreground mb-6">{emptyMessage}</p>
      ) : (
        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 gap-4',
            isMilestone ? 'mb-10' : ''
          )}
        >
          {awards.map((award) => {
            const earned = earnedTypes.has(award.type);
            const earnedAward = collection?.awards.find(
              (a) => a.award_type === award.type
            );
            const threshold =
              award.kind === 'milestone' ? award.threshold : undefined;

            return (
              <AwardCard
                key={award.type}
                award={award}
                earned={earned}
                earnedAward={earnedAward}
                icon={isMilestone ? BookCheck : Sparkles}
                earnedIconClass={
                  isMilestone
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-amber-100 text-amber-700'
                }
                earnedDateClass={
                  isMilestone ? 'text-yellow-600' : 'text-amber-700'
                }
                subtitle={isMilestone ? undefined : 'Genre medal'}
                unlockHint={
                  isMilestone && threshold !== undefined
                    ? `Read ${threshold} book${threshold > 1 ? 's' : ''} to unlock`
                    : 'Mark a book in this genre as read to unlock'
                }
              />
            );
          })}
        </div>
      )}
    </>
  );
}
