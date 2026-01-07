import React from 'react';
import './KnowledgePage.css';

const KnowledgePage = () => {
  const resources = [
    {
      title: 'Post-Harvest Loss Prevention Guide',
      description: 'Comprehensive guide on reducing post-harvest losses in agricultural operations.',
      type: 'Guide',
      icon: '📖'
    },
    {
      title: 'Solar Storage Best Practices',
      description: 'Learn how to maximize the efficiency of your solar storage system.',
      type: 'Article',
      icon: '☀️'
    },
    {
      title: 'Crop-Specific Storage Tips',
      description: 'Tailored storage recommendations for different crop types.',
      type: 'Resource',
      icon: '🌾'
    },
    {
      title: 'Market Timing Strategies',
      description: 'When to sell your produce for maximum profit.',
      type: 'Guide',
      icon: '📊'
    },
    {
      title: 'Maintenance & Care',
      description: 'Keep your storage systems running at peak performance.',
      type: 'Article',
      icon: '🔧'
    },
    {
      title: 'Success Stories Collection',
      description: 'Real stories from farmers who have transformed their operations.',
      type: 'Case Study',
      icon: '📚'
    }
  ];

  return (
    <div className="knowledge-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Knowledge Hub</h1>
          <p className="page-subtitle">
            Educational resources and farming guides to help you succeed
          </p>
        </div>
      </section>

      <section className="resources-section">
        <div className="container">
          <div className="resources-grid">
            {resources.map((resource, index) => (
              <div key={index} className="resource-card">
                <div className="resource-icon">{resource.icon}</div>
                <span className="resource-type">{resource.type}</span>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <button className="btn-resource">Read More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-box">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest farming tips and updates</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgePage;
