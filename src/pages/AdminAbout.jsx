import React, { useState, useEffect } from 'react';
import { FaSave, FaEdit } from 'react-icons/fa';
import api, { API_BASE_URL } from '../config/api';
import useNotification from '../hooks/useNotification';
import NotificationContainer from '../components/NotificationContainer';
import './AdminAbout.css';

const AdminAbout = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [editingFields, setEditingFields] = useState({});
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  // Fetch all about content on mount
  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/about-content');
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
      console.error('Error fetching about content:', error);
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
        newArray[index] = value;
        newContent[section][field] = newArray;
      } else if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newContent[section][parent] = { ...newContent[section][parent], [child]: value };
      } else {
        newContent[section][field] = value;
      }
      
      return newContent;
    });
    
    // Mark field as edited
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
      const response = await fetch(`${API_BASE_URL}/about-content/${section}`, {
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
      const response = await fetch(`${API_BASE_URL}/about-content/${section}`, {
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

  const isFieldEdited = (section, field, index = null) => {
    const fieldKey = index !== null ? `${section}.${field}.${index}` : `${section}.${field}`;
    return editingFields[fieldKey] || false;
  };

  const sections = ['hero', 'content', 'team'];

  if (loading) {
    return (
      <div className="admin-about-loading">
        <p>Loading content...</p>
      </div>
    );
  }

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

  return (
    <div className="admin-about">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      
      <div className="admin-about-header">
        <h2>Edit About Page Content</h2>
        <div className="section-tabs">
          {sections.map(section => (
            <button
              key={section}
              className={`section-tab ${activeSection === section ? 'active' : ''}`}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-about-content">
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
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Content Section */}
        {activeSection === 'content' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>About Content</h3>
              <button className="save-section-btn" onClick={() => saveSection('content')} disabled={saving['content']}>
                {saving['content'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Paragraphs (one paragraph per line)</label>
              <EditableField
                section="content"
                field="paragraphs"
                value={(content.content?.paragraphs || []).join('\n\n')}
                onChange={(val) => handleInputChange('content', 'paragraphs', val.split('\n\n').filter(p => p.trim()))}
                type="textarea"
                rows={10}
              />
            </div>
            <div className="form-group">
              <label>Individual Paragraphs</label>
              {(content.content?.paragraphs || []).map((paragraph, index) => (
                <div key={index} className="array-item">
                  <EditableField
                    section="content"
                    field="paragraphs"
                    value={paragraph}
                    onChange={(val) => handleInputChange('content', 'paragraphs', val, index)}
                    type="textarea"
                    rows={3}
                    placeholder="Enter paragraph text"
                    index={index}
                  />
                  <button onClick={() => removeArrayItem('content', 'paragraphs', index)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('content', 'paragraphs', '')}>Add Paragraph</button>
            </div>
          </div>
        )}

        {/* Team Section */}
        {activeSection === 'team' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Team Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('team')} disabled={saving['team']}>
                {saving['team'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Section Title</label>
              <EditableField
                section="team"
                field="title"
                value={content.team?.title}
                onChange={(val) => handleInputChange('team', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Team Members</label>
              {(content.team?.teamMembers || []).map((member, index) => (
                <div key={member.id || index} className="team-member-edit">
                  <h4>Member {index + 1}</h4>
                  <EditableField
                    section="team"
                    field="teamMembers"
                    value={member.name}
                    onChange={(val) => handleArrayItemChange('team', 'teamMembers', index, 'name', val)}
                    placeholder="Name"
                    index={index}
                    subField="name"
                  />
                  <EditableField
                    section="team"
                    field="teamMembers"
                    value={member.position}
                    onChange={(val) => handleArrayItemChange('team', 'teamMembers', index, 'position', val)}
                    placeholder="Position"
                    index={index}
                    subField="position"
                  />
                  <EditableField
                    section="team"
                    field="teamMembers"
                    value={member.qualification}
                    onChange={(val) => handleArrayItemChange('team', 'teamMembers', index, 'qualification', val)}
                    type="textarea"
                    rows={2}
                    placeholder="Qualification"
                    index={index}
                    subField="qualification"
                  />
                  <p className="form-help-text">
                    <strong>Note:</strong> Team member images are managed in the <strong>Images</strong> section. 
                    Upload images with category "Team Member Photos" there, including name, role, and qualification.
                  </p>
                  <button onClick={() => removeArrayItem('team', 'teamMembers', index)}>Remove Member</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('team', 'teamMembers', { id: Date.now(), name: '', position: '', qualification: '', image: '' })}>Add Team Member</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAbout;
