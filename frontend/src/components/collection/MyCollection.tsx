'use client';

import { useMemo } from 'react';
import { BookCheck, Lock, Sparkles } from 'lucide-react';
import { buildDisplayAwards } from './buildDisplayAwards';
import { getCollectionProgressStats } from './collectionProgress';
import { CollectionSummaryHeader } from './CollectionSummaryHeader';
import { cn } from '@/lib/utils';
import type { Collection } from './types';

export interface MyCollectionProps {
  collection: Collection | null;
  error: string;
  /** Inline loading state (e.g. on profile while the collection request runs). */
  loading?: boolean;
  className?: string;
}

export function MyCollection({
  collection,
  error,
  loading = false,
  className,
}: MyCollectionProps) {
  const displayAwards = useMemo(
    () => buildDisplayAwards(collection),
    [collection?.catalog_genres]
  );

  const earnedTypes = useMemo(
    () => new Set(collection?.awards.map((a) => a.award_type) ?? []),
    [collection?.awards]
  );

  const { earnedCount, totalAwardSlots, progressPct } = useMemo(
    () => getCollectionProgressStats(collection),
    [collection]
  );

  if (loading && !collection) {
    return (
      <div className={cn('max-w-3xl mx-auto px-4 py-8', className)}>
        <div className="bg-card rounded-lg shadow p-6 text-muted-foreground">
          Loading collection…
        </div>
      </div>
    );
  }

  return (
    <div className={cn('max-w-3xl mx-auto px-4 py-8', className)}>
      <CollectionSummaryHeader
        earnedCount={earnedCount}
        totalAwardSlots={totalAwardSlots}
        progressPct={progressPct}
      />

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      ) : null}

      <MilestonesSection
        displayAwards={displayAwards}
        earnedTypes={earnedTypes}
        collection={collection}
      />

      <GenreMedalsSection
        displayAwards={displayAwards}
        earnedTypes={earnedTypes}
        collection={collection}
      />
    </div>
  );
}

function MilestonesSection({
  displayAwards,
  earnedTypes,
  collection,
}: {
  displayAwards: ReturnType<typeof buildDisplayAwards>;
  earnedTypes: Set<string>;
  collection: Collection | null;
}) {
  return (
    <>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Reading milestones
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {displayAwards
          .filter((a) => a.kind === 'milestone')
          .map((award) => {
            const earned = earnedTypes.has(award.type);
            const earnedAward = collection?.awards.find(
              (a) => a.award_type === award.type
            );

            return (
              <div
                key={award.type}
                className={`bg-card rounded-lg shadow p-5 flex items-start gap-4 transition ${
                  earned ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className={`rounded-full p-3 flex-shrink-0 ${
                    earned
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {earned ? <BookCheck size={22} /> : <Lock size={22} />}
                </div>

                <div>
                  <p className="font-semibold">{award.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {award.description}
                  </p>
                  {earned && earnedAward ? (
                    <p className="text-xs text-yellow-600 mt-1">
                      Earned{' '}
                      {new Date(earnedAward.earned_at).toLocaleDateString()}
                    </p>
                  ) : null}
                  {!earned ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      Read {award.threshold} book
                      {award.threshold > 1 ? 's' : ''} to unlock
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

function GenreMedalsSection({
  displayAwards,
  earnedTypes,
  collection,
}: {
  displayAwards: ReturnType<typeof buildDisplayAwards>;
  earnedTypes: Set<string>;
  collection: Collection | null;
}) {
  const genreAwards = displayAwards.filter((a) => a.kind === 'genre');

  return (
    <>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-amber-500" />
        Genre medals
      </h3>
      {genreAwards.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-6">
          No genres are stored on books yet. Medals will appear here as your
          catalog grows.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {genreAwards.map((award) => {
            const earned = earnedTypes.has(award.type);
            const earnedAward = collection?.awards.find(
              (a) => a.award_type === award.type
            );

            return (
              <div
                key={award.type}
                className={`bg-card rounded-lg shadow p-5 flex items-start gap-4 transition ${
                  earned ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className={`rounded-full p-3 flex-shrink-0 ${
                    earned
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {earned ? <Sparkles size={22} /> : <Lock size={22} />}
                </div>

                <div>
                  <p className="font-semibold">{award.label}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
                    Genre medal
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {award.description}
                  </p>
                  {earned && earnedAward ? (
                    <p className="text-xs text-amber-700 mt-1">
                      Earned{' '}
                      {new Date(earnedAward.earned_at).toLocaleDateString()}
                    </p>
                  ) : null}
                  {!earned ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      Mark a book in this genre as read to unlock
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
