import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaClipboardList, FaPalette, FaTools, FaBook, FaMobileAlt, FaTrophy,
  FaCheckCircle, FaUsers, FaChartLine, FaCog, FaLightbulb, FaHandshake
} from 'react-icons/fa';
import api from '../config/api';
import './HowItWorksPage.css';

const HowItWorksPage = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHowItWorksContent();
  }, []);

  const fetchHowItWorksContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/how-it-works-content');
      if (response.ok && response.data.success) {
        const contentMap = {};
        Object.keys(response.data.data).forEach(section => {
          contentMap[section] = response.data.data[section].content;
        });
        setContent(contentMap);
      }
    } catch (error) {
      console.error('Error fetching how it works content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping
  const iconMap = {
    FaClipboardList,
    FaPalette,
    FaTools,
    FaBook,
    FaMobileAlt,
    FaTrophy,
    FaCheckCircle,
    FaUsers,
    FaChartLine,
    FaCog,
    FaLightbulb,
    FaHandshake
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || FaCheckCircle;
  };

  if (loading) {
    return (
      <div className="how-it-works-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const hero = content.hero || {};
  const steps = content.steps || {};
  const cta = content.cta || {};

  return (
    <div className="how-it-works-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">{hero.title || 'How It Works'}</h1>
          <p className="page-subtitle">
            {hero.subtitle || 'A simple, step-by-step process to transform your post-harvest operations'}
          </p>
        </div>
      </section>

      <section className="steps-section">
        <div className="container">
          <div className="steps-grid">
            {(steps.steps || []).map((step, index) => {
              const IconComponent = getIconComponent(step.icon);
              return (
                <div key={index} className="step-card">
                  <div className="step-number">{step.number || index + 1}</div>
                  <div className="step-icon">
                    <IconComponent />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{cta.title || 'Ready to Get Started?'}</h2>
            <p>{cta.subtitle || 'Contact us today for a free consultation and assessment'}</p>
            <Link to={cta.button?.link || '/contact'} className="btn-primary">
              {cta.button?.text || 'Schedule Consultation'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
