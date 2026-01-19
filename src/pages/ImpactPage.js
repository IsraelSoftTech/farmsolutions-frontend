import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserTie, FaUsers, FaUserCircle } from 'react-icons/fa';
import api from '../config/api';
import './ImpactPage.css';

const ImpactPage = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpactContent();
  }, []);

  const fetchImpactContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/impact-content');
      if (response.ok && response.data.success) {
        const contentMap = {};
        Object.keys(response.data.data).forEach(section => {
          contentMap[section] = response.data.data[section].content;
        });
        setContent(contentMap);
      }
    } catch (error) {
      console.error('Error fetching impact content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping
  const iconMap = {
    FaUser,
    FaUserTie,
    FaUsers,
    FaUserCircle
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || FaUser;
  };

  if (loading) {
    return (
      <div className="impact-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const hero = content.hero || {};
  const stats = content.stats || {};
  const testimonials = content.testimonials || {};
  const cta = content.cta || {};

  return (
    <div className="impact-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">{hero.title || 'Our Impact'}</h1>
          <p className="page-subtitle">
            {hero.subtitle || 'Real stories from farmers whose lives have been transformed by our solutions'}
          </p>
        </div>
      </section>

      <section className="impact-stats-section">
        <div className="container">
          <div className="impact-stats-grid">
            {(stats.stats || []).map((stat, index) => (
              <div key={index} className="impact-stat-card">
                <div className="impact-stat-number">{stat.number}</div>
                <div className="impact-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">{testimonials.title || 'Success Stories'}</h2>
          <div className="testimonials-grid">
            {(testimonials.testimonials || []).map((testimonial, index) => {
              const IconComponent = getIconComponent(testimonial.icon);
              return (
                <div key={index} className="testimonial-card-large">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <IconComponent />
                    </div>
                    <div className="testimonial-info">
                      <h4>{testimonial.name}</h4>
                      <p className="testimonial-role">{testimonial.role}</p>
                      <p className="testimonial-location">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <span key={i} className="star">★</span>
                    ))}
                  </div>
                  <p className="testimonial-text-large">"{testimonial.text}"</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{cta.title || 'Join Our Success Stories'}</h2>
            <p>{cta.subtitle || 'Start your journey to reduced losses and increased income today'}</p>
            <Link to={cta.button?.link || '/contact'} className="btn-primary">
              {cta.button?.text || 'Get Started'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImpactPage;
