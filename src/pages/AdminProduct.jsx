import React, { useState, useEffect } from 'react';
import { FaSave, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import api, { API_BASE_URL } from '../config/api';
import useNotification from '../hooks/useNotification';
import NotificationContainer from '../components/NotificationContainer';
import './AdminProduct.css';

const AdminProduct = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [uploading, setUploading] = useState({});
  const [editingFields, setEditingFields] = useState({});
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    fetchProductsContent();
  }, []);

  const fetchProductsContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products-content');
      if (response.ok) {
        const contentMap = {};
        const originalMap = {};
        Object.keys(response.data.data).forEach(section => {
          contentMap[section] = response.data.data[section].content;
          originalMap[section] = JSON.parse(JSON.stringify(response.data.data[section].content));
        });
        setContent(contentMap);
        setOriginalContent(originalMap);
      }
    } catch (error) {
      console.error('Error fetching products content:', error);
      showError('Failed to load content. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    setContent(prev => {
      const newContent = { ...prev };
      if (!newContent[section]) newContent[section] = {};
      
      if (index !== null) {
        const newArray = [...(newContent[section][field] || [])];
        if (typeof value === 'object') {
          newArray[index] = { ...newArray[index], ...value };
        } else {
          newArray[index] = value;
        }
        newContent[section][field] = newArray;
      } else if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newContent[section][parent] = { ...newContent[section][parent], [child]: value };
      } else {
        newContent[section][field] = value;
      }
      
      return newContent;
    });
    
    const fieldKey = index !== null ? `${section}.${field}.${index}` : `${section}.${field}`;
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  const handleArrayItemChange = (section, field, index, subField, value) => {
    setContent(prev => {
      const newContent = { ...prev };
      if (!newContent[section]) newContent[section] = {};
      const newArray = [...(newContent[section][field] || [])];
      newArray[index] = { ...newArray[index], [subField]: value };
      newContent[section][field] = newArray;
      return newContent;
    });
    
    const fieldKey = `${section}.${field}.${index}.${subField}`;
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  const handleNestedArrayChange = (section, field, productIndex, nestedField, nestedIndex, value) => {
    setContent(prev => {
      const newContent = { ...prev };
      const products = [...(newContent[section][field] || [])];
      const nestedArray = [...(products[productIndex][nestedField] || [])];
      
      if (typeof value === 'object') {
        nestedArray[nestedIndex] = { ...nestedArray[nestedIndex], ...value };
      } else {
        nestedArray[nestedIndex] = value;
      }
      
      products[productIndex] = { ...products[productIndex], [nestedField]: nestedArray };
      newContent[section][field] = products;
      return newContent;
    });
    
    const fieldKey = `${section}.${field}.${productIndex}.${nestedField}.${nestedIndex}`;
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  const addArrayItem = (section, field, defaultItem = {}) => {
    setContent(prev => {
      const newContent = { ...prev };
      if (!newContent[section]) newContent[section] = {};
      const newArray = [...(newContent[section][field] || [])];
      newArray.push(defaultItem);
      newContent[section][field] = newArray;
      return newContent;
    });
    
    const fieldKey = `${section}.${field}`;
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  const removeArrayItem = (section, field, index) => {
    setContent(prev => {
      const newContent = { ...prev };
      const newArray = [...(newContent[section][field] || [])];
      newArray.splice(index, 1);
      newContent[section][field] = newArray;
      return newContent;
    });
    
    const fieldKey = `${section}.${field}`;
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  const addNestedArrayItem = (section, field, productIndex, nestedField, defaultItem = '') => {
    setContent(prev => {
      const newContent = { ...prev };
      const products = [...(newContent[section][field] || [])];
      const nestedArray = [...(products[productIndex][nestedField] || [])];
      nestedArray.push(defaultItem);
      products[productIndex] = { ...products[productIndex], [nestedField]: nestedArray };
      newContent[section][field] = products;
      return newContent;
    });
    
    const fieldKey = `${section}.${field}.${productIndex}.${nestedField}`;
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  const removeNestedArrayItem = (section, field, productIndex, nestedField, nestedIndex) => {
    setContent(prev => {
      const newContent = { ...prev };
      const products = [...(newContent[section][field] || [])];
      const nestedArray = [...(products[productIndex][nestedField] || [])];
      nestedArray.splice(nestedIndex, 1);
      products[productIndex] = { ...products[productIndex], [nestedField]: nestedArray };
      newContent[section][field] = products;
      return newContent;
    });
    
    const fieldKey = `${section}.${field}.${productIndex}.${nestedField}`;
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  const handleImageUpload = async (section, field, productIndex, file) => {
    try {
      setUploading({ ...uploading, [`${section}-${field}-${productIndex}`]: true });
      
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/products-content/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        handleArrayItemChange(section, field, productIndex, 'image', result.data.filename);
        showSuccess('Image uploaded successfully!');
      } else {
        showError('Failed to upload image: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Failed to upload image. Please try again.');
    } finally {
      setUploading({ ...uploading, [`${section}-${field}-${productIndex}`]: false });
    }
  };

  const saveField = async (section, field, index = null) => {
    const fieldKey = index !== null ? `${section}.${field}.${index}` : `${section}.${field}`;
    
    try {
      setSaving({ ...saving, [fieldKey]: true });
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/products-content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: content[section] })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showSuccess('Content saved successfully!');
        setEditingFields(prev => {
          const newFields = { ...prev };
          delete newFields[fieldKey];
          return newFields;
        });
        setOriginalContent(prev => ({
          ...prev,
          [section]: JSON.parse(JSON.stringify(content[section]))
        }));
      } else {
        showError('Failed to save: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showError('Failed to save content. Please try again.');
    } finally {
      setSaving({ ...saving, [fieldKey]: false });
    }
  };

  const saveSection = async (section) => {
    try {
      setSaving({ ...saving, [section]: true });
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/products-content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: content[section] })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showSuccess('Section saved successfully!');
        setEditingFields(prev => {
          const newFields = {};
          Object.keys(prev).forEach(key => {
            if (!key.startsWith(`${section}.`)) {
              newFields[key] = prev[key];
            }
          });
          return newFields;
        });
        setOriginalContent(prev => ({
          ...prev,
          [section]: JSON.parse(JSON.stringify(content[section]))
        }));
      } else {
        showError('Failed to save: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showError('Failed to save content. Please try again.');
    } finally {
      setSaving({ ...saving, [section]: false });
    }
  };

  const EditableField = ({ section, field, value, onChange, type = 'text', rows = 1, index = null, placeholder = '', subField = null, productIndex = null, nestedField = null, nestedIndex = null }) => {
    let fieldKey;
    if (nestedIndex !== null) {
      fieldKey = `${section}.${field}.${productIndex}.${nestedField}.${nestedIndex}`;
    } else if (productIndex !== null && subField !== null) {
      fieldKey = `${section}.${field}.${productIndex}.${subField}`;
    } else if (index !== null && subField !== null) {
      fieldKey = `${section}.${field}.${index}.${subField}`;
    } else if (index !== null) {
      fieldKey = `${section}.${field}.${index}`;
    } else {
      fieldKey = `${section}.${field}`;
    }
    
    const isEdited = editingFields[fieldKey] || false;
    const isSaving = saving[fieldKey] || false;

    return (
      <div className="editable-field-wrapper">
        {type === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="editable-input"
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="editable-input"
          />
        )}
        {isEdited && (
          <button
            className="inline-save-btn"
            onClick={() => saveField(section, field, index)}
            disabled={isSaving}
            title="Save changes"
          >
            {isSaving ? (
              <span className="spinner"></span>
            ) : (
              <FaSave />
            )}
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-product-loading">
        <p>Loading content...</p>
      </div>
    );
  }

  const sections = ['hero', 'solar_storage', 'smart_packaging', 'cta'];

  return (
    <div className="admin-product">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      
      <div className="admin-product-header">
        <h2>Edit Products Page Content</h2>
        <div className="section-tabs">
          {sections.map(section => (
            <button
              key={section}
              className={`section-tab ${activeSection === section ? 'active' : ''}`}
              onClick={() => setActiveSection(section)}
            >
              {section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-product-content">
        {/* Hero Section */}
        {activeSection === 'hero' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Hero Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('hero')} disabled={saving['hero']}>
                {saving['hero'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <EditableField
                section="hero"
                field="title"
                value={content.hero?.title}
                onChange={(val) => handleInputChange('hero', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <EditableField
                section="hero"
                field="subtitle"
                value={content.hero?.subtitle}
                onChange={(val) => handleInputChange('hero', 'subtitle', val)}
                type="textarea"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Solar Storage Section */}
        {activeSection === 'solar_storage' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Solar Storage Products</h3>
              <button className="save-section-btn" onClick={() => saveSection('solar_storage')} disabled={saving['solar_storage']}>
                {saving['solar_storage'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Section Title</label>
              <EditableField
                section="solar_storage"
                field="title"
                value={content.solar_storage?.title}
                onChange={(val) => handleInputChange('solar_storage', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Section Subtitle</label>
              <EditableField
                section="solar_storage"
                field="subtitle"
                value={content.solar_storage?.subtitle}
                onChange={(val) => handleInputChange('solar_storage', 'subtitle', val)}
                type="textarea"
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Products</label>
              {(content.solar_storage?.products || []).map((product, index) => (
                <div key={index} className="product-edit-card">
                  <div className="card-header">
                    <h4>Product {index + 1}: {product.name || 'New Product'}</h4>
                    <button className="remove-btn" onClick={() => removeArrayItem('solar_storage', 'products', index)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                  
                  <div className="product-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Product ID</label>
                        <EditableField
                          section="solar_storage"
                          field="products"
                          value={product.id}
                          onChange={(val) => handleArrayItemChange('solar_storage', 'products', index, 'id', val)}
                          index={index}
                          subField="id"
                        />
                      </div>
                      <div className="form-group">
                        <label>Name</label>
                        <EditableField
                          section="solar_storage"
                          field="products"
                          value={product.name}
                          onChange={(val) => handleArrayItemChange('solar_storage', 'products', index, 'name', val)}
                          index={index}
                          subField="name"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Description</label>
                      <EditableField
                        section="solar_storage"
                        field="products"
                        value={product.description}
                        onChange={(val) => handleArrayItemChange('solar_storage', 'products', index, 'description', val)}
                        type="textarea"
                        rows={3}
                        index={index}
                        subField="description"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Capacity</label>
                        <EditableField
                          section="solar_storage"
                          field="products"
                          value={product.capacity}
                          onChange={(val) => handleArrayItemChange('solar_storage', 'products', index, 'capacity', val)}
                          index={index}
                          subField="capacity"
                        />
                      </div>
                      <div className="form-group">
                        <label>Price</label>
                        <EditableField
                          section="solar_storage"
                          field="products"
                          value={product.price}
                          onChange={(val) => handleArrayItemChange('solar_storage', 'products', index, 'price', val)}
                          index={index}
                          subField="price"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Product Image</label>
                      <div className="image-upload-item">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleImageUpload('solar_storage', 'products', index, e.target.files[0]);
                            }
                          }}
                          disabled={uploading[`solar_storage-products-${index}`]}
                        />
                        {product.image && (
                          <div className="image-preview">
                            <img src={product.image.startsWith('http') ? product.image : `https://st69310.ispot.cc/farmsolutionss/uploads/${product.image}`} alt={product.name} />
                            <span>{product.image}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Benefits</label>
                      {(product.benefits || []).map((benefit, bIndex) => (
                        <div key={bIndex} className="array-item">
                          <EditableField
                            section="solar_storage"
                            field="products"
                            value={benefit}
                            onChange={(val) => handleNestedArrayChange('solar_storage', 'products', index, 'benefits', bIndex, val)}
                            productIndex={index}
                            nestedField="benefits"
                            nestedIndex={bIndex}
                          />
                          <button onClick={() => removeNestedArrayItem('solar_storage', 'products', index, 'benefits', bIndex)}>
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button className="add-item-btn" onClick={() => addNestedArrayItem('solar_storage', 'products', index, 'benefits', '')}>
                        <FaPlus /> Add Benefit
                      </button>
                    </div>
                    
                    <div className="form-group">
                      <label>Features</label>
                      {(product.features || []).map((feature, fIndex) => (
                        <div key={fIndex} className="array-item">
                          <EditableField
                            section="solar_storage"
                            field="products"
                            value={feature}
                            onChange={(val) => handleNestedArrayChange('solar_storage', 'products', index, 'features', fIndex, val)}
                            productIndex={index}
                            nestedField="features"
                            nestedIndex={fIndex}
                          />
                          <button onClick={() => removeNestedArrayItem('solar_storage', 'products', index, 'features', fIndex)}>
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button className="add-item-btn" onClick={() => addNestedArrayItem('solar_storage', 'products', index, 'features', '')}>
                        <FaPlus /> Add Feature
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addArrayItem('solar_storage', 'products', {
                id: `spethacs-room-${Date.now()}`,
                name: '',
                description: '',
                capacity: '',
                price: 'Contact for pricing',
                image: '',
                benefits: [],
                features: []
              })}>
                <FaPlus /> Add Product
              </button>
            </div>
          </div>
        )}

        {/* Smart Packaging Section */}
        {activeSection === 'smart_packaging' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Smart Packaging Products</h3>
              <button className="save-section-btn" onClick={() => saveSection('smart_packaging')} disabled={saving['smart_packaging']}>
                {saving['smart_packaging'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Section Title</label>
              <EditableField
                section="smart_packaging"
                field="title"
                value={content.smart_packaging?.title}
                onChange={(val) => handleInputChange('smart_packaging', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Section Subtitle</label>
              <EditableField
                section="smart_packaging"
                field="subtitle"
                value={content.smart_packaging?.subtitle}
                onChange={(val) => handleInputChange('smart_packaging', 'subtitle', val)}
                type="textarea"
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Products</label>
              {(content.smart_packaging?.products || []).map((product, index) => (
                <div key={index} className="product-edit-card">
                  <div className="card-header">
                    <h4>Product {index + 1}: {product.name || 'New Product'}</h4>
                    <button className="remove-btn" onClick={() => removeArrayItem('smart_packaging', 'products', index)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                  
                  <div className="product-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Product ID</label>
                        <EditableField
                          section="smart_packaging"
                          field="products"
                          value={product.id}
                          onChange={(val) => handleArrayItemChange('smart_packaging', 'products', index, 'id', val)}
                          index={index}
                          subField="id"
                        />
                      </div>
                      <div className="form-group">
                        <label>Name</label>
                        <EditableField
                          section="smart_packaging"
                          field="products"
                          value={product.name}
                          onChange={(val) => handleArrayItemChange('smart_packaging', 'products', index, 'name', val)}
                          index={index}
                          subField="name"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Description</label>
                      <EditableField
                        section="smart_packaging"
                        field="products"
                        value={product.description}
                        onChange={(val) => handleArrayItemChange('smart_packaging', 'products', index, 'description', val)}
                        type="textarea"
                        rows={3}
                        index={index}
                        subField="description"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price</label>
                        <EditableField
                          section="smart_packaging"
                          field="products"
                          value={product.price}
                          onChange={(val) => handleArrayItemChange('smart_packaging', 'products', index, 'price', val)}
                          index={index}
                          subField="price"
                        />
                      </div>
                      <div className="form-group">
                        <label>Best For</label>
                        <EditableField
                          section="smart_packaging"
                          field="products"
                          value={product.bestFor}
                          onChange={(val) => handleArrayItemChange('smart_packaging', 'products', index, 'bestFor', val)}
                          index={index}
                          subField="bestFor"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Features</label>
                      {(product.features || []).map((feature, fIndex) => (
                        <div key={fIndex} className="array-item">
                          <EditableField
                            section="smart_packaging"
                            field="products"
                            value={feature}
                            onChange={(val) => handleNestedArrayChange('smart_packaging', 'products', index, 'features', fIndex, val)}
                            productIndex={index}
                            nestedField="features"
                            nestedIndex={fIndex}
                          />
                          <button onClick={() => removeNestedArrayItem('smart_packaging', 'products', index, 'features', fIndex)}>
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button className="add-item-btn" onClick={() => addNestedArrayItem('smart_packaging', 'products', index, 'features', '')}>
                        <FaPlus /> Add Feature
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addArrayItem('smart_packaging', 'products', {
                id: `smart-packaging-${Date.now()}`,
                name: '',
                description: '',
                price: '',
                bestFor: '',
                features: []
              })}>
                <FaPlus /> Add Product
              </button>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {activeSection === 'cta' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>CTA Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('cta')} disabled={saving['cta']}>
                {saving['cta'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <EditableField
                section="cta"
                field="title"
                value={content.cta?.title}
                onChange={(val) => handleInputChange('cta', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <EditableField
                section="cta"
                field="subtitle"
                value={content.cta?.subtitle}
                onChange={(val) => handleInputChange('cta', 'subtitle', val)}
                type="textarea"
                rows={2}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Primary Button Text</label>
                <EditableField
                  section="cta"
                  field="primaryButton.text"
                  value={content.cta?.primaryButton?.text}
                  onChange={(val) => handleInputChange('cta', 'primaryButton.text', val)}
                />
              </div>
              <div className="form-group">
                <label>Primary Button Link</label>
                <EditableField
                  section="cta"
                  field="primaryButton.link"
                  value={content.cta?.primaryButton?.link}
                  onChange={(val) => handleInputChange('cta', 'primaryButton.link', val)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Secondary Button Text</label>
                <EditableField
                  section="cta"
                  field="secondaryButton.text"
                  value={content.cta?.secondaryButton?.text}
                  onChange={(val) => handleInputChange('cta', 'secondaryButton.text', val)}
                />
              </div>
              <div className="form-group">
                <label>Secondary Button Link</label>
                <EditableField
                  section="cta"
                  field="secondaryButton.link"
                  value={content.cta?.secondaryButton?.link}
                  onChange={(val) => handleInputChange('cta', 'secondaryButton.link', val)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProduct;
