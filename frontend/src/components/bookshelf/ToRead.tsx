import React from 'react'
import BookCard from '../home/BookCard'

const ToRead = () => {
  return (
    <section className="main-max-width padding-x mx-auto my-10">
    <h2 className="text-center text-2xl font-bold text-gray-800 mt-2 mb-4 max-sm:text-[16px]">
        Books to Read
    </h2>

    {/* Content */}
    <div className="flex items-center w-[full] gap-4 px-6 py-6 custom-overflow border border-gray-200 bg-white rounded-lg shadow-sm">
     
     <BookCard />
     <BookCard />
     <BookCard />
     <BookCard />
     <BookCard />

    </div>
  </section>
  )
}

export default ToRead