'use client';
import React from 'react';
import Hero from '@/features/home/components/Hero';
import BookSection from '@/features/home/components/BookSection';
import { RecentReadsSuggestions } from '@/features/home';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  return (
    <div className="p-10 min-h-screen flex items-center justify-center --background">
      <div>
        <Hero />
        <BookSection />
        <RecentReadsSuggestions />
      </div>
    </div>
  );
}
