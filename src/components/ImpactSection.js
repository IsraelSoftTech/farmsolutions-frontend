import React, { useState, useEffect } from 'react';
import api from '../config/api';
import './ImpactSection.css';

const ImpactSection = () => {
  const [impactContent, setImpactContent] = useState(null);

  useEffect(() => {
    fetchImpactContent();
  }, []);

  const fetchImpactContent = async () => {
    try {
      const response = await api.get('/home-content/impact');
      if (response.ok && response.data.data) {
        setImpactContent(response.data.data.content);
      }
    } catch (error) {
      console.error('Error fetching impact content:', error);
      // Fallback to default content
      setImpactContent({
        title: "Real Impact, Real Results",
        subtitle: "Our solutions are making a tangible difference in the lives of farmers across Africa",
        impacts: [
          { number: '85%', label: 'Loss Reduction', description: 'Average reduction in post-harvest losses' },
          { number: '2.5x', label: 'Income Growth', description: 'Increase in farmer income' },
          { number: '10,000+', label: 'Farmers Helped', description: 'Farmers using our solutions' },
          { number: '50%', label: 'Quality Improvement', description: 'Better product quality maintained' },
          { number: '30%', label: 'Global GHG Emission Reduction', description: 'Reduction in greenhouse gas emissions' }
        ]
      });
    }
  };

  if (!impactContent) {
    return <div className="impact-loading">Loading...</div>;
  }

  return (
    <section className="impact-section">
      <div className="container">
        <h2 className="section-title">{impactContent.title}</h2>
        <p className="section-subtitle">{impactContent.subtitle}</p>
        <div className="impact-grid">
          {(impactContent.impacts || []).map((impact, index) => (
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
