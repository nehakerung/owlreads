'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import RequireAuth from '@/components/auth/RequireAuth';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { apiClient } from '@/services/api/client';
import { getApiErrorMessage } from '@/lib/apiError';

function EditProfileForm() {
  const { user, setUser } = useAuth();
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
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        classname: user.classname || '',
        teachername: user.teachername || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.patch('/auth/user/update/', formData);
      setUser(response.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => router.push('/user/profile'), 1500);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

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

          {error ? <AlertBanner className="mb-4">{error}</AlertBanner> : null}
          {success ? (
            <AlertBanner variant="success" className="mb-4">
              {success}
            </AlertBanner>
          ) : null}

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

export default function EditProfile() {
  return (
    <RequireAuth>
      <EditProfileForm />
    </RequireAuth>
  );
}
