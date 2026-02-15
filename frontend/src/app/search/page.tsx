"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowLeft } from "lucide-react";
import { FormEvent } from "react";
import Pagination from "@/components/pagination/pagination";

interface Books {
  id: number;
  title: string;
  author: string;
  thumbnail: string;
  description: string;
}
const API_BASE_URL = "http://127.0.0.1:8000/api";

async function searchBooks(query: string, maxResults = 30) {
  if (!query) return [];

  try {
    const url = `${API_BASE_URL}/books/?q=${encodeURIComponent(query)}&max_results=${maxResults}`;
    console.log("Fetching:", url);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Error response:", errorData);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

const BookItem = ({ id, title, authors, description, thumbnail, published_date }: any) => {
  return (
    <div data-id={id} className="book-item border p-4 mb-4 rounded-lg shadow hover:shadow-lg transition">
      <div className="flex gap-4">
        {thumbnail && (
          <img
            src={thumbnail.replace('http:', 'https:')}
            alt={title}
            className="w-24 h-32 object-cover rounded"
            onError={(e: any) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          {authors && authors.length > 0 && (
            <p className="text-gray-600 mb-1">By: {authors.join(", ")}</p>
          )}
        </div>
      </div>
      {description && (
        <p className="mt-3 text-gray-700 line-clamp-3">{description}</p>
      )}
    </div>
  );
};

export default function SearchPage() {
  const [bookItems, setBookItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 10;

  // Handle new search from this page
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get("query") as string;

    if (newQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(newQuery)}`);
    }
  };

  // Fetch books when query changes
  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        setBookItems([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      /* Need to typ with api response const response: MyType[] = await fetchData(); */
      try {
        const data = await searchBooks(query);
        setBookItems(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err: any) {
        console.error("Error loading books:", err);
        setError(`Failed to load books: ${err.message}`);
        setBookItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);
const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = bookItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header with back button and search */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="size-5" />
          Back to Home
        </button>

        <h1 className="text-3xl font-bold mb-4">Search Results for "{query}"</h1>
      </div>

      {/* Results */}
      <div>
        {loading && (
          <div className="text-center py-8">
            <p className="text-lg">Searching for "{query}"...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && bookItems.length === 0 && query && (
          <p className="text-center text-gray-600 py-8">No books found for "{query}"</p>
        )}

        {!loading && !error && bookItems.length > 0 && (
          <div>
            <p className="text-gray-600 mb-4 font-semibold">
              Found {bookItems.length} results for "{query}"
            </p>
            {currentItems.map((item: any) => (
              <BookItem
                key={item.id}
                {...item}
              />
            ))}
            <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
          </div>
        )}
      </div>
    </div>
  );
}
