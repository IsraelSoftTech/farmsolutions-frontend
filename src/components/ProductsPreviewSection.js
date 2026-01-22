import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSolarPanel, FaBox } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';
import { getImageUrl } from '../utils/imageUtils';
import api from '../config/api';
import './ProductsPreviewSection.css';

const ProductsPreviewSection = () => {
  const [previewContent, setPreviewContent] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreviewContent();
  }, []);

  const fetchPreviewContent = async () => {
    try {
      setLoading(true);
      
      // Fetch preview content
      const contentResponse = await api.get(`/home-content/products_preview?t=${Date.now()}`);
      let contentData = {
        title: "Our Products",
        subtitle: "Innovative hybrid-powered storage solutions and smart packaging designed to reduce post-harvest losses and increase farmer income."
      };
      
      if (contentResponse.ok && contentResponse.data.data) {
        contentData = contentResponse.data.data.content;
      }
      
      // Fetch products content
      const productsResponse = await api.get(`/products-content?t=${Date.now()}`);
      let productsData = { solar_storage: {}, smart_packaging: {} };
      
      if (productsResponse.ok && productsResponse.data.success) {
        const contentMap = {};
        Object.keys(productsResponse.data.data).forEach(section => {
          contentMap[section] = productsResponse.data.data[section].content;
        });
        productsData = contentMap;
      }
      
      // Fetch product images from images API
      try {
        const imagesResponse = await api.get(`/images?category=product&t=${Date.now()}`);
        if (imagesResponse.ok && imagesResponse.data.success) {
          const productImages = imagesResponse.data.data;
          
          // Get products from both categories
          const solarProducts = (productsData.solar_storage?.products || []).slice(0, 3);
          const packagingProducts = (productsData.smart_packaging?.products || []).slice(0, 2);
          
          // Match images to products
          const productsWithImages = [
            ...solarProducts.map((product, index) => {
              // Try to find image by matching name
              let matchedImage = productImages.find(img => 
                img.alt_text && product.name && 
                img.alt_text.toLowerCase().includes(product.name.toLowerCase())
              );
              
              // If no match, try by index
              if (!matchedImage && productImages[index]) {
                matchedImage = productImages[index];
              }
              
              return {
                ...product,
                image: matchedImage ? getImageUrl(matchedImage.url) : product.image,
                category: 'Hybrid-Powered Storage System'
              };
            }),
            ...packagingProducts.map((product, index) => {
              // Try to find image by matching name
              const offset = solarProducts.length;
              let matchedImage = productImages.find(img => 
                img.alt_text && product.name && 
                img.alt_text.toLowerCase().includes(product.name.toLowerCase())
              );
              
              // If no match, try by index (offset by solar products count)
              if (!matchedImage && productImages[offset + index]) {
                matchedImage = productImages[offset + index];
              }
              
              return {
                ...product,
                image: matchedImage ? getImageUrl(matchedImage.url) : product.image,
                category: 'Smart Packaging'
              };
            })
          ];
          
          setFeaturedProducts(productsWithImages);
        } else {
          // Fallback: use products without images
          const solarProducts = (productsData.solar_storage?.products || []).slice(0, 3);
          const packagingProducts = (productsData.smart_packaging?.products || []).slice(0, 2);
          setFeaturedProducts([
            ...solarProducts.map(p => ({ ...p, category: 'Hybrid-Powered Storage System' })),
            ...packagingProducts.map(p => ({ ...p, category: 'Smart Packaging' }))
          ]);
        }
      } catch (imagesError) {
        console.error('Error fetching product images:', imagesError);
        // Fallback: use products without images
        const solarProducts = (productsData.solar_storage?.products || []).slice(0, 3);
        const packagingProducts = (productsData.smart_packaging?.products || []).slice(0, 2);
        setFeaturedProducts([
          ...solarProducts.map(p => ({ ...p, category: 'Hybrid-Powered Storage System' })),
          ...packagingProducts.map(p => ({ ...p, category: 'Smart Packaging' }))
        ]);
      }
      
      setPreviewContent(contentData);
    } catch (error) {
      console.error('Error fetching products preview content:', error);
      setPreviewContent({
        title: "Our Products",
        subtitle: "Innovative hybrid-powered storage solutions and smart packaging designed to reduce post-harvest losses and increase farmer income."
      });
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !previewContent) {
    return <div className="products-preview-loading">Loading...</div>;
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="products-preview-section">
        <div className="container">
          <h2 className="section-title">{previewContent.title}</h2>
          <p className="section-subtitle">{previewContent.subtitle}</p>
          <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>
            No products available. Add products in the admin panel.
          </p>
        </div>
      </section>
    );
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
                {product.image && getImageUrl(product.image) ? (
                  <img src={getImageUrl(product.image)} alt={product.name} />
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
