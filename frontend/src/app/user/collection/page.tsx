'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MyCollection, useUserCollection } from '@/components/collection';

export default function CollectionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { collection, fetching, error } = useUserCollection(user);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user/login');
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <MyCollection collection={collection} error={error} />
    </div>
  );
}
