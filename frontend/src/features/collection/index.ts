export { AwardCard } from './components/AwardCard';
export { CollectionSummaryHeader } from './components/CollectionSummaryHeader';
export type { CollectionSummaryHeaderProps } from './components/CollectionSummaryHeader';
export { MyCollection } from './components/MyCollection';
export type { MyCollectionProps } from './components/MyCollection';
export { buildDisplayAwards } from './lib/buildDisplayAwards';
export {
  getCollectionProgressStats,
  type CollectionProgressStats,
} from './lib/collectionProgress';
export { GENRE_AWARD_PREFIX, MILESTONE_AWARDS } from './lib/constants';
export { useCollectionSummaryStats } from './hooks/useCollectionSummaryStats';
export { useUserCollection } from './hooks/useUserCollection';
export type {
  Award,
  CatalogGenre,
  Collection,
  DisplayAward,
} from './lib/types';
