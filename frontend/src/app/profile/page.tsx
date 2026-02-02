
import BookCard from '@/src/components/home/BookCard'
import React from 'react'
import CurrentReads from '@/src/components/bookshelf/CurrentReads'
import PastReads from '@/src/components/bookshelf/PastReads'
import ToRead from '@/src/components/bookshelf/ToRead'

const ProfilePage = () => {
  return (
    <>
    <CurrentReads />
    <ToRead />
    <PastReads />



    </>
  )
}

export default ProfilePage