'use client';

import RequireAuth from '@/components/user/RequireAuth';
import { MyCollection, useUserCollection } from '@/components/collection';
import { useAuth } from '@/context/AuthContext';

function CollectionContent() {
  const { user } = useAuth();
  const { collection, fetching, error } = useUserCollection(user);

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <MyCollection collection={collection} error={error} loading={fetching} />
    </div>
  );
}

export default function CollectionPage() {
  return (
    <RequireAuth>
      <CollectionContent />
    </RequireAuth>
  );
}
