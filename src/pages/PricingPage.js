import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/fa';
import { solarStorageProducts } from '../data/products';
import { getProductImage } from '../utils/productImages';
import api from '../config/api';
import './PricingPage.css';

const PricingPage = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricingContent();
  }, []);

  const fetchPricingContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pricing-content');
      if (response.ok && response.data.success) {
        const contentMap = {};
        Object.keys(response.data.data).forEach(section => {
          contentMap[section] = response.data.data[section].content;
        });
        setContent(contentMap);
      }
    } catch (error) {
      console.error('Error fetching pricing content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pricing-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading pricing...</p>
        </div>
      </div>
    );
  }

  const hero = content.hero || { title: 'Pricing & Packages', subtitle: 'Flexible pricing options to suit farms of all sizes' };
  const info = content.info || { infoCards: [] };
  const cta = content.cta || { title: 'Need a Custom Solution?', subtitle: 'Contact us for a personalized quote tailored to your specific needs', button: { text: 'Get Custom Quote', link: '/contact' } };

  // Helper function to get icon component
  const getIconComponent = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <div className="pricing-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">{hero.title}</h1>
          <p className="page-subtitle">{hero.subtitle}</p>
        </div>
      </section>

      <section className="pricing-section">
        <div className="container">
          <div className="pricing-grid">
            {solarStorageProducts.map((product, index) => (
              <div key={product.id} className="pricing-card">
                <div className="pricing-image">
                  {product.image && getProductImage(product.image) ? (
                    <img src={getProductImage(product.image)} alt={product.name} />
                  ) : (
                    <div className="pricing-image-placeholder"></div>
                  )}
                </div>
                <div className="pricing-header">
                  <h3>{product.name}</h3>
                  <div className="pricing-capacity">{product.capacity}</div>
                </div>
                <div className="pricing-features">
                  <ul>
                    {product.benefits.slice(0, 4).map((benefit, idx) => (
                      <li key={idx}>✓ {benefit}</li>
                    ))}
                  </ul>
                </div>
                <div className="pricing-footer">
                  <div className="pricing-note">Contact for pricing</div>
                  <Link to={`/products/${product.id}`} className="btn-primary">
                    View Details
                  </Link>
                  <Link to="/contact" className="btn-secondary">
                    Request Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-info-section">
        <div className="container">
          <div className="info-grid">
            {info.infoCards.map((card, index) => (
              <div key={index} className="info-card">
                <div className="info-icon">
                  {getIconComponent(card.icon)}
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{cta.title}</h2>
            <p>{cta.subtitle}</p>
            <Link to={cta.button?.link || '/contact'} className="btn-primary">
              {cta.button?.text || 'Get Custom Quote'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
