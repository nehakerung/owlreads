import React from 'react';
import { FaBookOpen } from 'react-icons/fa';

type GenreBtnProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

function GenreBtn({ label, active = false, onClick }: GenreBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cat-btn ${active ? 'ring-2 ring-secondary' : ''}`}
      aria-pressed={active}
    >
      <div className="w-10 h-10 secondary-bg rounded-full overflow-hidden flex items-center justify-center shadow-sm">
        <FaBookOpen className="text-secondary-foreground" />
      </div>
      <p className="font-semibold primary-text text-[16px]">{label}</p>
    </button>
  );
}

export default GenreBtn;
