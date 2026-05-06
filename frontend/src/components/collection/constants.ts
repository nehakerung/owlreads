export const GENRE_AWARD_PREFIX = 'genre__';

export const MILESTONE_AWARDS = [
  {
    type: 'books_1',
    label: 'First Book Completed',
    description: 'Complete your first book',
    threshold: 1,
  },
  {
    type: 'books_2',
    label: '2 Books Completed',
    description: 'Complete 2 books',
    threshold: 2,
  },
  {
    type: 'books_3',
    label: '3 Books Completed',
    description: 'Complete 3 books',
    threshold: 3,
  },
  {
    type: 'books_5',
    label: '5 Books Completed',
    description: 'Complete 5 books',
    threshold: 5,
  },
  {
    type: 'books_10',
    label: '10 Books Completed',
    description: 'Complete 10 books',
    threshold: 10,
  },
] as const;
