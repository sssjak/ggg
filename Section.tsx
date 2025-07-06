import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  return (
    <section id={id} className="py-8 scroll-mt-20">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-highlight tracking-wide">
        {title}
      </h2>
      <div className="max-w-5xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default Section;