import React from 'react';
import { Link } from 'react-router-dom';
import { FaSolarPanel, FaBox } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';
import { solarStorageProducts, smartPackagingProducts } from '../data/products';
import { getProductImage } from '../utils/productImages';
import './ProductsPage.css';

const ProductsPage = () => {
  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="container">
          <h1 className="page-title">Our Products</h1>
          <p className="page-subtitle">
            Innovative hybrid-powered storage solutions and smart packaging designed to 
            reduce post-harvest losses and increase farmer income.
          </p>
        </div>
      </section>

      {/* Solar Storage Systems */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Hybrid-Powered Storage Systems</h2>
          <p className="section-subtitle">
            Climate-controlled storage rooms powered by hybrid energy (Solar thermal, Solar PV, and High Energy density Briquettes)
          </p>
          
          <div className="products-grid">
            {solarStorageProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image && getProductImage(product.image) ? (
                    <img src={getProductImage(product.image)} alt={product.name} />
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
          <h2 className="section-title">Smart Preservation Packaging</h2>
          <p className="section-subtitle">
            Intelligent packaging solutions that monitor and maintain product freshness
          </p>
          
          <div className="products-grid packaging-grid">
            {smartPackagingProducts.map(product => (
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
            <h2>Ready to Reduce Your Post-Harvest Losses?</h2>
            <p>
              Join thousands of farmers who have increased their income with our hybrid-powered solutions
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-primary">
                Get Quote
              </Link>
              <Link to="/how-it-works" className="btn-secondary">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
