import React from 'react';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import SolutionSection from '../components/SolutionSection';
import ImpactSection from '../components/ImpactSection';
import TeamSection from '../components/TeamSection';
import ProductsPreviewSection from '../components/ProductsPreviewSection';
import PartnersSection from '../components/PartnersSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <ImpactSection />
      <TeamSection />
      <ProductsPreviewSection />
      <PartnersSection />
    </>
  );
};

export default HomePage;
