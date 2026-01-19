import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSolarPanel, FaBox } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';
import api from '../config/api';
import './ProductsPage.css';

const ProductsPage = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsContent();
  }, []);

  const fetchProductsContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products-content');
      if (response.ok && response.data.success) {
        const contentMap = {};
        Object.keys(response.data.data).forEach(section => {
          contentMap[section] = response.data.data[section].content;
        });
        setContent(contentMap);
      }
    } catch (error) {
      console.error('Error fetching products content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  const hero = content.hero || {};
  const solarStorage = content.solar_storage || {};
  const smartPackaging = content.smart_packaging || {};
  const cta = content.cta || {};

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="container">
          <h1 className="page-title">{hero.title || 'Our Products'}</h1>
          <p className="page-subtitle">
            {hero.subtitle || 'Innovative hybrid-powered storage solutions and smart packaging designed to reduce post-harvest losses and increase farmer income.'}
          </p>
        </div>
      </section>

      {/* Solar Storage Systems */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">{solarStorage.title || 'Hybrid-Powered Storage Systems'}</h2>
          <p className="section-subtitle">
            {solarStorage.subtitle || 'Climate-controlled storage rooms powered by hybrid energy (Solar thermal, Solar PV, and High Energy density Briquettes)'}
          </p>
          
          <div className="products-grid">
            {(solarStorage.products || []).map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img 
                      src={product.image.startsWith('http') 
                        ? product.image 
                        : `https://st69310.ispot.cc/farmsolutionss/uploads/${product.image}`} 
                      alt={product.name} 
                    />
                  ) : (
                    <FaSolarPanel className="product-icon" />
                  )}
                </div>
                <div className="product-content">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-capacity">
                    <strong>Capacity:</strong> {product.capacity}
                  </div>
                  <h4 className="product-benefits-title">Key Benefits:</h4>
                  <ul className="product-benefits">
                    {product.benefits.map((benefit, index) => (
                      <li key={index}>
                        <HiCheck className="check-icon" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="product-footer">
                    <span className="product-price">{product.price}</span>
                    <div className="product-actions">
                      <Link to={`/products/${product.id}`} className="btn-primary">
                        View Details
                      </Link>
                      <Link to="/contact" className="btn-secondary">
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Packaging */}
      <section className="products-section alt-bg">
        <div className="container">
          <h2 className="section-title">{smartPackaging.title || 'Smart Preservation Packaging'}</h2>
          <p className="section-subtitle">
            {smartPackaging.subtitle || 'Intelligent packaging solutions that monitor and maintain product freshness'}
          </p>
          
          <div className="products-grid packaging-grid">
            {(smartPackaging.products || []).map(product => (
              <div key={product.id} className="packaging-card">
                <FaBox className="packaging-icon" />
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="packaging-features">
                  <h4>Features:</h4>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="product-capacity">
                  <strong>Best for:</strong> {product.bestFor}
                </div>
                
                <div className="product-footer">
                  <span className="product-price">{product.price}</span>
                  <Link to={`/products/${product.id}`} className="btn-primary">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="products-cta">
        <div className="container">
          <div className="cta-content">
            <h2>{cta.title || 'Ready to Reduce Your Post-Harvest Losses?'}</h2>
            <p>
              {cta.subtitle || 'Join thousands of farmers who have increased their income with our hybrid-powered solutions'}
            </p>
            <div className="cta-buttons">
              <Link to={cta.primaryButton?.link || '/contact'} className="btn-primary">
                {cta.primaryButton?.text || 'Get Quote'}
              </Link>
              <Link to={cta.secondaryButton?.link || '/how-it-works'} className="btn-secondary">
                {cta.secondaryButton?.text || 'How It Works'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
