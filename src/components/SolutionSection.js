import React, { useState, useEffect } from 'react';
import { FaSolarPanel, FaBox, FaMobileAlt } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';
import api from '../config/api';
import './SolutionSection.css';

const SolutionSection = () => {
  const [solutionContent, setSolutionContent] = useState(null);

  const iconMap = {
    FaSolarPanel,
    FaBox,
    FaMobileAlt
  };

  useEffect(() => {
    fetchSolutionContent();
  }, []);

  const fetchSolutionContent = async () => {
    try {
      const response = await api.get('/home-content/solution');
      if (response.ok && response.data.data) {
        setSolutionContent(response.data.data.content);
      }
    } catch (error) {
      console.error('Error fetching solution content:', error);
      // Fallback to default content
      setSolutionContent({
        title: "Our Hybrid-Powered Solutions",
        subtitle: "Innovative technology designed to reduce post-harvest losses and increase farmer income. Solutions can be customized to fit your specific needs.",
        solutions: [
          {
            icon: 'FaSolarPanel',
            title: 'Hybrid-Powered Storage Systems',
            description: 'Climate-controlled storage rooms powered by hybrid energy (Solar thermal, Solar PV, and High Energy density Briquettes), maintaining optimal temperature and humidity for extending crop shelf life.',
            features: ['Hybrid-Powered Operation', 'Climate Control', 'Real-time Monitoring']
          },
          {
            icon: 'FaBox',
            title: 'Smart Packaging',
            description: 'Innovative packaging solutions that monitor and maintain product freshness, reducing spoilage during transportation and storage.',
            features: ['Freshness Sensors', 'Reusable Design', 'GPS Tracking']
          },
          {
            icon: 'FaMobileAlt',
            title: 'Digital Monitoring',
            description: 'Real-time tracking and analytics to help farmers make informed decisions about storage conditions and market timing.',
            features: ['Mobile App', 'Data Analytics', 'Alerts & Notifications']
          }
        ]
      });
    }
  };

  if (!solutionContent) {
    return <div className="solution-loading">Loading...</div>;
  }

  return (
    <section className="solution-section">
      <div className="container">
        <h2 className="section-title">{solutionContent.title}</h2>
        <p className="section-subtitle">{solutionContent.subtitle}</p>
        <div className="solution-cards">
          {(solutionContent.solutions || []).map((solution, index) => {
            const IconComponent = iconMap[solution.icon] || FaSolarPanel;
            return (
              <div key={index} className="solution-card">
                <div className="solution-icon">
                  <IconComponent />
                </div>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
                <ul className="solution-features">
                  {(solution.features || []).map((feature, idx) => (
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
