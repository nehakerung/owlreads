'use client';
import React from 'react';
import Hero from '@/components/home/Hero';
import Section from '@/components/home/Section';
import BookSection from '@/components/home/BookSection';
import GenrePage from '@/app/genres/[slug]/page';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/profile');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to JWT Auth Demo</h1>
        <p className="text-gray-600">Django + Next.js Authentication</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700"
          >
            Sign Up
          </Link>
        </div>
        <div>
          <Hero />
          <GenrePage />
          <BookSection />
          <Section />
        </div>
      </div>
    </div>
  );
}
