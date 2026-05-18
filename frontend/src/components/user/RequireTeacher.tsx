'use client';

import { useAuth } from '@/context/AuthContext';
import RequireAuth from '@/components/user/RequireAuth';
import { UnauthorizedCard } from '@/components/ui/UnauthorizedCard';

type RequireTeacherProps = {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  unauthorizedClassName?: string;
};

export default function RequireTeacher({
  children,
  backHref = '/teacher',
  backLabel = 'Go to Dashboard',
  onBack,
  unauthorizedClassName,
}: RequireTeacherProps) {
  const { isTeacher } = useAuth();

  return (
    <RequireAuth>
      {isTeacher ? (
        children
      ) : (
        <UnauthorizedCard
          backHref={onBack ? undefined : backHref}
          backLabel={backLabel}
          onBack={onBack}
          className={unauthorizedClassName}
        />
      )}
    </RequireAuth>
  );
}
