import React from 'react';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import SolutionSection from '../components/SolutionSection';
import ImpactSection from '../components/ImpactSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <ImpactSection />
    </>
  );
};

export default HomePage;
