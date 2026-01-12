import React from 'react';
import './ImpactSection.css';

const ImpactSection = () => {
  const impacts = [
    {
      number: '85%',
      label: 'Loss Reduction',
      description: 'Average reduction in post-harvest losses'
    },
    {
      number: '2.5x',
      label: 'Income Growth',
      description: 'Increase in farmer income'
    },
    {
      number: '10,000+',
      label: 'Farmers Helped',
      description: 'Farmers using our solutions'
    },
    {
      number: '50%',
      label: 'Quality Improvement',
      description: 'Better product quality maintained'
    },
    {
      number: '30%',
      label: 'Global GHG Emission Reduction',
      description: 'Reduction in greenhouse gas emissions'
    }
  ];

  return (
    <section className="impact-section">
      <div className="container">
        <h2 className="section-title">Real Impact, Real Results</h2>
        <p className="section-subtitle">
          Our solutions are making a tangible difference in the lives of farmers across Africa
        </p>
        <div className="impact-grid">
          {impacts.map((impact, index) => (
            <div key={index} className="impact-item">
              <div className="impact-number">{impact.number}</div>
              <div className="impact-label-white">{impact.label}</div>
              <div className="impact-description">{impact.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
