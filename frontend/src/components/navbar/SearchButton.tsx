import { Search, X } from 'lucide-react';
import React from 'react';

interface Props {
  handleSearch: () => void;
  showSearchForm: boolean;
}

const SearchButton = ({ handleSearch, showSearchForm }: Props) => {
  return (
    <button
      onClick={handleSearch}
      className="size-8 rounded-full flex justify-center items-center bg-[#473c38] text-white hover:bg-[#5a4d47] transition"
    >
      {showSearchForm ? (
        <X className="size-4" />
      ) : (
        <Search className="size-4" />
      )}
    </button>
  );
};

export default SearchButton;
