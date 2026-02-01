import React from 'react'
import GenreBtn from '../../../components/genre/GenreBtn'
import BookCard from '../../../components/home/BookCard'

function GenrePage() {
    return (
    <div className='main-max-width mx-auto padding-x py-9'>
        <p className="font-semibold text-center">Browse Books by Genre</p>

        <div className="flex-center flex-wrap my-6 gap-4">
            <GenreBtn />
            <GenreBtn />
            <GenreBtn />
            <GenreBtn />
        </div>

    </div>
  )
}

export default GenrePage