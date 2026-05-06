'use client';

import { useMemo } from 'react';
import { getCollectionProgressStats } from './collectionProgress';
import type { Collection } from './types';

export function useCollectionSummaryStats(collection: Collection | null) {
  return useMemo(() => getCollectionProgressStats(collection), [collection]);
}
