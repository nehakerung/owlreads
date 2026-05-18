export type ProfileUser = {
  id: number;
  username: string;
  email?: string | null;
  first_name: string;
  last_name: string;
  classname?: string | null;
  teachername?: string | null;
  books_read_count?: number;
  books_reading_count?: number;
  books_to_read_count?: number;
  last_shelf_update?: string;
};

export type BookshelfStats = {
  read: number;
  reading: number;
  toRead: number;
  lastShelfUpdate?: string;
};

export function bookshelfStatsFromUser(user: ProfileUser): BookshelfStats {
  return {
    read: user.books_read_count ?? 0,
    reading: user.books_reading_count ?? 0,
    toRead: user.books_to_read_count ?? 0,
    lastShelfUpdate: user.last_shelf_update,
  };
}
