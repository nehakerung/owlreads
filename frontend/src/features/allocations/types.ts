export type AllocationStatusKey = 'not_started' | 'reading' | 'read';
export type AllocationSortOrder = 'newest' | 'oldest';

export type Student = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name?: string;
};

export type Allocation = {
  entry_id: number;
  book_id: number;
  book_title: string;
  student_id: number;
  student_name: string;
  allocated_at: string | null;
  status: string;
  updated_at?: string | null;
};

export type AllocationGroup = {
  book_id: number;
  book_title: string;
  allocations: Allocation[];
  sortTimeMs: number;
};

export type AllocationStats = {
  total: number;
  notStarted: number;
  reading: number;
  read: number;
  engaged: number;
  engagedPct: number;
  readPct: number;
};
