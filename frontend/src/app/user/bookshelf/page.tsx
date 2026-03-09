import RequireAuth from '@/components/user/RequireAuth';
import BookShelfPage from '@/components/bookshelf/BookShelfPage';
import Link from 'next/link';
export default function ShelfPage() {
  return (
    <RequireAuth>
      <BookShelfPage />
      <div className="flex-center px-6 py-16 main-max-width mx-auto padding-x">
        <Link href="/" className="btnsecondary inline-block mt-6">
          Go back home
        </Link>
      </div>
    </RequireAuth>
  );
}
