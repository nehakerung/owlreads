import React from 'react'
import { FaLaughBeam } from 'react-icons/fa'

function GenreBtn() {
  return (
    <button className="cat-btn">
      {/* Icon Container */}
      <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm">
        <FaLaughBeam />
      </div>

      {/* Category Name */}
      <p className="font-semibold text-[#473c38] text-[16px]">Comedy</p>
    </button>
  )
}

export default GenreBtn
