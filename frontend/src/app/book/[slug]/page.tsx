'use client';
import '@/styles/bp.css';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  User,
  ExternalLink,
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface BookDetail {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  published_date: string;
  publisher?: string;
  page_count?: number;
  categories?: string[];
  preview_link?: string;
  average_rating?: number;
  ratings_count?: number;
}

async function fetchBook(id: string): Promise<BookDetail> {
  const res = await fetch(`${API_BASE_URL}/books/${id}/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch book (status ${res.status})`);
  }

  return res.json();
}
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="bp-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`bp-star ${
            i < Math.round(rating) ? 'bp-star--on' : 'bp-star--off'
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
          width={14}
          height={14}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function BookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.slug as string;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetchBook(id)
      .then((data) => setBook(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading book details...</p>;
  if (error || !book)
    return <p className="error">Error loading book details: {error}</p>;

  const year = book.published_date ? book.published_date.slice(0, 4) : null;

  const hasCover = book.thumbnail && !imgFailed;
  const coverSrc = book.thumbnail?.replace('http:', 'https:');

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="center">
          <button className="btn-icon" onClick={() => router.back()}>
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to results
          </button>

          {/* ── Split hero ── */}
          <div className="bp-hero">
            {/* Left: cover panel */}
            <div className="bp-cover-panel">
              <div className="bp-cover-frame">
                {hasCover ? (
                  <img
                    src={coverSrc}
                    alt={`Cover of ${book.title}`}
                    className="bp-cover-img"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="bp-cover-fallback">
                    <BookOpen size={48} strokeWidth={1} />
                    <span>No cover</span>
                  </div>
                )}
                {/* spine accent */}
                <div className="bp-spine" />
              </div>

              {/* Rating badge if available */}
              {book.average_rating && (
                <div className="bp-rating-badge">
                  <StarRow rating={book.average_rating} />
                  <span className="bp-rating-num">
                    {book.average_rating.toFixed(1)}
                  </span>
                  {book.ratings_count && (
                    <span className="bp-rating-count">
                      {book.ratings_count.toLocaleString()} ratings
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: metadata */}
            <div className="bp-meta-panel">
              {book.categories && book.categories.length > 0 && (
                <div className="bp-chips">
                  {book.categories.slice(0, 3).map((c) => (
                    <span key={c} className="bp-chip">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="bp-title">{book.title}</h1>

              {book.authors?.length > 0 && (
                <p className="bp-authors">
                  <User size={14} strokeWidth={2} className="bp-icon" />
                  {book.authors.join(', ')}
                </p>
              )}

              <div className="bp-facts">
                {year && (
                  <span className="bp-fact">
                    <Calendar size={13} strokeWidth={2} />
                    {year}
                  </span>
                )}
                {book.publisher && (
                  <span className="bp-fact">
                    <BookOpen size={13} strokeWidth={2} />
                    {book.publisher}
                  </span>
                )}
                {book.page_count && (
                  <span className="bp-fact">
                    {book.page_count.toLocaleString()} pp.
                  </span>
                )}
              </div>

              {book.preview_link && (
                <a
                  href={book.preview_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bp-preview-btn"
                >
                  <ExternalLink size={14} strokeWidth={2.5} />
                  Preview on Google Books
                </a>
              )}
            </div>
          </div>

          {book.description && (
            <section className="bp-desc-section">
              <h2 className="bp-desc-heading">About this book</h2>
              <div
                className="bp-desc-body"
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            </section>
          )}

          {!book.description && (
            <section className="bp-desc-section">
              <p className="bp-no-desc">
                No description available for this title.
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
