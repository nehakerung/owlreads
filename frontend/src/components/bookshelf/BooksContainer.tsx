import React from 'react'
import ShelfContainer from './ShelfContainer'

const BooksContainer = () => {
  return (
    <div className="w-full border border-gray-200 bg-white px-4 py-4 rounded-lg shadow-sm">
    <div className="w-full bg-gray-50 px-4 py-3 rounded-md flex items-center justify-between shadow-sm border border-gray-200">
      <small className="text-gray-500 text-xs sm:text-sm">Last updated : date</small>
    </div>

    <div className="w-full py-4 flex items-center gap-4 custom-overflow">
      <ShelfContainer />
    </div>


  </div>
  )
}

export default BooksContainer