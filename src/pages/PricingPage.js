import React from 'react';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaWrench, FaPhone } from 'react-icons/fa';
import { solarStorageProducts } from '../data/products';
import { getProductImage } from '../utils/productImages';
import './PricingPage.css';

const PricingPage = () => {
  return (
    <div className="pricing-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Pricing & Packages</h1>
          <p className="page-subtitle">
            Flexible pricing options to suit farms of all sizes
          </p>
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
            <div className="info-card">
              <div className="info-icon">
                <FaCreditCard />
              </div>
              <h3>Flexible Payment</h3>
              <p>Payment plans available for qualified farmers and cooperatives</p>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <FaWrench />
              </div>
              <h3>Installation Included</h3>
              <p>Professional installation and setup included in all packages</p>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <FaPhone />
              </div>
              <h3>Ongoing Support</h3>
              <p>24/7 technical support and maintenance services available</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need a Custom Solution?</h2>
            <p>Contact us for a personalized quote tailored to your specific needs</p>
            <Link to="/contact" className="btn-primary">
              Get Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
