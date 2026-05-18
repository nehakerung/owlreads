'use client';

import { useAuth } from '@/context/AuthContext';
import AllocateButton from '@/features/bookshelf/AllocateBook';
import { ShelfButton } from '@/features/bookshelf/ShelfButton';

type BookRoleActionsProps = {
  bookId: number;
  className?: string;
};

export function BookRoleActions({ bookId, className }: BookRoleActionsProps) {
  const { isTeacher } = useAuth();

  return (
    <div className={className ?? 'bp-actions flex gap-3 flex-wrap'}>
      {!isTeacher && <ShelfButton bookId={bookId} />}
      {isTeacher && <AllocateButton bookId={bookId} />}
    </div>
  );
}
