"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "next/form";
import { Search } from "lucide-react";

interface Book {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  thumbnail?: string;
  published_date?: string;
}

/**
 * Fetches books based on search query.
 * @param {string} query The search query.
 * @param {number} maxResults Maximum number of results to return.
 */
async function searchBooks(query: string, maxResults: number = 10): Promise<Book[]> {
  if (!query) return [];

  const res = await fetch(
    `http://127.0.0.1:8000/api/books/?q=${encodeURIComponent(query)}&max_results=${maxResults}`
  );

  if (!res.ok) {
    throw new Error("Failed to search books");
  }
  return res.json();
}

/**
 * Fetches a single book by ID.
 * @param {string} id The ID of the book to retrieve.
 */
async function getBookById(id: string): Promise<Book> {
  const res = await fetch(`http://127.0.0.1:8000/api/books/${id}/`);

  if (!res.ok) {
    throw new Error("Failed to retrieve book");
  }
  return res.json();
}

const SearchForm = () => {
  return (
    <Form action="/" scroll={false} className="search-form">
      <input
        name="query"
        className="flex-1 font-bold w-full outline-none"
        placeholder="Search for books"
      />
      <button
        type="submit"
        className="size-7 rounded-full bg-[#473c38] flex justify-center items-center cursor-pointer text-grey"
      >
        <Search className="size-4" />
      </button>
    </Form>
  );
};

const BookItem = ({
  id,
  title,
  authors,
  description,
  thumbnail,
  published_date
}: Book) => {
  return (
    <div data-id={id} className="book-item border p-4 mb-4 rounded-lg">
      <div className="flex gap-4">
        {thumbnail && (
          <img src={thumbnail} alt={title} className="w-24 h-32 object-cover" />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold">{title}</h3>
          {authors && authors.length > 0 && (
            <p className="text-gray-600">By: {authors.join(", ")}</p>
          )}
          {published_date && (
            <p className="text-sm text-gray-500">Published: {published_date}</p>
          )}
        </div>
      </div>
      {description && (
        <p className="mt-2 text-gray-700 line-clamp-3">{description}</p>
      )}
    </div>
  );
};

/**
 * The main page component.
 */
export default function Page() {
  const [bookItems, setBookItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  // State for displaying a success message
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState({
    show: false,
    type: "", // either 'add' or 'update'
  });

  // Fetch books based on search query
  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        setBookItems([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await searchBooks(query, 20);
        setBookItems(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load books. Please try again.");
        setBookItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Detect changes in URL parameters for success messages
  useEffect(() => {
    const action = searchParams.get("action");
    if (!!action) {
      setDisplaySuccessMessage({
        type: action,
        show: true,
      });
      router.replace("/");
    }
  }, [searchParams, router]);

  // Automatically hide the success message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displaySuccessMessage.show) {
        setDisplaySuccessMessage({ show: false, type: "" });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [displaySuccessMessage.show]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Book Search</h1>

      <SearchForm />

      {displaySuccessMessage.show && (
        <p className="success-message bg-green-100 text-green-800 p-3 rounded mt-4">
          {displaySuccessMessage.type === "add" ? "Added a" : "Modified a"} book
          item.
        </p>
      )}

      <div className="mt-6">
        {loading && <p className="text-center">Loading...</p>}

        {error && (
          <p className="text-red-600 text-center">{error}</p>
        )}

        {!loading && !error && bookItems.length === 0 && query && (
          <p className="text-center text-gray-600">No books found for "{query}"</p>
        )}

        {!loading && !error && bookItems.length === 0 && !query && (
          <p className="text-center text-gray-600">Search for books to get started</p>
        )}

        {!loading && !error && bookItems.length > 0 && (
          <div>
            <p className="text-gray-600 mb-4">Found {bookItems.length} results</p>
            {bookItems.map((item) => (
              <BookItem
                key={item.id}
                id={item.id}
                title={item.title}
                authors={item.authors}
                description={item.description}
                thumbnail={item.thumbnail}
                published_date={item.published_date}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
