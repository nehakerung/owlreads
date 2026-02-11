'use client';
 
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
<div className="flex-center flex-wrap my-6 gap-4">
<div className="flex items-center gap-2">
  {/* Previous button - only show if not on first page */}
  {currentPage > 1 && (
    <button
      onClick={() => handleClick(currentPage - 1)}
      className="flex items-center gap-1 px-4 py-2 border rounded hover:bg-gray-100 transition"
    >
      <HiOutlineArrowSmLeft />
      Previous
    </button>
  )}
  
  {/* Page numbers */}
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index + 1}
      onClick={() => handleClick(index + 1)}
      disabled={currentPage === index + 1}
      className={`px-4 py-2 border rounded transition ${
        currentPage === index + 1
          ? 'bg-[#473c38] text-white font-bold cursor-not-allowed'
          : 'hover:bg-gray-100'
      }`}
    >
      {index + 1}
    </button>
  ))}
  
  {/* Next button - only show if not on last page */}
  {currentPage < totalPages && (
    <button
      onClick={() => handleClick(currentPage + 1)}
      className="flex items-center gap-1 px-4 py-2 border rounded hover:bg-gray-100 transition"
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