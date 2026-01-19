import React, { useState, useEffect } from 'react';
import { FaSave, FaTrash, FaPlus } from 'react-icons/fa';
import api, { API_BASE_URL } from '../config/api';
import useNotification from '../hooks/useNotification';
import NotificationContainer from '../components/NotificationContainer';
import './AdminImpact.css';

const AdminImpact = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [editingFields, setEditingFields] = useState({});
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    fetchImpactContent();
  }, []);

  const fetchImpactContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/impact-content');
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
      console.error('Error fetching impact content:', error);
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

  const saveField = async (section, field, index = null) => {
    const fieldKey = index !== null ? `${section}.${field}.${index}` : `${section}.${field}`;
    
    try {
      setSaving({ ...saving, [fieldKey]: true });
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/impact-content/${section}`, {
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
      const response = await fetch(`${API_BASE_URL}/impact-content/${section}`, {
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

  const EditableField = ({ section, field, value, onChange, type = 'text', rows = 1, index = null, placeholder = '', subField = null }) => {
    let fieldKey;
    if (index !== null && subField !== null) {
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
      <div className="admin-impact-loading">
        <p>Loading content...</p>
      </div>
    );
  }

  const sections = ['hero', 'stats', 'testimonials', 'cta'];

  // Available icon options for testimonials
  const iconOptions = [
    'FaUser', 'FaUserTie', 'FaUsers', 'FaUserCircle'
  ];

  return (
    <div className="admin-impact">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      
      <div className="admin-impact-header">
        <h2>Edit Impact Page Content</h2>
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

      <div className="admin-impact-content">
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

        {/* Stats Section */}
        {activeSection === 'stats' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Impact Statistics</h3>
              <button className="save-section-btn" onClick={() => saveSection('stats')} disabled={saving['stats']}>
                {saving['stats'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Statistics</label>
              {(content.stats?.stats || []).map((stat, index) => (
                <div key={index} className="stat-edit-card">
                  <div className="card-header">
                    <h4>Stat {index + 1}</h4>
                    <button className="remove-btn" onClick={() => removeArrayItem('stats', 'stats', index)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                  
                  <div className="stat-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Number</label>
                        <EditableField
                          section="stats"
                          field="stats"
                          value={stat.number}
                          onChange={(val) => handleArrayItemChange('stats', 'stats', index, 'number', val)}
                          index={index}
                          subField="number"
                          placeholder="10,000+"
                        />
                      </div>
                      <div className="form-group">
                        <label>Label</label>
                        <EditableField
                          section="stats"
                          field="stats"
                          value={stat.label}
                          onChange={(val) => handleArrayItemChange('stats', 'stats', index, 'label', val)}
                          index={index}
                          subField="label"
                          placeholder="Farmers Helped"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addArrayItem('stats', 'stats', {
                number: '',
                label: ''
              })}>
                <FaPlus /> Add Statistic
              </button>
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {activeSection === 'testimonials' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Testimonials Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('testimonials')} disabled={saving['testimonials']}>
                {saving['testimonials'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Section Title</label>
              <EditableField
                section="testimonials"
                field="title"
                value={content.testimonials?.title}
                onChange={(val) => handleInputChange('testimonials', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Testimonials</label>
              {(content.testimonials?.testimonials || []).map((testimonial, index) => (
                <div key={index} className="testimonial-edit-card">
                  <div className="card-header">
                    <h4>Testimonial {index + 1}: {testimonial.name || 'New Testimonial'}</h4>
                    <button className="remove-btn" onClick={() => removeArrayItem('testimonials', 'testimonials', index)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                  
                  <div className="testimonial-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Name</label>
                        <EditableField
                          section="testimonials"
                          field="testimonials"
                          value={testimonial.name}
                          onChange={(val) => handleArrayItemChange('testimonials', 'testimonials', index, 'name', val)}
                          index={index}
                          subField="name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <EditableField
                          section="testimonials"
                          field="testimonials"
                          value={testimonial.location}
                          onChange={(val) => handleArrayItemChange('testimonials', 'testimonials', index, 'location', val)}
                          index={index}
                          subField="location"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Role</label>
                        <EditableField
                          section="testimonials"
                          field="testimonials"
                          value={testimonial.role}
                          onChange={(val) => handleArrayItemChange('testimonials', 'testimonials', index, 'role', val)}
                          index={index}
                          subField="role"
                        />
                      </div>
                      <div className="form-group">
                        <label>Icon (e.g., FaUser)</label>
                        <EditableField
                          section="testimonials"
                          field="testimonials"
                          value={testimonial.icon}
                          onChange={(val) => handleArrayItemChange('testimonials', 'testimonials', index, 'icon', val)}
                          index={index}
                          subField="icon"
                          placeholder="FaUser"
                        />
                        <small className="help-text">Available icons: {iconOptions.join(', ')}</small>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Rating (1-5)</label>
                        <EditableField
                          section="testimonials"
                          field="testimonials"
                          value={testimonial.rating}
                          onChange={(val) => handleArrayItemChange('testimonials', 'testimonials', index, 'rating', parseInt(val) || 5)}
                          type="number"
                          index={index}
                          subField="rating"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Testimonial Text</label>
                      <EditableField
                        section="testimonials"
                        field="testimonials"
                        value={testimonial.text}
                        onChange={(val) => handleArrayItemChange('testimonials', 'testimonials', index, 'text', val)}
                        type="textarea"
                        rows={4}
                        index={index}
                        subField="text"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addArrayItem('testimonials', 'testimonials', {
                name: '',
                location: '',
                role: '',
                icon: 'FaUser',
                text: '',
                rating: 5
              })}>
                <FaPlus /> Add Testimonial
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
                <label>Button Text</label>
                <EditableField
                  section="cta"
                  field="button.text"
                  value={content.cta?.button?.text}
                  onChange={(val) => handleInputChange('cta', 'button.text', val)}
                />
              </div>
              <div className="form-group">
                <label>Button Link</label>
                <EditableField
                  section="cta"
                  field="button.link"
                  value={content.cta?.button?.link}
                  onChange={(val) => handleInputChange('cta', 'button.link', val)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImpact;
