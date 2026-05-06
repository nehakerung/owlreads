import { buildDisplayAwards } from './buildDisplayAwards';
import type { Collection } from './types';

export interface CollectionProgressStats {
  earnedCount: number;
  totalAwardSlots: number;
  progressPct: number;
}

export function getCollectionProgressStats(
  collection: Collection | null
): CollectionProgressStats {
  const displayAwards = buildDisplayAwards(collection);
  const earnedTypes = new Set(
    collection?.awards.map((a) => a.award_type) ?? []
  );
  const totalAwardSlots = displayAwards.length;
  const earnedCount = displayAwards.filter((a) =>
    earnedTypes.has(a.type)
  ).length;
  const progressPct =
    totalAwardSlots > 0 ? (earnedCount / totalAwardSlots) * 100 : 0;
  return { earnedCount, totalAwardSlots, progressPct };
}
