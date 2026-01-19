import React, { useState, useEffect } from 'react';
import { 
  FaBook, FaSun, FaSeedling, FaChartBar, FaTools, FaBookOpen,
  FaGraduationCap, FaFileAlt, FaVideo, FaNewspaper, FaLightbulb
} from 'react-icons/fa';
import api from '../config/api';
import './KnowledgePage.css';

const KnowledgePage = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledgeContent();
  }, []);

  const fetchKnowledgeContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/knowledge-content');
      if (response.ok && response.data.success) {
        const contentMap = {};
        Object.keys(response.data.data).forEach(section => {
          contentMap[section] = response.data.data[section].content;
        });
        setContent(contentMap);
      }
    } catch (error) {
      console.error('Error fetching knowledge content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping
  const iconMap = {
    FaBook,
    FaSun,
    FaSeedling,
    FaChartBar,
    FaTools,
    FaBookOpen,
    FaGraduationCap,
    FaFileAlt,
    FaVideo,
    FaNewspaper,
    FaLightbulb
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || FaBook;
  };

  if (loading) {
    return (
      <div className="knowledge-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const hero = content.hero || {};
  const resources = content.resources || {};
  const newsletter = content.newsletter || {};

  return (
    <div className="knowledge-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">{hero.title || 'Knowledge Hub'}</h1>
          <p className="page-subtitle">
            {hero.subtitle || 'Educational resources and farming guides to help you succeed'}
          </p>
        </div>
      </section>

      <section className="resources-section">
        <div className="container">
          <div className="resources-grid">
            {(resources.resources || []).map((resource, index) => {
              const IconComponent = getIconComponent(resource.icon);
              return (
                <div key={index} className="resource-card">
                  <div className="resource-icon">
                    <IconComponent />
                  </div>
                  <span className="resource-type">{resource.type}</span>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <button className="btn-resource">Read More</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-box">
            <h2>{newsletter.title || 'Stay Updated'}</h2>
            <p>{newsletter.subtitle || 'Subscribe to our newsletter for the latest farming tips and updates'}</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder={newsletter.placeholder || 'Your email address'} 
                required 
              />
              <button type="submit" className="btn-primary">
                {newsletter.buttonText || 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgePage;
