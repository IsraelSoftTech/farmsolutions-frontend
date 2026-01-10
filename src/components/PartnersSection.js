import React from 'react';
import './PartnersSection.css';

const PartnersSection = () => {
  const partners = [
    {
      id: 1,
      name: 'PATNUC Cameroon',
      website: 'https://patnuc.cm',
      logo: '/logos/patnuc-cameroon.svg', // SVG placeholder - replace with actual logo
      logoPng: '/logos/patnuc-cameroon.png', // Fallback PNG
      alt: 'PATNUC Cameroon Logo'
    },
    {
      id: 2,
      name: 'World Bank',
      website: 'https://www.worldbank.org',
      logo: '/logos/world-bank.svg', // SVG placeholder - replace with actual logo (requires permission)
      logoPng: '/logos/world-bank.png', // Fallback PNG
      alt: 'World Bank Logo'
    },
    {
      id: 3,
      name: 'MINPOSTE',
      website: 'https://www.minpostel.gov.cm',
      logo: '/logos/minposte.svg', // SVG placeholder - replace with actual logo
      logoPng: '/logos/minposte.png', // Fallback PNG
      alt: 'MINPOSTE Logo'
    },
    {
      id: 4,
      name: 'MINADER',
      website: 'https://www.minader.cm',
      logo: '/logos/minader.svg', // SVG placeholder - replace with actual logo
      logoPng: '/logos/minader.png', // Fallback PNG
      alt: 'MINADER Logo'
    },
    {
      id: 5,
      name: 'MINEPIA',
      website: 'https://www.minepia.cm',
      logo: '/logos/minepia.svg', // SVG placeholder - replace with actual logo
      logoPng: '/logos/minepia.png', // Fallback PNG
      alt: 'MINEPIA Logo'
    },
    {
      id: 6,
      name: 'MINMIDT',
      website: 'https://minmidt.com',
      logo: '/logos/minmidt.svg', // SVG placeholder - replace with actual logo
      logoPng: '/logos/minmidt.png', // Fallback PNG
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
                    src={partner.logo}
                    alt={partner.alt}
                    className="partner-logo"
                    onError={(e) => {
                      // Try PNG fallback if SVG fails
                      if (e.target.src.includes('.svg') && partner.logoPng) {
                        e.target.src = partner.logoPng;
                        return;
                      }
                      handleLogoError(e, partner.name);
                    }}
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
