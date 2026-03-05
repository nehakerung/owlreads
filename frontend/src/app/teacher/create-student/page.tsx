'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createStudent } from '@/lib/api';

export default function CreateStudentPage() {
  const router = useRouter();
  const { isTeacher } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await createStudent(formData);
      setMessage('Student created successfully!');
      setFormData({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
      });
    } catch (error: any) {
      setMessage('Error creating student.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  if (!isTeacher) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">
          You are not authorized to view this page.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-gray-500 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-6">Create Student Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Temporary Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? 'Creating...' : 'Create Student'}
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
