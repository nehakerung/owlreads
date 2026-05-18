'use client';

import type { ProfileUser } from './types';

type ProfileDetailsCardProps = {
  user: ProfileUser;
  heading: string;
  showEditButton?: boolean;
  onEdit?: () => void;
};

function displayValue(value: string | null | undefined) {
  return value ?? '—';
}

export function ProfileDetailsCard({
  user,
  heading,
  showEditButton = false,
  onEdit,
}: ProfileDetailsCardProps) {
  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{heading}</h2>
        {showEditButton && onEdit ? (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            Edit Profile
          </button>
        ) : null}
      </div>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Email:</span>{' '}
          {displayValue(user.email)}
        </p>
        <p>
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p>
          <span className="font-semibold">User ID:</span> {user.id}
        </p>
        <p>
          <span className="font-semibold">First Name:</span>{' '}
          {displayValue(user.first_name)}
        </p>
        <p>
          <span className="font-semibold">Last Name:</span>{' '}
          {displayValue(user.last_name)}
        </p>
        <p>
          <span className="font-semibold">Class Name:</span>{' '}
          {displayValue(user.classname)}
        </p>
        <p>
          <span className="font-semibold">Teacher Name:</span>{' '}
          {displayValue(user.teachername)}
        </p>
      </div>
    </div>
  );
}
