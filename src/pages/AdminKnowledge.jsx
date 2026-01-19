import React, { useState, useEffect } from 'react';
import { FaSave, FaTrash, FaPlus } from 'react-icons/fa';
import api, { API_BASE_URL } from '../config/api';
import useNotification from '../hooks/useNotification';
import NotificationContainer from '../components/NotificationContainer';
import './AdminKnowledge.css';

const AdminKnowledge = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [editingFields, setEditingFields] = useState({});
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    fetchKnowledgeContent();
  }, []);

  const fetchKnowledgeContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/knowledge-content');
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
      console.error('Error fetching knowledge content:', error);
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
      const response = await fetch(`${API_BASE_URL}/knowledge-content/${section}`, {
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
      const response = await fetch(`${API_BASE_URL}/knowledge-content/${section}`, {
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
      <div className="admin-knowledge-loading">
        <p>Loading content...</p>
      </div>
    );
  }

  const sections = ['hero', 'resources', 'newsletter'];

  // Available icon options for resources
  const iconOptions = [
    'FaBook', 'FaSun', 'FaSeedling', 'FaChartBar', 'FaTools', 'FaBookOpen',
    'FaGraduationCap', 'FaFileAlt', 'FaVideo', 'FaNewspaper', 'FaLightbulb'
  ];

  return (
    <div className="admin-knowledge">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      
      <div className="admin-knowledge-header">
        <h2>Edit Knowledge Page Content</h2>
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

      <div className="admin-knowledge-content">
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

        {/* Resources Section */}
        {activeSection === 'resources' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Resources Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('resources')} disabled={saving['resources']}>
                {saving['resources'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Resources</label>
              {(content.resources?.resources || []).map((resource, index) => (
                <div key={index} className="resource-edit-card">
                  <div className="card-header">
                    <h4>Resource {index + 1}: {resource.title || 'New Resource'}</h4>
                    <button className="remove-btn" onClick={() => removeArrayItem('resources', 'resources', index)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                  
                  <div className="resource-fields">
                    <div className="form-group">
                      <label>Title</label>
                      <EditableField
                        section="resources"
                        field="resources"
                        value={resource.title}
                        onChange={(val) => handleArrayItemChange('resources', 'resources', index, 'title', val)}
                        index={index}
                        subField="title"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Description</label>
                      <EditableField
                        section="resources"
                        field="resources"
                        value={resource.description}
                        onChange={(val) => handleArrayItemChange('resources', 'resources', index, 'description', val)}
                        type="textarea"
                        rows={3}
                        index={index}
                        subField="description"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Type</label>
                        <EditableField
                          section="resources"
                          field="resources"
                          value={resource.type}
                          onChange={(val) => handleArrayItemChange('resources', 'resources', index, 'type', val)}
                          index={index}
                          subField="type"
                          placeholder="Guide, Article, Resource, Case Study"
                        />
                      </div>
                      <div className="form-group">
                        <label>Icon (e.g., FaBook)</label>
                        <EditableField
                          section="resources"
                          field="resources"
                          value={resource.icon}
                          onChange={(val) => handleArrayItemChange('resources', 'resources', index, 'icon', val)}
                          index={index}
                          subField="icon"
                          placeholder="FaBook"
                        />
                        <small className="help-text">Available icons: {iconOptions.join(', ')}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addArrayItem('resources', 'resources', {
                title: '',
                description: '',
                type: 'Guide',
                icon: 'FaBook'
              })}>
                <FaPlus /> Add Resource
              </button>
            </div>
          </div>
        )}

        {/* Newsletter Section */}
        {activeSection === 'newsletter' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Newsletter Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('newsletter')} disabled={saving['newsletter']}>
                {saving['newsletter'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <EditableField
                section="newsletter"
                field="title"
                value={content.newsletter?.title}
                onChange={(val) => handleInputChange('newsletter', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <EditableField
                section="newsletter"
                field="subtitle"
                value={content.newsletter?.subtitle}
                onChange={(val) => handleInputChange('newsletter', 'subtitle', val)}
                type="textarea"
                rows={2}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email Placeholder</label>
                <EditableField
                  section="newsletter"
                  field="placeholder"
                  value={content.newsletter?.placeholder}
                  onChange={(val) => handleInputChange('newsletter', 'placeholder', val)}
                />
              </div>
              <div className="form-group">
                <label>Button Text</label>
                <EditableField
                  section="newsletter"
                  field="buttonText"
                  value={content.newsletter?.buttonText}
                  onChange={(val) => handleInputChange('newsletter', 'buttonText', val)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminKnowledge;
