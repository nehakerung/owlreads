'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function EditProfile() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    classname: '',
    teachername: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user/login');
    }
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        classname: user.classname || '',
        teachername: user.teachername || '',
      });
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = Cookies.get('access_token');
      const response = await axios.patch(
        'http://localhost:8000/api/auth/user/update/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setUser(response.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => router.push('/user/profile'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const fields: {
    label: string;
    name: keyof typeof formData;
    type?: string;
  }[] = [
    { label: 'First Name', name: 'first_name' },
    { label: 'Last Name', name: 'last_name' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Class Name', name: 'classname' },
    { label: 'Teacher Name', name: 'teachername' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-semibold mb-1">
                  {label}
                </label>
                <input
                  type={type || 'text'}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btnsecondary disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/user/profile')}
                className="px-6 py-2 border border-input rounded-lg hover:bg-muted transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
