import React from 'react';
import { IoTrophySharp } from 'react-icons/io5';

const CategoryCard = () => {
  return (
    <div className="w-55 h-30 bg-white rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer">
      {/* Category Icon */}
      <div className="bg-gray-100 p-3 rounded-full">
        <IoTrophySharp />
      </div>

      {/* Category Name */}
      <p className="font-semibold mt-3 text-gray-800">Popularity</p>
    </div>
  );
};

export default CategoryCard;
