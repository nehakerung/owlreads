import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Quote, Star } from 'lucide-react';
import {
  createReaderReview,
  fetchReaderReviews,
  ReaderReview,
} from '@/services/api/reviews';
import { useAuth } from '@/context/AuthContext';

interface Review {
  id: number;
  name: string;
  role: string;
  rating: number;
  comment: string;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={14}
          className={
            index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }
        />
      ))}
    </div>
  );
}

interface ReviewsSectionProps {
  bookId: number;
  bookTitle: string;
}

const ReviewsSection = ({ bookId, bookTitle }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = useMemo(() => {
    if (!user) return '';
    const full = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
    return full || user.username;
  }, [user]);

  const displayRole = useMemo(() => {
    if (!user?.role) return '';
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  }, [user?.role]);

  useEffect(() => {
    fetchReaderReviews(bookId)
      .then((res) => {
        const apiReviews: Review[] = (res.data || []).map(
          (review: ReaderReview) => ({
            id: review.id,
            name: review.name,
            role: review.role,
            rating: review.rating,
            comment: review.comment,
          })
        );
        setReviews(apiReviews);
      })
      .catch(() => {
        setReviews([]);
      });
  }, [bookId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (!comment.trim()) {
      setError('Please write a short review before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await createReaderReview({
        book: bookId,
        name: displayName,
        role: displayRole,
        rating,
        comment: comment.trim(),
      });
      const updated = await fetchReaderReviews(bookId);
      setReviews(
        updated.data.map((review) => ({
          id: review.id,
          name: review.name,
          role: review.role,
          rating: review.rating,
          comment: review.comment,
        }))
      );
      setComment('');
      setRating(5);
    } catch {
      setError('Unable to submit review right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bp-desc-section">
      <div className="rounded-2xl bg-card p-6 md:p-10 shadow-sm border border-border">
        <div className="mb-8 text-center">
          <h2 className="mt-2 text-2xl font-bold">Reviews</h2>
        </div>

        {user ? (
          <form onSubmit={handleSubmit} className="mb-6 rounded-xl border p-4">
            <p className="text-sm font-medium mb-3">Add your review</p>
            <div className="grid gap-3 md:grid-cols-[auto,1fr] md:items-center">
              <label htmlFor="rating" className="text-sm text-muted-foreground">
                Rating
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="rounded-md border border-border bg-background px-3 py-2"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} star{value > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <label
              htmlFor="comment"
              className="mt-3 block text-sm text-muted-foreground"
            >
              Review
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              rows={3}
              placeholder="Share what you thought about this book..."
            />
            {error ? (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="btnprimary mt-3"
            >
              {submitting ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        ) : (
          <p className="mb-6 text-sm text-muted-foreground">
            Log in to add a review for this book.
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-border bg-background p-5"
            >
              <Quote size={16} className="mb-3 text-muted-foreground" />
              <p className="text-sm leading-relaxed">{review.comment}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
                <RatingStars rating={review.rating} />
              </div>
            </article>
          ))}
        </div>
        {reviews.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No reviews yet for this book. Be the first to leave one.
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default ReviewsSection;
