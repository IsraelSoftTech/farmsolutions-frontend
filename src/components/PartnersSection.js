import React, { useState, useEffect } from 'react';
import { getPartnerImage } from '../utils/partnerImages';
import api from '../config/api';
import './PartnersSection.css';

const PartnersSection = () => {
  const [partnersContent, setPartnersContent] = useState(null);

  useEffect(() => {
    fetchPartnersContent();
  }, []);

  const fetchPartnersContent = async () => {
    try {
      const response = await api.get('/home-content/partners');
      if (response.ok && response.data.data) {
        setPartnersContent(response.data.data.content);
      }
    } catch (error) {
      console.error('Error fetching partners content:', error);
      // Fallback to default content
      setPartnersContent({
        title: "Our Partners",
        subtitle: "We are proud to collaborate with leading organizations and institutions to bring innovative solutions to farmers across Africa.",
        partners: [
          { id: 1, name: 'PATNUC Cameroon', website: 'https://patnuc.cm', logo: 'patnuc.jpeg' },
          { id: 2, name: 'World Bank', website: 'https://www.worldbank.org', logo: 'world bank.jpeg' },
          { id: 3, name: 'MINPOSTE', website: 'https://www.minpostel.gov.cm', logo: 'minpostel.jpeg' },
          { id: 4, name: 'MINADER', website: 'https://www.minader.cm', logo: 'minader.jpeg' },
          { id: 5, name: 'MINEPIA', website: 'https://www.minepia.cm', logo: 'minepia.jpeg' },
          { id: 6, name: 'MINMIDT', website: 'https://minmidt.com', logo: 'minmidt.jpeg' }
        ]
      });
    }
  };

  const getImageSrc = (logo) => {
    if (!logo) return null;
    if (logo.startsWith('http')) return logo;
    // Check if it's a local asset first
    try {
      return getPartnerImage(logo);
    } catch {
      // If not found locally, try FTP
      return `https://st69310.ispot.cc/farmsolutionss/uploads/${logo}`;
    }
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
