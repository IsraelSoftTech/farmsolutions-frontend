import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiCheck } from 'react-icons/hi';
import { getImageUrl } from '../utils/imageUtils';
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
      // Fetch content
      const contentResponse = await api.get(`/products-content?t=${Date.now()}`);
      const contentMap = {};
      
      if (contentResponse.ok && contentResponse.data.success) {
        Object.keys(contentResponse.data.data).forEach(section => {
          contentMap[section] = contentResponse.data.data[section].content;
        });
      }
      
      // Fetch product images from images API
      try {
        const imagesResponse = await api.get(`/images?category=product&t=${Date.now()}`);
        if (imagesResponse.ok && imagesResponse.data.success) {
          const productImages = imagesResponse.data.data;
          
          // Update product images in solar_storage section
          if (contentMap.solar_storage && contentMap.solar_storage.products) {
            contentMap.solar_storage.products = contentMap.solar_storage.products.map((product, index) => {
              // Try to find image by matching name in description/alt_text
              let matchedImage = productImages.find(img => 
                img.alt_text && product.name && 
                img.alt_text.toLowerCase().includes(product.name.toLowerCase())
              );
              
              // If no match, try by index
              if (!matchedImage && productImages[index]) {
                matchedImage = productImages[index];
              }
              
              // Use matched image or keep existing
              return {
                ...product,
                image: matchedImage ? getImageUrl(matchedImage.url) : product.image
              };
            });
          }
          
          // Update product images in smart_packaging section
          if (contentMap.smart_packaging && contentMap.smart_packaging.products) {
            contentMap.smart_packaging.products = contentMap.smart_packaging.products.map((product, index) => {
              // Try to find image by matching name
              let matchedImage = productImages.find(img => 
                img.alt_text && product.name && 
                img.alt_text.toLowerCase().includes(product.name.toLowerCase())
              );
              
              // If no match, try by index (offset by solar_storage products count)
              const offset = contentMap.solar_storage?.products?.length || 0;
              if (!matchedImage && productImages[offset + index]) {
                matchedImage = productImages[offset + index];
              }
              
              return {
                ...product,
                image: matchedImage ? getImageUrl(matchedImage.url) : product.image
              };
            });
          }
        }
      } catch (imagesError) {
        console.error('Error fetching product images:', imagesError);
      }
      
      setContent(contentMap);
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
                  {product.image && (
                    <img 
                      src={getImageUrl(product.image)} 
                      alt={product.name} 
                    />
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
                {product.image && (
                  <div className="packaging-image">
                    <img src={getImageUrl(product.image)} alt={product.name} />
                  </div>
                )}
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
