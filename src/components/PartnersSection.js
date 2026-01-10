import React from 'react';
import { getPartnerImage } from '../utils/partnerImages';
import './PartnersSection.css';

const PartnersSection = () => {
  const partners = [
    {
      id: 1,
      name: 'PATNUC Cameroon',
      website: 'https://patnuc.cm',
      logo: 'patnuc.jpeg', // Logo filename from assets
      alt: 'PATNUC Cameroon Logo'
    },
    {
      id: 2,
      name: 'World Bank',
      website: 'https://www.worldbank.org',
      logo: 'world bank.jpeg', // Logo filename from assets (note: has space)
      alt: 'World Bank Logo'
    },
    {
      id: 3,
      name: 'MINPOSTE',
      website: 'https://www.minpostel.gov.cm',
      logo: 'minpostel.jpeg', // Logo filename from assets
      alt: 'MINPOSTE Logo'
    },
    {
      id: 4,
      name: 'MINADER',
      website: 'https://www.minader.cm',
      logo: 'minader.jpeg', // Logo filename from assets
      alt: 'MINADER Logo'
    },
    {
      id: 5,
      name: 'MINEPIA',
      website: 'https://www.minepia.cm',
      logo: 'minepia.jpeg', // Logo filename from assets
      alt: 'MINEPIA Logo'
    },
    {
      id: 6,
      name: 'MINMIDT',
      website: 'https://minmidt.com',
      logo: 'minmidt.jpeg', // Logo filename from assets
      alt: 'MINMIDT Logo'
    }
  ];

  // Helper function to handle logo loading errors
  const handleLogoError = (e, partnerName) => {
    // If logo fails to load, show partner name as fallback
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    if (parent && !parent.querySelector('.partner-name-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'partner-name-fallback';
      fallback.textContent = partnerName;
      parent.appendChild(fallback);
    }
  };

  return (
    <section className="partners-section">
      <div className="container">
        <h2 className="section-title">Our Partners</h2>
        <p className="section-subtitle">
          We are proud to collaborate with leading organizations and institutions 
          to bring innovative solutions to farmers across Africa.
        </p>
        
        <div className="partners-grid">
          {partners.map((partner) => (
            <div key={partner.id} className="partner-card">
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-link"
                aria-label={`Visit ${partner.name} website`}
              >
                <div className="partner-logo-container">
                  <img
                    src={getPartnerImage(partner.logo)}
                    alt={partner.alt}
                    className="partner-logo"
                    onError={(e) => handleLogoError(e, partner.name)}
                    loading="lazy"
                  />
                </div>
                <p className="partner-name">{partner.name}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
