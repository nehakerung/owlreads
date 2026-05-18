'use client';

import Link from 'next/link';
import type { BookshelfStats } from '../types';

type BookshelfStatsGridProps = {
  stats: BookshelfStats;
  linkable?: boolean;
};

type StatCellProps = {
  value: number;
  label: string;
  className: string;
  labelClassName: string;
  href?: string;
};

function StatCell({
  value,
  label,
  className,
  labelClassName,
  href,
}: StatCellProps) {
  const content = (
    <>
      <div className={`text-2xl font-bold ${labelClassName}`}>{value}</div>
      <div className={`text-sm ${labelClassName}`}>{label}</div>
    </>
  );

  const cellClass = `text-center p-4 rounded-lg ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${cellClass} block hover:ring-2 hover:ring-current/20 transition`}
      >
        {content}
      </Link>
    );
  }

  return <div className={cellClass}>{content}</div>;
}

export function BookshelfStatsGrid({
  stats,
  linkable = false,
}: BookshelfStatsGridProps) {
  const total = stats.read + stats.reading + stats.toRead;

  return (
    <div className="bg-card rounded-lg shadow p-6 mt-6">
      <h3 className="text-xl font-bold mb-4">Bookshelf Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCell
          value={stats.read}
          label="Books Read"
          className="bg-green-50"
          labelClassName="text-[var(--mint)]"
          href={linkable ? '/user/bookshelf?status=read' : undefined}
        />
        <StatCell
          value={stats.reading}
          label="Currently Reading"
          className="bg-yellow-50"
          labelClassName="text-[var(--yellow)]"
          href={linkable ? '/user/bookshelf?status=reading' : undefined}
        />
        <StatCell
          value={stats.toRead}
          label="To Read"
          className="bg-red-50"
          labelClassName="text-[var(--red)]"
          href={linkable ? '/user/bookshelf?status=to_read' : undefined}
        />
        <StatCell
          value={total}
          label="Total Books"
          className="bg-gray-50"
          labelClassName="text-gray-700"
          href={linkable ? '/user/bookshelf' : undefined}
        />
      </div>
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Last Activity:</span>{' '}
          {stats.lastShelfUpdate
            ? new Date(stats.lastShelfUpdate).toLocaleDateString()
            : 'No activity yet'}
        </p>
      </div>
    </div>
  );
}
