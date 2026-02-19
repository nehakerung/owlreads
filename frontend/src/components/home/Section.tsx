import React from 'react';
import Card from './Card';

const Section = () => {
  return (
    <section className="main-max-width padding-x mx-auto">
      <h2 className="my-9 text-center text-xl font-bold">Browse By</h2>

      {/* Content */}
      <div className="flex justify-center flex-wrap gap-8">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </section>
  );
};

export default Section;
