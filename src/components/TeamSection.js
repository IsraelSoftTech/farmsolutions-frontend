import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';
import api from '../config/api';
import './TeamSection.css';

const TeamSection = () => {
  const [teamContent, setTeamContent] = useState(null);

  useEffect(() => {
    fetchTeamContent();
  }, []);

  const fetchTeamContent = async () => {
    try {
      // Fetch content
      const contentResponse = await api.get(`/home-content/team?t=${Date.now()}`);
      let teamData = {
        title: "",
        aboutContent: [],
        teamMembers: []
      };
      
      if (contentResponse.ok && contentResponse.data.data) {
        teamData = contentResponse.data.data.content;
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
          // If content has team members, merge by name matching
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
          
          setTeamContent({
            ...teamData,
            teamMembers: updatedMembers
          });
        } else {
          setTeamContent(teamData);
        }
      } catch (imagesError) {
        console.error('Error fetching team images:', imagesError);
        setTeamContent(teamData);
      }
    } catch (error) {
      console.error('Error fetching team content:', error);
      setTeamContent({
        title: "",
        aboutContent: [],
        teamMembers: []
      });
    }
  };

  const getImageSrc = (image) => {
    if (!image) return null;
    // Only use images from database/FTP - no local fallbacks
    return getImageUrl(image);
  };

  if (!teamContent) {
    return <div className="team-loading" aria-hidden="true"></div>;
  }

  return (
    <section className="team-section-home">
      <div className="container">
        <h2 className="section-title">{teamContent.title}</h2>
        
        {/* About Content */}
        <div className="about-content">
          <div className="about-writeup">
            {(teamContent.aboutContent || []).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="team-grid">
          {(teamContent.teamMembers || []).map((member) => {
            const imageSrc = getImageSrc(member.image);
            return (
              <div key={member.id} className="team-card">
                <div className="team-card-image">
                  {imageSrc && <img src={imageSrc} alt={member.name} />}
                </div>
                <div className="team-card-content">
                  <h3 className="team-member-name">{member.name}</h3>
                  <p className="team-member-position">{member.position}</p>
                  <p className="team-member-qualification">{member.qualification}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
