import RequireAuth from '@/components/user/RequireAuth';
import BookShelfPage from '@/components/bookshelf/BookShelfPage';
export default function ShelfPage() {
  return (
    <RequireAuth>
      <BookShelfPage />
    </RequireAuth>
  );
}
