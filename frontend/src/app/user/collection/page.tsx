'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Trophy, BookCheck, Lock, Sparkles } from 'lucide-react';

interface Award {
  id: number;
  award_type: string;
  award_display: string;
  earned_at: string;
}

interface CatalogGenre {
  slug: string;
  label: string;
}

interface Collection {
  id: number;
  awards: Award[];
  catalog_genres: CatalogGenre[];
  created_at: string;
}

const GENRE_AWARD_PREFIX = 'genre__';

const MILESTONE_AWARDS = [
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

type DisplayAward =
  | {
      kind: 'milestone';
      type: string;
      label: string;
      description: string;
      threshold: number;
    }
  | {
      kind: 'genre';
      type: string;
      label: string;
      description: string;
    };

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

  const displayAwards = useMemo((): DisplayAward[] => {
    const genres = collection?.catalog_genres ?? [];
    const milestoneRows: DisplayAward[] = MILESTONE_AWARDS.map((a) => ({
      kind: 'milestone' as const,
      type: a.type,
      label: a.label,
      description: a.description,
      threshold: a.threshold,
    }));
    const genreRows: DisplayAward[] = genres.map((g) => ({
      kind: 'genre' as const,
      type: `${GENRE_AWARD_PREFIX}${g.slug}`,
      label: `${g.label}`,
      description: 'Finish at least one book tagged with this genre.',
    }));
    return [...milestoneRows, ...genreRows];
  }, [collection?.catalog_genres]);

  const totalAwardSlots = displayAwards.length;

  const earnedTypes = useMemo(
    () => new Set(collection?.awards.map((a) => a.award_type) ?? []),
    [collection?.awards]
  );

  const earnedCount = useMemo(
    () => displayAwards.filter((a) => earnedTypes.has(a.type)).length,
    [displayAwards, earnedTypes]
  );

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const progressPct =
    totalAwardSlots > 0 ? (earnedCount / totalAwardSlots) * 100 : 0;

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
            {earnedCount} of {totalAwardSlots} awards earned
            {totalAwardSlots > MILESTONE_AWARDS.length ? (
              <span className="block mt-1 text-xs">
                Includes reading milestones and one medal per genre in the
                catalog.
              </span>
            ) : null}
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Milestones */}
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Reading milestones
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {displayAwards
            .filter((a) => a.kind === 'milestone')
            .map((award) => {
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
                  <div
                    className={`rounded-full p-3 flex-shrink-0 ${
                      earned
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {earned ? <BookCheck size={22} /> : <Lock size={22} />}
                  </div>

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

        {/* Genre medals */}
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Genre medals
        </h3>
        {displayAwards.filter((a) => a.kind === 'genre').length === 0 ? (
          <p className="text-sm text-muted-foreground mb-6">
            No genres are stored on books yet. Medals will appear here as your
            catalog grows.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayAwards
              .filter((a) => a.kind === 'genre')
              .map((award) => {
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
                    <div
                      className={`rounded-full p-3 flex-shrink-0 ${
                        earned
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {earned ? <Sparkles size={22} /> : <Lock size={22} />}
                    </div>

                    <div>
                      <p className="font-semibold">{award.label}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
                        Genre medal
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {award.description}
                      </p>
                      {earned && earnedAward && (
                        <p className="text-xs text-amber-700 mt-1">
                          Earned{' '}
                          {new Date(earnedAward.earned_at).toLocaleDateString()}
                        </p>
                      )}
                      {!earned && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Mark a book in this genre as read to unlock
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
