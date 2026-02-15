import React from 'react'
import Hero from '@/components/home/Hero'
import Section from '@/components/home/Section'
import BookSection from '@/components/home/BookSection'
import GenrePage from '@/app/genres/[slug]/page'

const HomePage = () => {
  return (
    <>
    <Hero />
    <GenrePage />
    <BookSection />
    <Section />
    </>
  )
}

export default HomePage
