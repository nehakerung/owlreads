export interface Award {
  id: number;
  award_type: string;
  award_display: string;
  earned_at: string;
}

export interface CatalogGenre {
  slug: string;
  label: string;
}

export interface Collection {
  id: number;
  awards: Award[];
  catalog_genres: CatalogGenre[];
  created_at: string;
}

export type DisplayAward =
  | {
      kind: 'milestone';
      type: string;
      label: string;
      description: string;
      threshold: number;
    }
  | {
      kind: 'genre';
      type: string;
      label: string;
      description: string;
    };
