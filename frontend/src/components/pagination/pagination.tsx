'use client';

import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from 'react-icons/hi';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleClick = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // how many pages around current page

    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  return (
    <div className="flex-center flex-wrap my-6 gap-4">
      <div className="flex items-center gap-2">
        {/* Previous button - only show if not on first page */}
        {currentPage > 1 && (
          <button
            onClick={() => handleClick(currentPage - 1)}
            className="btn-icon"
            // className="flex items-center gap-1 px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            <HiOutlineArrowSmLeft />
            Previous
          </button>
        )}

        {/* Page numbers */}
        <div className="flex justify-center gap-2 px-6 py-4">
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${page}-${index}`}
                onClick={() => handleClick(page as number)}
                disabled={currentPage === page}
                className={`px-4 py-2 border rounded transition ${
                  currentPage === page
                    ? 'secondary-active font-bold cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next button - only show if not on last page */}
        {currentPage < totalPages && (
          <button
            onClick={() => handleClick(currentPage + 1)}
            // className="btnsecondary items-center"
            className="btn-icon"
          >
            Next
            <HiOutlineArrowSmRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
