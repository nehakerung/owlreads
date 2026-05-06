import { GENRE_AWARD_PREFIX, MILESTONE_AWARDS } from './constants';
import type { Collection, DisplayAward } from './types';

export function buildDisplayAwards(
  collection: Collection | null
): DisplayAward[] {
  const genres = collection?.catalog_genres ?? [];
  const milestoneRows: DisplayAward[] = MILESTONE_AWARDS.map((a) => ({
    kind: 'milestone' as const,
    type: a.type,
    label: a.label,
    description: a.description,
    threshold: a.threshold,
  }));
  const genreRows: DisplayAward[] = genres.map((g) => ({
    kind: 'genre' as const,
    type: `${GENRE_AWARD_PREFIX}${g.slug}`,
    label: `${g.label}`,
    description: 'Finish at least one book tagged with this genre.',
  }));
  return [...milestoneRows, ...genreRows];
}
