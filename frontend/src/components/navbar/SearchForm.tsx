'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { FormEvent } from 'react';

export default function HomePage() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;

    if (query.trim()) {
      // Redirect to search results page with query parameter
      router.push(`/book/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        name="query"
        type="text"
        className="flex-1 font-bold w-full justify-center outline-none"
        placeholder="Search for books..."
        autoFocus
      />
      <button
        type="submit"
        className="size-7 rounded-full bg-[#473c38] text-white flex justify-center items-center hover:bg-[#5a4d47] transition"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
}
