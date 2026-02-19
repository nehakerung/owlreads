'use client';
import React from 'react';
import Hero from '@/components/home/Hero';
import Section from '@/components/home/Section';
import BookSection from '@/components/home/BookSection';
import GenrePage from '@/app/book/genres/[slug]/page';

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
        <GenrePage />
        <BookSection />
        <Section />
      </div>
    </div>
  );
}
