import React, { useState, useEffect } from 'react';
import { FaSave, FaTrash, FaPlus } from 'react-icons/fa';
import api, { API_BASE_URL } from '../config/api';
import useNotification from '../hooks/useNotification';
import NotificationContainer from '../components/NotificationContainer';
import './AdminContact.css';

const AdminContact = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [editingFields, setEditingFields] = useState({});
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact-content');
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
      console.error('Error fetching contact content:', error);
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

  const addBusinessHour = () => {
    setContent(prev => {
      const newContent = { ...prev };
      if (!newContent.info) newContent.info = {};
      if (!newContent.info.businessHours) newContent.info.businessHours = {};
      if (!newContent.info.businessHours.hours) newContent.info.businessHours.hours = [];
      const newArray = [...newContent.info.businessHours.hours];
      newArray.push('');
      newContent.info.businessHours.hours = newArray;
      return newContent;
    });
  };

  const removeBusinessHour = (index) => {
    setContent(prev => {
      const newContent = { ...prev };
      const newArray = [...newContent.info.businessHours.hours];
      newArray.splice(index, 1);
      newContent.info.businessHours.hours = newArray;
      return newContent;
    });
  };

  const handleBusinessHourChange = (index, value) => {
    setContent(prev => {
      const newContent = { ...prev };
      const newArray = [...newContent.info.businessHours.hours];
      newArray[index] = value;
      newContent.info.businessHours.hours = newArray;
      return newContent;
    });
    
    const fieldKey = `info.businessHours.hours.${index}`;
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }));
  };

  const saveField = async (section, field, index = null) => {
    const fieldKey = index !== null ? `${section}.${field}.${index}` : `${section}.${field}`;
    
    try {
      setSaving({ ...saving, [fieldKey]: true });
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/contact-content/${section}`, {
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
      const response = await fetch(`${API_BASE_URL}/contact-content/${section}`, {
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
      <div className="admin-contact-loading">
        <p>Loading content...</p>
      </div>
    );
  }

  const sections = ['hero', 'info', 'form'];

  // Available icon options for contact details
  const iconOptions = [
    'FaEnvelope', 'FaPhone', 'FaMapMarkerAlt', 'FaClock', 'FaGlobe'
  ];

  return (
    <div className="admin-contact">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      
      <div className="admin-contact-header">
        <h2>Edit Contact Page Content</h2>
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

      <div className="admin-contact-content">
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

        {/* Info Section */}
        {activeSection === 'info' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Contact Info Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('info')} disabled={saving['info']}>
                {saving['info'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            
            <div className="form-group">
              <label>Section Title</label>
              <EditableField
                section="info"
                field="title"
                value={content.info?.title}
                onChange={(val) => handleInputChange('info', 'title', val)}
              />
            </div>
            
            <div className="form-group">
              <label>Section Description</label>
              <EditableField
                section="info"
                field="description"
                value={content.info?.description}
                onChange={(val) => handleInputChange('info', 'description', val)}
                type="textarea"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Contact Details</label>
              {(content.info?.contactDetails || []).map((detail, index) => (
                <div key={index} className="contact-detail-edit">
                  <div className="card-header">
                    <h4>Contact {index + 1}: {detail.label || 'New Contact'}</h4>
                    <button className="remove-btn" onClick={() => removeArrayItem('info', 'contactDetails', index)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                  
                  <div className="card-fields">
                    <div className="form-group">
                      <label>Icon (e.g., FaEnvelope)</label>
                      <EditableField
                        section="info"
                        field="contactDetails"
                        value={detail.icon}
                        onChange={(val) => handleArrayItemChange('info', 'contactDetails', index, 'icon', val)}
                        index={index}
                        subField="icon"
                        placeholder="FaEnvelope"
                      />
                      <small className="help-text">Available icons: {iconOptions.join(', ')}</small>
                    </div>
                    <div className="form-group">
                      <label>Label</label>
                      <EditableField
                        section="info"
                        field="contactDetails"
                        value={detail.label}
                        onChange={(val) => handleArrayItemChange('info', 'contactDetails', index, 'label', val)}
                        index={index}
                        subField="label"
                      />
                    </div>
                    <div className="form-group">
                      <label>Value</label>
                      <EditableField
                        section="info"
                        field="contactDetails"
                        value={detail.value}
                        onChange={(val) => handleArrayItemChange('info', 'contactDetails', index, 'value', val)}
                        index={index}
                        subField="value"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addArrayItem('info', 'contactDetails', {
                icon: 'FaEnvelope',
                label: '',
                value: ''
              })}>
                <FaPlus /> Add Contact Detail
              </button>
            </div>

            <div className="form-group">
              <label>Business Hours Title</label>
              <EditableField
                section="info"
                field="businessHours.title"
                value={content.info?.businessHours?.title}
                onChange={(val) => handleInputChange('info', 'businessHours.title', val)}
              />
            </div>

            <div className="form-group">
              <label>Business Hours</label>
              {(content.info?.businessHours?.hours || []).map((hour, index) => (
                <div key={index} className="business-hour-item">
                  <input
                    type="text"
                    value={hour}
                    onChange={(e) => handleBusinessHourChange(index, e.target.value)}
                    className="editable-input"
                    placeholder="Monday - Friday: 8:00 AM - 6:00 PM"
                  />
                  {(editingFields[`info.businessHours.hours.${index}`] || hour !== originalContent.info?.businessHours?.hours?.[index]) && (
                    <button
                      className="inline-save-btn"
                      onClick={() => saveField('info', 'businessHours.hours', index)}
                      disabled={saving[`info.businessHours.hours.${index}`]}
                      title="Save changes"
                    >
                      {saving[`info.businessHours.hours.${index}`] ? (
                        <span className="spinner"></span>
                      ) : (
                        <FaSave />
                      )}
                    </button>
                  )}
                  <button className="remove-btn" onClick={() => removeBusinessHour(index)}>
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button className="add-item-btn" onClick={addBusinessHour}>
                <FaPlus /> Add Business Hour
              </button>
            </div>
          </div>
        )}

        {/* Form Section */}
        {activeSection === 'form' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Contact Form Options</h3>
              <button className="save-section-btn" onClick={() => saveSection('form')} disabled={saving['form']}>
                {saving['form'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Interest Options</label>
              {(content.form?.interestOptions || []).map((option, index) => (
                <div key={index} className="form-option-item">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Value</label>
                      <EditableField
                        section="form"
                        field="interestOptions"
                        value={option.value}
                        onChange={(val) => handleArrayItemChange('form', 'interestOptions', index, 'value', val)}
                        index={index}
                        subField="value"
                        placeholder="hybrid-storage"
                      />
                    </div>
                    <div className="form-group">
                      <label>Label</label>
                      <EditableField
                        section="form"
                        field="interestOptions"
                        value={option.label}
                        onChange={(val) => handleArrayItemChange('form', 'interestOptions', index, 'label', val)}
                        index={index}
                        subField="label"
                        placeholder="Hybrid-Powered Storage Systems"
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button className="remove-btn" onClick={() => removeArrayItem('form', 'interestOptions', index)}>
                      <FaTrash /> Remove
                    </button>
                  )}
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addArrayItem('form', 'interestOptions', {
                value: '',
                label: ''
              })}>
                <FaPlus /> Add Interest Option
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContact;
