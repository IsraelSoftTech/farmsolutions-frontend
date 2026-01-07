import React from 'react';
import './ProblemSection.css';

const ProblemSection = () => {
  const stats = [
    {
      number: '40%',
      label: 'Post-harvest losses in developing countries',
      icon: '📉'
    },
    {
      number: '$31B',
      label: 'Annual economic losses in Africa alone',
      icon: '💰'
    },
    {
      number: '1.3B',
      label: 'Tons of food wasted globally each year',
      icon: '🌍'
    },
    {
      number: '30%',
      label: 'Income increase potential with proper storage',
      icon: '📈'
    }
  ];

  return (
    <section className="problem-section">
      <div className="container">
        <h2 className="section-title">The Challenge We Address</h2>
        <p className="section-subtitle">
          Post-harvest losses are a critical issue affecting millions of farmers worldwide, 
          leading to food insecurity and economic hardship.
        </p>
        <div className="problem-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
