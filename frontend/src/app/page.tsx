'use client';
import React from 'react';
import Hero from '@/components/home/Hero';
import Section from '@/components/home/Section';
import BookSection from '@/components/home/BookSection';
import GenrePage from '@/app/genres/[slug]/page';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div>
        <Hero />
        <GenrePage />
        <BookSection />
        <Section />
      </div>
    </div>
  );
}
