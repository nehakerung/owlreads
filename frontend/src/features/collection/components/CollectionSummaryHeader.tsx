'use client';

import { Trophy } from 'lucide-react';
import { MILESTONE_AWARDS } from '../lib/constants';
import { cn } from '@/lib/utils';
import type { CollectionProgressStats } from '../lib/collectionProgress';

export interface CollectionSummaryHeaderProps extends CollectionProgressStats {
  className?: string;
  title?: string;
}

export function CollectionSummaryHeader({
  earnedCount,
  totalAwardSlots,
  progressPct,
  className,
  title = 'My Collection',
}: CollectionSummaryHeaderProps) {
  return (
    <div className={cn('bg-card rounded-lg shadow p-6 mb-6', className)}>
      <div className="flex items-center gap-3 mb-2">
        <Trophy size={28} className="text-yellow-500" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        {earnedCount} of {totalAwardSlots} awards earned
        {totalAwardSlots > MILESTONE_AWARDS.length ? (
          <span className="block mt-1 text-xs">
            This tracks reading rewards you can earn by completing books.
          </span>
        ) : null}
      </p>

      <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
