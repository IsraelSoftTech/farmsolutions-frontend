import React from 'react';
import './SolutionSection.css';

const SolutionSection = () => {
  const solutions = [
    {
      icon: '☀️',
      title: 'Solar Storage Systems',
      description: 'Climate-controlled storage rooms powered by solar energy, maintaining optimal temperature and humidity for extending crop shelf life.',
      features: ['100% Solar Powered', 'Climate Control', 'Real-time Monitoring']
    },
    {
      icon: '📦',
      title: 'Smart Packaging',
      description: 'Innovative packaging solutions that monitor and maintain product freshness, reducing spoilage during transportation and storage.',
      features: ['Freshness Sensors', 'Reusable Design', 'GPS Tracking']
    },
    {
      icon: '📱',
      title: 'Digital Monitoring',
      description: 'Real-time tracking and analytics to help farmers make informed decisions about storage conditions and market timing.',
      features: ['Mobile App', 'Data Analytics', 'Alerts & Notifications']
    }
  ];

  return (
    <section className="solution-section">
      <div className="container">
        <h2 className="section-title">Our Solar-Powered Solutions</h2>
        <p className="section-subtitle">
          Innovative technology designed to reduce post-harvest losses and increase farmer income
        </p>
        <div className="solution-cards">
          {solutions.map((solution, index) => (
            <div key={index} className="solution-card">
              <div className="solution-icon">{solution.icon}</div>
              <h3>{solution.title}</h3>
              <p>{solution.description}</p>
              <ul className="solution-features">
                {solution.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
