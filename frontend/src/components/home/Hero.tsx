import React from 'react'


const Hero = () => {
  return (
    <section className="bg-yellow-50 px-6 py-16 text-center w-full">
    <div className="max-w-4xl mx-auto space-y-8 px-6 sm:px-12 md:px-16 lg:px-24">
      <h1 className="text-4xl font-extrabold text-brown-900 leading-snug md:text-5xl">
        Reading for pleasure
      </h1>
      <p className="text-lg text-brown-700 max-w-2xl mx-auto">
        Find the book for you from our curated selection of bestsellers, classics, and hidden gems across all genres.
      </p>
      <a
        href="#product_section"
        className="btnprimary"
      >
        Browse Now
      </a>
    </div>
  </section>
  )
}

export default Hero