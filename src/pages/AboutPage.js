import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';
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
      // Fetch content
      const contentResponse = await api.get(`/about-content?t=${Date.now()}`);
      let heroData = { title: '', subtitle: '' };
      let paragraphs = [];
      let teamData = { title: '', teamMembers: [] };
      
      if (contentResponse.ok && contentResponse.data.success) {
        const data = contentResponse.data.data;
        
        if (data.hero) {
          heroData = data.hero.content;
        }
        
        if (data.content) {
          paragraphs = data.content.content.paragraphs || [];
        }
        
        if (data.team) {
          teamData = data.team.content;
        }
      }
      
      // Fetch team images from images API
      try {
        const imagesResponse = await api.get(`/images?category=team&t=${Date.now()}`);
        if (imagesResponse.ok && imagesResponse.data.success) {
          const teamImages = imagesResponse.data.data;
          
          // Use team images directly - they contain name, role, qualification
          const imageBasedMembers = teamImages.map((img, index) => ({
            id: img.id || Date.now() + index,
            name: img.team_name || img.alt_text || img.description || `Team Member ${index + 1}`,
            position: img.team_role || '',
            qualification: img.team_qualification || img.description || '',
            image: getImageUrl(img.url)
          }));
          
          // Merge with content team members (for any additional metadata)
          let updatedMembers = imageBasedMembers;
          if (teamData.teamMembers && teamData.teamMembers.length > 0) {
            updatedMembers = imageBasedMembers.map(imgMember => {
              const contentMember = teamData.teamMembers.find(cm => 
                cm.name && imgMember.name && 
                cm.name.toLowerCase() === imgMember.name.toLowerCase()
              );
              
              // If found in content, merge data (prefer image data for name/role/qualification)
              if (contentMember) {
                return {
                  ...contentMember,
                  name: imgMember.name || contentMember.name,
                  position: imgMember.position || contentMember.position,
                  qualification: imgMember.qualification || contentMember.qualification,
                  image: imgMember.image
                };
              }
              
              return imgMember;
            });
            
            // Add any content members not in images
            teamData.teamMembers.forEach(contentMember => {
              const exists = updatedMembers.find(m => 
                m.name && contentMember.name && 
                m.name.toLowerCase() === contentMember.name.toLowerCase()
              );
              if (!exists) {
                updatedMembers.push(contentMember);
              }
            });
          }
          
          teamData = {
            ...teamData,
            teamMembers: updatedMembers
          };
        }
      } catch (imagesError) {
        console.error('Error fetching team images:', imagesError);
        // Continue with team data from content
      }
      
      setHeroContent(heroData);
      setContentParagraphs(paragraphs);
      setTeamContent(teamData);
    } catch (error) {
      console.error('Error fetching about content:', error);
      setHeroContent({ title: '', subtitle: '' });
      setContentParagraphs([]);
      setTeamContent({ title: '', teamMembers: [] });
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (imageFilename) => {
    if (!imageFilename) return '';
    // Only use images from database/FTP - no local fallbacks
    return getImageUrl(imageFilename);
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
              <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>
                Content will be added by admin.
              </p>
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
                    {member.image && (
                      <img 
                        src={getImageSrc(member.image)} 
                        alt={member.name} 
                      />
                    )}
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
