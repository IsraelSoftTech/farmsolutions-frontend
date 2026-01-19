import React, { useState, useEffect } from 'react';
import { FaSave, FaEdit } from 'react-icons/fa';
import api, { API_BASE_URL } from '../config/api';
import useNotification from '../hooks/useNotification';
import NotificationContainer from '../components/NotificationContainer';
import './AdminHome.css';

const AdminHome = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [uploading, setUploading] = useState({});
  const [editingFields, setEditingFields] = useState({});
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  // Fetch all home content on mount
  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/home-content');
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
      console.error('Error fetching home content:', error);
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

  const handleImageUpload = async (section, field, index, file) => {
    try {
      setUploading({ ...uploading, [`${section}-${field}-${index}`]: true });
      
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/home-content/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (field === 'teamMembers') {
          handleArrayItemChange(section, field, index, 'image', result.data.filename);
        } else if (field === 'partners') {
          handleArrayItemChange(section, field, index, 'logo', result.data.filename);
        } else {
          const newArray = [...(content[section][field] || [])];
          newArray[index] = result.data.filename;
          handleInputChange(section, field, newArray);
        }
        showSuccess('Image uploaded successfully!');
      } else {
        showError('Failed to upload image: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Failed to upload image. Please try again.');
    } finally {
      setUploading({ ...uploading, [`${section}-${field}-${index}`]: false });
    }
  };

  const saveField = async (section, field, index = null) => {
    const fieldKey = index !== null ? `${section}.${field}.${index}` : `${section}.${field}`;
    
    try {
      setSaving({ ...saving, [fieldKey]: true });
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/home-content/${section}`, {
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
        // Update original content
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
      const response = await fetch(`${API_BASE_URL}/home-content/${section}`, {
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
        // Clear all editing flags for this section
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

  const sections = ['hero', 'problem', 'solution', 'impact', 'team', 'products_preview', 'partners'];

  if (loading) {
    return (
      <div className="admin-home-loading">
        <p>Loading content...</p>
      </div>
    );
  }

  const EditableField = ({ section, field, value, onChange, type = 'text', rows = 1, index = null, placeholder = '', subField = null }) => {
    // For array items, we need to check if the specific subfield is edited
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
    <div className="admin-home">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      
      <div className="admin-home-header">
        <h2>Edit Home Page Content</h2>
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

      <div className="admin-home-content">
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
              <label>Title (HTML allowed)</label>
              <EditableField
                section="hero"
                field="title"
                value={content.hero?.title}
                onChange={(val) => handleInputChange('hero', 'title', val)}
                type="textarea"
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <EditableField
                section="hero"
                field="tagline"
                value={content.hero?.tagline}
                onChange={(val) => handleInputChange('hero', 'tagline', val)}
                type="textarea"
                rows={2}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Primary Button Text</label>
                <EditableField
                  section="hero"
                  field="primaryButton.text"
                  value={content.hero?.primaryButton?.text}
                  onChange={(val) => handleInputChange('hero', 'primaryButton.text', val)}
                />
              </div>
              <div className="form-group">
                <label>Primary Button Link</label>
                <EditableField
                  section="hero"
                  field="primaryButton.link"
                  value={content.hero?.primaryButton?.link}
                  onChange={(val) => handleInputChange('hero', 'primaryButton.link', val)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Secondary Button Text</label>
                <EditableField
                  section="hero"
                  field="secondaryButton.text"
                  value={content.hero?.secondaryButton?.text}
                  onChange={(val) => handleInputChange('hero', 'secondaryButton.text', val)}
                />
              </div>
              <div className="form-group">
                <label>Secondary Button Link</label>
                <EditableField
                  section="hero"
                  field="secondaryButton.link"
                  value={content.hero?.secondaryButton?.link}
                  onChange={(val) => handleInputChange('hero', 'secondaryButton.link', val)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Banner Images</label>
              {(content.hero?.bannerImages || []).map((image, index) => (
                <div key={index} className="image-upload-item">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files[0]) {
                        try {
                          setUploading({ ...uploading, [`hero-bannerImages-${index}`]: true });
                          const formData = new FormData();
                          formData.append('image', e.target.files[0]);
                          const token = localStorage.getItem('authToken');
                          const response = await fetch(`${API_BASE_URL}/home-content/upload`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                          });
                          const result = await response.json();
                          if (result.success) {
                            const newArray = [...(content.hero?.bannerImages || [])];
                            newArray[index] = result.data.filename;
                            handleInputChange('hero', 'bannerImages', newArray);
                            showSuccess('Image uploaded successfully!');
                          } else {
                            showError('Failed to upload image');
                          }
                        } catch (error) {
                          showError('Failed to upload image');
                        } finally {
                          setUploading({ ...uploading, [`hero-bannerImages-${index}`]: false });
                        }
                      }
                    }}
                    disabled={uploading[`hero-bannerImages-${index}`]}
                  />
                  {image && (
                    <div className="image-preview">
                      <img src={image.startsWith('http') ? image : `https://st69310.ispot.cc/farmsolutionss/uploads/${image}`} alt={`Banner ${index + 1}`} />
                      <span>{image}</span>
                    </div>
                  )}
                  <button onClick={() => removeArrayItem('hero', 'bannerImages', index)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('hero', 'bannerImages', '')}>Add Banner Image</button>
            </div>
            <div className="form-group">
              <label>Stats</label>
              {(content.hero?.stats || []).map((stat, index) => (
                <div key={index} className="array-item">
                  <EditableField
                    section="hero"
                    field="stats"
                    value={stat.number}
                    onChange={(val) => handleArrayItemChange('hero', 'stats', index, 'number', val)}
                    placeholder="Number"
                    index={index}
                    subField="number"
                  />
                  <EditableField
                    section="hero"
                    field="stats"
                    value={stat.label}
                    onChange={(val) => handleArrayItemChange('hero', 'stats', index, 'label', val)}
                    placeholder="Label"
                    index={index}
                    subField="label"
                  />
                  <button onClick={() => removeArrayItem('hero', 'stats', index)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('hero', 'stats', { number: '', label: '' })}>Add Stat</button>
            </div>
          </div>
        )}

        {/* Problem Section */}
        {activeSection === 'problem' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Problem Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('problem')} disabled={saving['problem']}>
                {saving['problem'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <EditableField
                section="problem"
                field="title"
                value={content.problem?.title}
                onChange={(val) => handleInputChange('problem', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <EditableField
                section="problem"
                field="subtitle"
                value={content.problem?.subtitle}
                onChange={(val) => handleInputChange('problem', 'subtitle', val)}
                type="textarea"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Stats</label>
              {(content.problem?.stats || []).map((stat, index) => (
                <div key={index} className="array-item">
                  <EditableField
                    section="problem"
                    field="stats"
                    value={stat.number}
                    onChange={(val) => handleArrayItemChange('problem', 'stats', index, 'number', val)}
                    placeholder="Number"
                    index={index}
                  />
                  <EditableField
                    section="problem"
                    field="stats"
                    value={stat.label}
                    onChange={(val) => handleArrayItemChange('problem', 'stats', index, 'label', val)}
                    placeholder="Label"
                    index={index}
                  />
                  <EditableField
                    section="problem"
                    field="stats"
                    value={stat.icon}
                    onChange={(val) => handleArrayItemChange('problem', 'stats', index, 'icon', val)}
                    placeholder="Icon"
                    index={index}
                  />
                  <button onClick={() => removeArrayItem('problem', 'stats', index)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('problem', 'stats', { number: '', label: '', icon: '' })}>Add Stat</button>
            </div>
          </div>
        )}

        {/* Solution Section */}
        {activeSection === 'solution' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Solution Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('solution')} disabled={saving['solution']}>
                {saving['solution'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <EditableField
                section="solution"
                field="title"
                value={content.solution?.title}
                onChange={(val) => handleInputChange('solution', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <EditableField
                section="solution"
                field="subtitle"
                value={content.solution?.subtitle}
                onChange={(val) => handleInputChange('solution', 'subtitle', val)}
                type="textarea"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Solutions</label>
              {(content.solution?.solutions || []).map((solution, index) => (
                <div key={index} className="solution-card-edit">
                  <h4>Solution {index + 1}</h4>
                  <EditableField
                    section="solution"
                    field="solutions"
                    value={solution.icon}
                    onChange={(val) => handleArrayItemChange('solution', 'solutions', index, 'icon', val)}
                    placeholder="Icon (e.g., FaSolarPanel)"
                    index={index}
                  />
                  <EditableField
                    section="solution"
                    field="solutions"
                    value={solution.title}
                    onChange={(val) => handleArrayItemChange('solution', 'solutions', index, 'title', val)}
                    placeholder="Title"
                    index={index}
                  />
                  <EditableField
                    section="solution"
                    field="solutions"
                    value={solution.description}
                    onChange={(val) => handleArrayItemChange('solution', 'solutions', index, 'description', val)}
                    type="textarea"
                    rows={3}
                    placeholder="Description"
                    index={index}
                  />
                  <div className="features-list">
                    <label>Features</label>
                    {(solution.features || []).map((feature, fIndex) => (
                      <div key={fIndex} className="feature-item">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...(solution.features || [])];
                            newFeatures[fIndex] = e.target.value;
                            handleArrayItemChange('solution', 'solutions', index, 'features', newFeatures);
                          }}
                        />
                        <button onClick={() => {
                          const newFeatures = [...(solution.features || [])];
                          newFeatures.splice(fIndex, 1);
                          handleArrayItemChange('solution', 'solutions', index, 'features', newFeatures);
                        }}>Remove</button>
                      </div>
                    ))}
                    <button onClick={() => {
                      const newFeatures = [...(solution.features || []), ''];
                      handleArrayItemChange('solution', 'solutions', index, 'features', newFeatures);
                    }}>Add Feature</button>
                  </div>
                  <button onClick={() => removeArrayItem('solution', 'solutions', index)}>Remove Solution</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('solution', 'solutions', { icon: '', title: '', description: '', features: [] })}>Add Solution</button>
            </div>
          </div>
        )}

        {/* Impact Section */}
        {activeSection === 'impact' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Impact Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('impact')} disabled={saving['impact']}>
                {saving['impact'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <EditableField
                section="impact"
                field="title"
                value={content.impact?.title}
                onChange={(val) => handleInputChange('impact', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <EditableField
                section="impact"
                field="subtitle"
                value={content.impact?.subtitle}
                onChange={(val) => handleInputChange('impact', 'subtitle', val)}
                type="textarea"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Impacts</label>
              {(content.impact?.impacts || []).map((impact, index) => (
                <div key={index} className="array-item">
                  <EditableField
                    section="impact"
                    field="impacts"
                    value={impact.number}
                    onChange={(val) => handleArrayItemChange('impact', 'impacts', index, 'number', val)}
                    placeholder="Number"
                    index={index}
                  />
                  <EditableField
                    section="impact"
                    field="impacts"
                    value={impact.label}
                    onChange={(val) => handleArrayItemChange('impact', 'impacts', index, 'label', val)}
                    placeholder="Label"
                    index={index}
                  />
                  <EditableField
                    section="impact"
                    field="impacts"
                    value={impact.description}
                    onChange={(val) => handleArrayItemChange('impact', 'impacts', index, 'description', val)}
                    placeholder="Description"
                    index={index}
                  />
                  <button onClick={() => removeArrayItem('impact', 'impacts', index)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('impact', 'impacts', { number: '', label: '', description: '' })}>Add Impact</button>
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
              <label>Title</label>
              <EditableField
                section="team"
                field="title"
                value={content.team?.title}
                onChange={(val) => handleInputChange('team', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>About Content (one paragraph per line)</label>
              <EditableField
                section="team"
                field="aboutContent"
                value={(content.team?.aboutContent || []).join('\n')}
                onChange={(val) => handleInputChange('team', 'aboutContent', val.split('\n').filter(p => p.trim()))}
                type="textarea"
                rows={6}
              />
            </div>
            <div className="form-group">
              <label>Team Members</label>
              {(content.team?.teamMembers || []).map((member, index) => (
                <div key={index} className="team-member-edit">
                  <h4>Member {index + 1}</h4>
                  <EditableField
                    section="team"
                    field="teamMembers"
                    value={member.name}
                    onChange={(val) => handleArrayItemChange('team', 'teamMembers', index, 'name', val)}
                    placeholder="Name"
                    index={index}
                  />
                  <EditableField
                    section="team"
                    field="teamMembers"
                    value={member.position}
                    onChange={(val) => handleArrayItemChange('team', 'teamMembers', index, 'position', val)}
                    placeholder="Position"
                    index={index}
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
                  />
                  <div className="image-upload-item">
                    <label>Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload('team', 'teamMembers', index, e.target.files[0]);
                        }
                      }}
                      disabled={uploading[`team-teamMembers-${index}`]}
                    />
                    {member.image && (
                      <div className="image-preview">
                        <img src={member.image.startsWith('http') ? member.image : `https://st69310.ispot.cc/farmsolutionss/uploads/${member.image}`} alt={member.name} />
                        <span>{member.image}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => removeArrayItem('team', 'teamMembers', index)}>Remove Member</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('team', 'teamMembers', { id: Date.now(), name: '', position: '', qualification: '', image: '' })}>Add Team Member</button>
            </div>
          </div>
        )}

        {/* Products Preview Section */}
        {activeSection === 'products_preview' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Products Preview Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('products_preview')} disabled={saving['products_preview']}>
                {saving['products_preview'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <EditableField
                section="products_preview"
                field="title"
                value={content.products_preview?.title}
                onChange={(val) => handleInputChange('products_preview', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <EditableField
                section="products_preview"
                field="subtitle"
                value={content.products_preview?.subtitle}
                onChange={(val) => handleInputChange('products_preview', 'subtitle', val)}
                type="textarea"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Partners Section */}
        {activeSection === 'partners' && (
          <div className="edit-section">
            <div className="section-header">
              <h3>Partners Section</h3>
              <button className="save-section-btn" onClick={() => saveSection('partners')} disabled={saving['partners']}>
                {saving['partners'] ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <EditableField
                section="partners"
                field="title"
                value={content.partners?.title}
                onChange={(val) => handleInputChange('partners', 'title', val)}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <EditableField
                section="partners"
                field="subtitle"
                value={content.partners?.subtitle}
                onChange={(val) => handleInputChange('partners', 'subtitle', val)}
                type="textarea"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Partners</label>
              {(content.partners?.partners || []).map((partner, index) => (
                <div key={index} className="partner-edit">
                  <h4>Partner {index + 1}</h4>
                  <EditableField
                    section="partners"
                    field="partners"
                    value={partner.name}
                    onChange={(val) => handleArrayItemChange('partners', 'partners', index, 'name', val)}
                    placeholder="Name"
                    index={index}
                  />
                  <EditableField
                    section="partners"
                    field="partners"
                    value={partner.website}
                    onChange={(val) => handleArrayItemChange('partners', 'partners', index, 'website', val)}
                    placeholder="Website URL"
                    index={index}
                  />
                  <div className="image-upload-item">
                    <label>Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload('partners', 'partners', index, e.target.files[0]);
                        }
                      }}
                      disabled={uploading[`partners-partners-${index}`]}
                    />
                    {partner.logo && (
                      <div className="image-preview">
                        <img src={partner.logo.startsWith('http') ? partner.logo : `https://st69310.ispot.cc/farmsolutionss/uploads/${partner.logo}`} alt={partner.name} />
                        <span>{partner.logo}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => removeArrayItem('partners', 'partners', index)}>Remove Partner</button>
                </div>
              ))}
              <button onClick={() => addArrayItem('partners', 'partners', { id: Date.now(), name: '', website: '', logo: '' })}>Add Partner</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
