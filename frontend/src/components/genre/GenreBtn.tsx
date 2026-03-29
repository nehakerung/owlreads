import React from 'react';
import Link from 'next/link';
import { FaBookOpen } from 'react-icons/fa';

type GenreBtnProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
};

function GenreBtn({ label, active = false, onClick, href }: GenreBtnProps) {
  const className = `cat-btn no-underline text-inherit ${
    active ? 'ring-2 ring-secondary' : ''
  }`;

  const inner = (
    <>
      <div className="w-10 h-10 secondary-bg rounded-full overflow-hidden flex items-center justify-center shadow-sm">
        <FaBookOpen className="text-secondary-foreground" />
      </div>
      <p className="font-semibold primary-text text-[16px]">{label}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        aria-current={active ? 'page' : undefined}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-pressed={active}
    >
      {inner}
    </button>
  );
}

export default GenreBtn;
