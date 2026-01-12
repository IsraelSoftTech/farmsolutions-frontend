import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSolarPanel, FaBox } from 'react-icons/fa';
import { HiCheck, HiStar } from 'react-icons/hi';
import { getProductById } from '../data/products';
import { getProductImage } from '../utils/productImages';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const product = getProductById(productId);

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Header */}
      <section className="product-header-section">
        <div className="container">
          <div className="product-header">
            <div className="product-image-large">
              {product.image && getProductImage(product.image) ? (
                <img src={getProductImage(product.image)} alt={product.name} />
              ) : product.category === 'Hybrid-Powered Storage System' ? (
                <FaSolarPanel className="product-icon-large" />
              ) : (
                <FaBox className="product-icon-large" />
              )}
            </div>

            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h1>{product.name}</h1>
              <p className="product-description-large">{product.description}</p>
              
              <div className="product-highlight">
                <div className="product-price-large">{product.price}</div>
                <div className="product-specs-summary">
                  <strong>Capacity:</strong> {product.capacity || product.dimensions} | 
                  <strong> Best for:</strong> {product.bestFor}
                </div>
              </div>

              <div className="product-actions-header">
                <Link to="/contact" className="btn-primary">
                  Request Quote
                </Link>
                <Link to="/how-it-works" className="btn-secondary">
                  How It Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="specs-section">
        <div className="container">
          <h2 className="section-title">Technical Specifications</h2>
          <div className="specs-grid">
            <div className="spec-card">
              <h4>Basic Info</h4>
              <ul>
                <li><strong>Capacity:</strong> {product.capacity || 'N/A'}</li>
                <li><strong>Dimensions:</strong> {product.dimensions}</li>
                <li><strong>Best for:</strong> {product.bestFor}</li>
                {product.warranty && <li><strong>Warranty:</strong> {product.warranty}</li>}
              </ul>
            </div>
            
            {product.powerRequirement && (
              <div className="spec-card">
                <h4>Power & Climate</h4>
                <ul>
                  <li><strong>Power:</strong> {product.powerRequirement}</li>
                  <li><strong>Temperature:</strong> {product.temperatureRange}</li>
                  <li><strong>Humidity:</strong> {product.humidityControl}</li>
                  <li><strong>Installation:</strong> {product.installationTime}</li>
                </ul>
              </div>
            )}

            {product.material && (
              <div className="spec-card">
                <h4>Material & Lifespan</h4>
                <ul>
                  <li><strong>Material:</strong> {product.material}</li>
                  <li><strong>Lifespan:</strong> {product.lifespan}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="features-benefits-section">
        <div className="container">
          <div className="features-benefits-grid">
            <div className="features-box">
              <h3>Key Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <HiCheck className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="benefits-box">
              <h3>Benefits</h3>
              <ul>
                {product.impact.map((benefit, index) => (
                  <li key={index}>
                    <HiStar className="star-icon" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {product.testimonials && product.testimonials.length > 0 && (
        <section className="testimonials-section">
          <div className="container">
            <h2 className="section-title">What Farmers Say</h2>
            <div className="testimonials-grid">
              {product.testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <HiStar key={i} className="star" />
                  ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.farmer}</strong>
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="product-cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Transform Your Farm?</h2>
            <p>Get personalized advice and pricing for your specific needs</p>
            <Link to="/contact" className="btn-primary">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
