import React, { useState, useEffect } from 'react';
import { getTeamImage } from '../utils/teamImages';
import api from '../config/api';
import './AboutPage.css';

const AboutPage = () => {
  const [loading, setLoading] = useState(true);
  const [heroContent, setHeroContent] = useState({ title: 'About Us', subtitle: 'Empowering farmers with innovative preservation solutions' });
  const [contentParagraphs, setContentParagraphs] = useState([]);
  const [teamContent, setTeamContent] = useState({ title: 'Our Team', teamMembers: [] });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/about-content');
      if (response.ok && response.data.success) {
        const data = response.data.data;
        
        if (data.hero) {
          setHeroContent(data.hero.content);
        }
        
        if (data.content) {
          setContentParagraphs(data.content.content.paragraphs || []);
        }
        
        if (data.team) {
          setTeamContent(data.team.content);
        }
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
      // Fallback to default content if API fails
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageFilename) => {
    if (!imageFilename) return '';
    // If it's already a full URL, return it
    if (imageFilename.startsWith('http')) {
      return imageFilename;
    }
    // If it's an old format filename (like T1.jpg), use getTeamImage
    if (imageFilename.match(/^T\d+\.(jpg|jpeg|png)$/i)) {
      return getTeamImage(imageFilename);
    }
    // Otherwise, assume it's a new uploaded file
    return `https://st69310.ispot.cc/farmsolutionss/uploads/${imageFilename}`;
  };

  if (loading) {
    return (
      <div className="about-page">
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">{heroContent.title || 'About Us'}</h1>
          <p className="page-subtitle">
            {heroContent.subtitle || 'Empowering farmers with innovative preservation solutions'}
          </p>
        </div>
      </section>

      <section className="about-content-section">
        <div className="container">
          <div className="about-writeup">
            {contentParagraphs.length > 0 ? (
              contentParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <>
                <p>
                  Farmers Solution is an agri-tech company created to tackle one of Africa's most persistent challenges: post-harvest losses and limited access to modern preservation infrastructure.
                </p>
                <p>
                  We design and deploy smart, IoT-enabled, renewable-powered cold and dry storage and preservation systems, known as SPETHACS ROOMS. These systems help farmers preserve product quality, extend shelf life, and sell at better prices.
                </p>
                <p>
                  Beyond technology, we work closely with smallholder farmers, cooperatives, aggregators, and agribusinesses, offering installation, training, maintenance, and after-sales support to ensure long-term impact and usability.
                </p>
                <p>
                  At Farmers Solution, we believe that preserving food is preserving income, dignity, and opportunity. By reducing losses, improving quality, and strengthening food systems, we help farmers move from survival to sustainability.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2 className="section-title">{teamContent.title || 'Our Team'}</h2>
          <div className="team-grid">
            {teamContent.teamMembers && teamContent.teamMembers.length > 0 ? (
              teamContent.teamMembers.map((member) => (
                <div key={member.id || member.name} className="team-card">
                  <div className="team-card-image">
                    <img 
                      src={getImageUrl(member.image)} 
                      alt={member.name} 
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="team-card-content">
                    <h3 className="team-member-name">{member.name}</h3>
                    <p className="team-member-position">{member.position}</p>
                    <p className="team-member-qualification">{member.qualification}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-light)' }}>
                No team members available.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
