'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Trophy, BookCheck, Lock } from 'lucide-react';

interface Award {
  id: number;
  award_type: string;
  award_display: string;
  earned_at: string;
}

interface Collection {
  id: number;
  awards: Award[];
  created_at: string;
}

const ALL_AWARDS = [
  {
    type: 'books_1',
    label: 'First Book Completed',
    description: 'Complete your first book',
    threshold: 1,
  },
  {
    type: 'books_2',
    label: '2 Books Completed',
    description: 'Complete 2 books',
    threshold: 2,
  },
  {
    type: 'books_3',
    label: '3 Books Completed',
    description: 'Complete 3 books',
    threshold: 3,
  },
  {
    type: 'books_5',
    label: '5 Books Completed',
    description: 'Complete 5 books',
    threshold: 5,
  },
  {
    type: 'books_10',
    label: '10 Books Completed',
    description: 'Complete 10 books',
    threshold: 10,
  },
];

export default function CollectionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchCollection = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(
          'http://localhost:8000/api/collection/',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCollection(response.data);
      } catch (err) {
        setError('Failed to load collection');
      } finally {
        setFetching(false);
      }
    };

    fetchCollection();
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const earnedTypes = new Set(
    collection?.awards.map((a) => a.award_type) ?? []
  );
  const earnedCount = earnedTypes.size;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-card rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={28} className="text-yellow-500" />
            <h2 className="text-2xl font-bold">My Collection</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {earnedCount} of {ALL_AWARDS.length} awards earned
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${(earnedCount / ALL_AWARDS.length) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Awards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALL_AWARDS.map((award) => {
            const earned = earnedTypes.has(award.type);
            const earnedAward = collection?.awards.find(
              (a) => a.award_type === award.type
            );

            return (
              <div
                key={award.type}
                className={`bg-card rounded-lg shadow p-5 flex items-start gap-4 transition ${
                  earned ? 'opacity-100' : 'opacity-50'
                }`}
              >
                {/* Icon */}
                <div
                  className={`rounded-full p-3 flex-shrink-0 ${
                    earned
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {earned ? <BookCheck size={22} /> : <Lock size={22} />}
                </div>

                {/* Text */}
                <div>
                  <p className="font-semibold">{award.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {award.description}
                  </p>
                  {earned && earnedAward && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Earned{' '}
                      {new Date(earnedAward.earned_at).toLocaleDateString()}
                    </p>
                  )}
                  {!earned && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Read {award.threshold} book
                      {award.threshold > 1 ? 's' : ''} to unlock
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
