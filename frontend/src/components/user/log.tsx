'use client';
import { FiBookOpen } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Log() {
  const { user, logout, loading } = useAuth();

  // Show nothing or a placeholder while loading
  if (loading) {
    return (
      <div className="w-20 h-10"></div> // placeholder to prevent layout shift
    );
  }

  if (!user) {
    return (
      <Link href="/user/login">
        <button className="btnprimary">Login</button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/user/profile"
        className="text-lg font-medium hover:text-gray-700 transition"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brown shadow-md"></div>
      </Link>
      <Link
        href="/user/bookshelf"
        className="text-lg font-medium hover:text-gray-700 transition"
      >
        <div className="relative flex items-center h-10 w-10 justify-center">
          <FiBookOpen className="text-4xl" />
        </div>
      </Link>

      <button className="btnprimary" onClick={logout}>
        Log Out
      </button>
    </div>
  );
}
