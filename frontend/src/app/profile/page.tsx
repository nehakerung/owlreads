
import BookCard from '@/components/home/BookCard'
import React from 'react'
import CurrentReads from '@/components/bookshelf/CurrentReads'
import PastReads from '@/components/bookshelf/PastReads'
import ToRead from '@/components/bookshelf/ToRead'

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
