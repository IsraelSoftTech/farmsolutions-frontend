import React, { useState, useEffect } from 'react';
import { FaSave, FaTrash, FaPlus } from 'react-icons/fa';
import api, { API_BASE_URL } from '../config/api';
import useNotification from '../hooks/useNotification';
import NotificationContainer from '../components/NotificationContainer';
import './AdminKnowMore.css';

const AdminKnowMore = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [editingFields, setEditingFields] = useState({});
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    fetchHowItWorksContent();
  }, []);

  const fetchHowItWorksContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/how-it-works-content');
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
      console.error('Error fetching how it works content:', error);
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
      const response = await fetch(`${API_BASE_URL}/how-it-works-content/${section}`, {
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
      const response = await fetch(`${API_BASE_URL}/how-it-works-content/${section}`, {
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
      <div className="admin-know-more-loading">
        <p>Loading content...</p>
      </div>
    );
  }

  const sections = ['hero', 'steps', 'cta'];

  // Available icon options for steps
  const iconOptions = [
    'FaClipboardList', 'FaPalette', 'FaTools', 'FaBook', 'FaMobileAlt', 'FaTrophy',
    'FaCheckCircle', 'FaUsers', 'FaChartLine', 'FaCog', 'FaLightbulb', 'FaHandshake'
  ];

  return (
    <div className="admin-know-more">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      
      <div className="admin-know-more-header">
        <h2>Edit How It Works Page Content</h2>
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

      <div className="admin-know-more-content">
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

        {/* Steps Section */}
        {activeSection === 'steps' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Steps Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('steps')} disabled={saving['steps']}>
                {saving['steps'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Steps</label>
              {(content.steps?.steps || []).map((step, index) => (
                <div key={index} className="step-edit-card">
                  <div className="card-header">
                    <h4>Step {step.number || index + 1}: {step.title || 'New Step'}</h4>
                    <button className="remove-btn" onClick={() => removeArrayItem('steps', 'steps', index)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                  
                  <div className="step-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Step Number</label>
                        <EditableField
                          section="steps"
                          field="steps"
                          value={step.number}
                          onChange={(val) => handleArrayItemChange('steps', 'steps', index, 'number', val)}
                          index={index}
                          subField="number"
                        />
                      </div>
                      <div className="form-group">
                        <label>Icon (e.g., FaClipboardList)</label>
                        <EditableField
                          section="steps"
                          field="steps"
                          value={step.icon}
                          onChange={(val) => handleArrayItemChange('steps', 'steps', index, 'icon', val)}
                          index={index}
                          subField="icon"
                          placeholder="FaClipboardList"
                        />
                        <small className="help-text">Available icons: {iconOptions.join(', ')}</small>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Title</label>
                      <EditableField
                        section="steps"
                        field="steps"
                        value={step.title}
                        onChange={(val) => handleArrayItemChange('steps', 'steps', index, 'title', val)}
                        index={index}
                        subField="title"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Description</label>
                      <EditableField
                        section="steps"
                        field="steps"
                        value={step.description}
                        onChange={(val) => handleArrayItemChange('steps', 'steps', index, 'description', val)}
                        type="textarea"
                        rows={3}
                        index={index}
                        subField="description"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addArrayItem('steps', 'steps', {
                number: String((content.steps?.steps || []).length + 1),
                title: '',
                description: '',
                icon: 'FaCheckCircle'
              })}>
                <FaPlus /> Add Step
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

export default AdminKnowMore;
