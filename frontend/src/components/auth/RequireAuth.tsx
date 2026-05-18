'use client';

import { useAuth } from '@/context/AuthContext';
import { PageLoading } from '@/components/ui/PageLoading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type RequireAuthProps = {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
};

export default function RequireAuth({
  children,
  loadingFallback,
}: RequireAuthProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <>{loadingFallback ?? <PageLoading />}</>;
  }

  if (!user) {
    return (
      <>
        {loadingFallback ?? (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400 text-sm">Redirecting to login...</p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
