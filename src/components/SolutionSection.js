import React from 'react';
import { FaSolarPanel, FaBox, FaMobileAlt } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';
import './SolutionSection.css';

const SolutionSection = () => {
  const solutions = [
    {
      icon: FaSolarPanel,
      title: 'Hybrid-Powered Storage Systems',
      description: 'Climate-controlled storage rooms powered by hybrid energy (Solar thermal, Solar PV, and High Energy density Briquettes), maintaining optimal temperature and humidity for extending crop shelf life.',
      features: ['Hybrid-Powered Operation', 'Climate Control', 'Real-time Monitoring']
    },
    {
      icon: FaBox,
      title: 'Smart Packaging',
      description: 'Innovative packaging solutions that monitor and maintain product freshness, reducing spoilage during transportation and storage.',
      features: ['Freshness Sensors', 'Reusable Design', 'GPS Tracking']
    },
    {
      icon: FaMobileAlt,
      title: 'Digital Monitoring',
      description: 'Real-time tracking and analytics to help farmers make informed decisions about storage conditions and market timing.',
      features: ['Mobile App', 'Data Analytics', 'Alerts & Notifications']
    }
  ];

  return (
    <section className="solution-section">
      <div className="container">
        <h2 className="section-title">Our Hybrid-Powered Solutions</h2>
        <p className="section-subtitle">
          Innovative technology designed to reduce post-harvest losses and increase farmer income. 
          Solutions can be customized to fit your specific needs.
        </p>
        <div className="solution-cards">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            return (
              <div key={index} className="solution-card">
                <div className="solution-icon">
                  <IconComponent />
                </div>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
                <ul className="solution-features">
                  {solution.features.map((feature, idx) => (
                    <li key={idx}>
                      <HiCheck className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
