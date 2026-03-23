'use client';
import { FiBookOpen } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { HiUserGroup } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa6';

export default function Log() {
  const { user, logout, isTeacher, loading } = useAuth();

  // Prevent layout shift
  if (loading) {
    return <div className="h-10 w-20" />;
  }

  // Logged out
  if (!user) {
    return (
      <div className="flex items-center h-10">
        <Link href="/user/login">
          <button className="btnprimary">Login</button>
        </Link>
      </div>
    );
  }

  // Logged in
  return (
    <div className="flex items-center gap-3 h-10">
      {isTeacher && (
        <Link href="/teacher">
          <div className="flex items-center justify-center w-10 h-10">
            <HiUserGroup className="text-2xl" />
          </div>
        </Link>
      )}

      <Link href="/user/profile">
        <div className="flex items-center justify-center w-10 h-10">
          <FaUser className="text-2xl" />
        </div>
      </Link>

      <Link href="/user/bookshelf">
        <div className="flex items-center justify-center w-10 h-10">
          <FiBookOpen className="text-2xl" />
        </div>
      </Link>

      <button className="btnprimary" onClick={logout}>
        Log Out
      </button>
    </div>
  );
}
