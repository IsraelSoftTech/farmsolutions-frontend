import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSolarPanel, FaBox } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';
import { solarStorageProducts, smartPackagingProducts } from '../data/products';
import { getProductImage } from '../utils/productImages';
import api from '../config/api';
import './ProductsPreviewSection.css';

const ProductsPreviewSection = () => {
  const [previewContent, setPreviewContent] = useState(null);
  
  // Show only first 3 products from each category for preview
  const featuredProducts = [
    ...solarStorageProducts.slice(0, 3),
    ...smartPackagingProducts.slice(0, 2)
  ];

  useEffect(() => {
    fetchPreviewContent();
  }, []);

  const fetchPreviewContent = async () => {
    try {
      const response = await api.get('/home-content/products_preview');
      if (response.ok && response.data.data) {
        setPreviewContent(response.data.data.content);
      }
    } catch (error) {
      console.error('Error fetching products preview content:', error);
      // Fallback to default content
      setPreviewContent({
        title: "Our Products",
        subtitle: "Innovative hybrid-powered storage solutions and smart packaging designed to reduce post-harvest losses and increase farmer income."
      });
    }
  };

  if (!previewContent) {
    return <div className="products-preview-loading">Loading...</div>;
  }

  return (
    <section className="products-preview-section">
      <div className="container">
        <h2 className="section-title">{previewContent.title}</h2>
        <p className="section-subtitle">{previewContent.subtitle}</p>
        
        <div className="products-preview-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-preview-card">
              <div className="product-preview-image">
                {product.image && getProductImage(product.image) ? (
                  <img src={getProductImage(product.image)} alt={product.name} />
                ) : product.category === 'Hybrid-Powered Storage System' ? (
                  <FaSolarPanel className="product-icon" />
                ) : (
                  <FaBox className="product-icon" />
                )}
              </div>
              <div className="product-preview-content">
                <h3>{product.name}</h3>
                <p className="product-preview-description">{product.description}</p>
                {product.capacity && (
                  <div className="product-preview-capacity">
                    <strong>Capacity:</strong> {product.capacity}
                  </div>
                )}
                {product.dimensions && (
                  <div className="product-preview-capacity">
                    <strong>Dimensions:</strong> {product.dimensions}
                  </div>
                )}
                {(product.benefits && product.benefits.length > 0) || (product.features && product.features.length > 0) ? (
                  <>
                    <h4 className="product-preview-benefits-title">Key {product.benefits ? 'Benefits' : 'Features'}:</h4>
                    <ul className="product-preview-benefits">
                      {(product.benefits || product.features || []).slice(0, 3).map((item, index) => (
                        <li key={index}>
                          <HiCheck className="check-icon" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <div className="product-preview-footer">
                  <Link to={`/products/${product.id}`} className="btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="products-preview-cta">
          <Link to="/products" className="btn-secondary btn-large">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsPreviewSection;
