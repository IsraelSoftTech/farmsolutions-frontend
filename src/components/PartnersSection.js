import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';
import api from '../config/api';
import './PartnersSection.css';

const PartnersSection = () => {
  const [partnersContent, setPartnersContent] = useState(null);

  useEffect(() => {
    fetchPartnersContent();
  }, []);

  const fetchPartnersContent = async () => {
    try {
      // Fetch content
      const contentResponse = await api.get(`/home-content/partners?t=${Date.now()}`);
      let partnersData = {
        title: "",
        subtitle: "",
        partners: []
      };
      
      if (contentResponse.ok && contentResponse.data.data) {
        partnersData = contentResponse.data.data.content;
      }
      
      // Fetch partner images from images API
      try {
        const imagesResponse = await api.get(`/images?category=partner&t=${Date.now()}`);
        if (imagesResponse.ok && imagesResponse.data.success) {
          const partnerImages = imagesResponse.data.data;
          
          // Merge images with partners
          const updatedPartners = partnersData.partners.map((partner, index) => {
            // Try to find image by matching name in description/alt_text
            let matchedImage = partnerImages.find(img => 
              img.alt_text && partner.name && 
              img.alt_text.toLowerCase().includes(partner.name.toLowerCase())
            );
            
            // If no match, try by index
            if (!matchedImage && partnerImages[index]) {
              matchedImage = partnerImages[index];
            }
            
            // If still no match but partner has logo URL, keep it
            if (!matchedImage && partner.logo) {
              return partner;
            }
            
            // Use matched image or keep existing
            return {
              ...partner,
              logo: matchedImage ? getImageUrl(matchedImage.url) : partner.logo
            };
          });
          
          // If we have more images than partners, add them
          if (partnerImages.length > partnersData.partners.length) {
            partnerImages.slice(partnersData.partners.length).forEach((img, idx) => {
              updatedPartners.push({
                id: Date.now() + idx,
                name: img.alt_text || img.description || `Partner ${updatedPartners.length + 1}`,
                website: '',
                logo: getImageUrl(img.url)
              });
            });
          }
          
          setPartnersContent({
            ...partnersData,
            partners: updatedPartners
          });
        } else {
          setPartnersContent(partnersData);
        }
      } catch (imagesError) {
        console.error('Error fetching partner images:', imagesError);
        setPartnersContent(partnersData);
      }
    } catch (error) {
      console.error('Error fetching partners content:', error);
      setPartnersContent({
        title: "",
        subtitle: "",
        partners: []
      });
    }
  };

  const getImageSrc = (logo) => {
    if (!logo) return null;
    // Only use images from database/FTP - no local fallbacks
    return getImageUrl(logo);
  };

  // Helper function to handle logo loading errors
  const handleLogoError = (e, partnerName) => {
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    if (parent && !parent.querySelector('.partner-name-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'partner-name-fallback';
      fallback.textContent = partnerName;
      parent.appendChild(fallback);
    }
  };

  if (!partnersContent) {
    return <div className="partners-loading">Loading...</div>;
  }

  return (
    <section className="partners-section">
      <div className="container">
        <h2 className="section-title">{partnersContent.title}</h2>
        <p className="section-subtitle">{partnersContent.subtitle}</p>
        
        <div className="partners-grid">
          {(partnersContent.partners || []).map((partner) => {
            const logoSrc = getImageSrc(partner.logo);
            return (
              <div key={partner.id} className="partner-card">
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-link"
                  aria-label={`Visit ${partner.name} website`}
                >
                  <div className="partner-logo-container">
                    {logoSrc && (
                      <img
                        src={logoSrc}
                        alt={`${partner.name} Logo`}
                        className="partner-logo"
                        onError={(e) => handleLogoError(e, partner.name)}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <p className="partner-name">{partner.name}</p>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
