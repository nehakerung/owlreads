'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { resetStudentPassword } from '@/lib/api';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await resetStudentPassword(userId, password);
      setMessage('Password reset successful!');
      setPassword('');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Reset Password for Student #{userId}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}

      <button
        onClick={() => router.back()}
        className="mt-4 text-sm text-gray-500 underline"
      >
        Go Back
      </button>
    </div>
  );
}
