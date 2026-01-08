import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSolarPanel, FaBox, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';
import adminService from '../services/adminService';
import EditableSection from '../components/EditableSection';
import EditableField from '../components/EditableField';
import { solarStorageProducts, smartPackagingProducts } from '../data/products';
import './Admin_Products.css';
import '../pages/ProductsPage.css';

const Admin_Products = () => {
  const [products, setProducts] = useState([...solarStorageProducts, ...smartPackagingProducts]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await adminService.getProducts();
      if (response.ok && response.data.data) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = (productId, field, value) => {
    const updated = products.map(p => 
      p.id === productId || p.product_id === productId 
        ? { ...p, [field]: value } 
        : p
    );
    setProducts(updated);
  };

  const updateProductBenefit = (productId, index, value) => {
    const updated = products.map(p => {
      if (p.id === productId || p.product_id === productId) {
        const benefits = Array.isArray(p.benefits) ? [...p.benefits] : [];
        benefits[index] = value;
        return { ...p, benefits };
      }
      return p;
    });
    setProducts(updated);
  };

  const updateProductFeature = (productId, index, value) => {
    const updated = products.map(p => {
      if (p.id === productId || p.product_id === productId) {
        const features = Array.isArray(p.features) ? [...p.features] : [];
        features[index] = value;
        return { ...p, features };
      }
      return p;
    });
    setProducts(updated);
  };

  const handleSaveProduct = async (product) => {
    try {
      const productData = {
        product_id: product.product_id || product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        capacity: product.capacity,
        dimensions: product.dimensions,
        price: product.price,
        benefits: Array.isArray(product.benefits) ? product.benefits : [],
        features: Array.isArray(product.features) ? product.features : [],
        order_index: 0
      };
      await adminService.saveProduct(productData);
      await loadProducts();
      alert('Product saved!');
    } catch (error) {
      alert('Error saving product');
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  const solarProducts = products.filter(p => p.category === 'Solar Storage System' || !p.category);
  const packagingProducts = products.filter(p => p.category === 'Smart Packaging');

  return (
    <div className="products-page">
      {/* Hero Section - EXACT COPY */}
      <section className="products-hero">
        <div className="container">
          <EditableSection sectionId="products-hero">
            <h1 className="page-title">
              <EditableField value="Our Products" tag="span" />
            </h1>
            <p className="page-subtitle">
              <EditableField 
                value="Innovative solar-powered storage solutions and smart packaging designed to reduce post-harvest losses and increase farmer income."
                multiline={true}
                tag="span"
              />
            </p>
          </EditableSection>
        </div>
      </section>

      {/* Solar Storage Systems - EXACT COPY */}
      <section className="products-section">
        <div className="container">
          <EditableSection sectionId="solar-storage">
            <h2 className="section-title">
              <EditableField value="Solar Storage Systems" tag="span" />
            </h2>
            <p className="section-subtitle">
              <EditableField 
                value="Climate-controlled storage rooms powered by renewable solar energy"
                multiline={true}
                tag="span"
              />
            </p>
            
            <div className="products-grid">
              {solarProducts.map((product) => (
                <EditableSection
                  key={product.id || product.product_id}
                  onSave={() => handleSaveProduct(product)}
                  sectionId={`product-${product.id || product.product_id}`}
                  className="product-card"
                >
                  <div className="product-image">
                    <FaSolarPanel className="product-icon" />
                    <div className="admin-image-overlay">
                      <label className="admin-upload-btn">
                        Change Image
                        <input type="file" accept="image/*" style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                  <div className="product-content">
                    <h3>
                      <EditableField
                        value={product.name}
                        onChange={(value) => updateProduct(product.id || product.product_id, 'name', value)}
                        tag="span"
                      />
                    </h3>
                    <p className="product-description">
                      <EditableField
                        value={product.description}
                        onChange={(value) => updateProduct(product.id || product.product_id, 'description', value)}
                        multiline={true}
                        tag="span"
                      />
                    </p>
                    <div className="product-capacity">
                      <strong>Capacity:</strong>{' '}
                      <EditableField
                        value={product.capacity || ''}
                        onChange={(value) => updateProduct(product.id || product.product_id, 'capacity', value)}
                        tag="span"
                      />
                    </div>
                    <h4 className="product-benefits-title">Key Benefits:</h4>
                    <ul className="product-benefits">
                      {(Array.isArray(product.benefits) ? product.benefits : []).map((benefit, index) => (
                        <li key={index}>
                          <HiCheck className="check-icon" />
                          <EditableField
                            value={benefit}
                            onChange={(value) => updateProductBenefit(product.id || product.product_id, index, value)}
                            tag="span"
                          />
                        </li>
                      ))}
                    </ul>
                    <div className="product-footer">
                      <span className="product-price">
                        <EditableField
                          value={product.price || 'Contact for pricing'}
                          onChange={(value) => updateProduct(product.id || product.product_id, 'price', value)}
                          tag="span"
                        />
                      </span>
                      <div className="product-actions">
                        <Link to={`/products/${product.id || product.product_id}`} className="btn-primary">
                          View Details
                        </Link>
                        <Link to="/contact" className="btn-secondary">
                          Request Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                </EditableSection>
              ))}
            </div>
          </EditableSection>
        </div>
      </section>

      {/* Smart Packaging - EXACT COPY */}
      <section className="products-section alt-bg">
        <div className="container">
          <EditableSection sectionId="smart-packaging">
            <h2 className="section-title">
              <EditableField value="Smart Preservation Packaging" tag="span" />
            </h2>
            <p className="section-subtitle">
              <EditableField 
                value="Intelligent packaging solutions that monitor and maintain product freshness"
                multiline={true}
                tag="span"
              />
            </p>
            
            <div className="products-grid packaging-grid">
              {packagingProducts.map((product) => (
                <EditableSection
                  key={product.id || product.product_id}
                  onSave={() => handleSaveProduct(product)}
                  sectionId={`packaging-${product.id || product.product_id}`}
                  className="packaging-card"
                >
                  <FaBox className="packaging-icon" />
                  <h3>
                    <EditableField
                      value={product.name}
                      onChange={(value) => updateProduct(product.id || product.product_id, 'name', value)}
                      tag="span"
                    />
                  </h3>
                  <p className="product-description">
                    <EditableField
                      value={product.description}
                      onChange={(value) => updateProduct(product.id || product.product_id, 'description', value)}
                      multiline={true}
                      tag="span"
                    />
                  </p>
                  
                  <div className="packaging-features">
                    <h4>Features:</h4>
                    <ul>
                      {(Array.isArray(product.features) ? product.features : []).map((feature, index) => (
                        <li key={index}>
                          •{' '}
                          <EditableField
                            value={feature}
                            onChange={(value) => updateProductFeature(product.id || product.product_id, index, value)}
                            tag="span"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="product-capacity">
                    <strong>Best for:</strong>{' '}
                    <EditableField
                      value={product.bestFor || ''}
                      onChange={(value) => updateProduct(product.id || product.product_id, 'bestFor', value)}
                      tag="span"
                    />
                  </div>
                  
                  <div className="product-footer">
                    <span className="product-price">
                      <EditableField
                        value={product.price || 'Contact for pricing'}
                        onChange={(value) => updateProduct(product.id || product.product_id, 'price', value)}
                        tag="span"
                      />
                    </span>
                    <Link to={`/products/${product.id || product.product_id}`} className="btn-primary">
                      Learn More
                    </Link>
                  </div>
                </EditableSection>
              ))}
            </div>
          </EditableSection>
        </div>
      </section>

      {/* CTA Section - EXACT COPY */}
      <section className="products-cta">
        <div className="container">
          <EditableSection sectionId="products-cta">
            <div className="cta-content">
              <h2>
                <EditableField value="Ready to Reduce Your Post-Harvest Losses?" tag="span" />
              </h2>
              <p>
                <EditableField 
                  value="Join thousands of farmers who have increased their income with our solar-powered solutions"
                  multiline={true}
                  tag="span"
                />
              </p>
              <div className="cta-buttons">
                <Link to="/contact" className="btn-primary">Get Quote</Link>
                <Link to="/how-it-works" className="btn-secondary">How It Works</Link>
              </div>
            </div>
          </EditableSection>
        </div>
      </section>
    </div>
  );
};

export default Admin_Products;
