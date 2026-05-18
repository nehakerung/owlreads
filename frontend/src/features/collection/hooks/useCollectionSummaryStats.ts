'use client';

import { useMemo } from 'react';
import { getCollectionProgressStats } from '../lib/collectionProgress';
import type { Collection } from '../lib/types';

export function useCollectionSummaryStats(collection: Collection | null) {
  return useMemo(() => getCollectionProgressStats(collection), [collection]);
}
