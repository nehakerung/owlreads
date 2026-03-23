import RequireAuth from '@/components/user/RequireAuth';
import BookShelfPage from '@/components/bookshelf/BookShelfPage';
import Link from 'next/link';
export default function ShelfPage() {
  return (
    <RequireAuth>
      <BookShelfPage />
      <div className="flex-center max-w-4xl w-full mx-auto px-4 py-16">
        <Link href="/" className="btnsecondary inline-block mt-6">
          Go back home
        </Link>
      </div>
    </RequireAuth>
  );
}
