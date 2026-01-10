import React, { useState, useEffect } from 'react';
import './Admin_Home.css';
import useNotification from '../hooks/useNotification';
import NotificationContainer from '../components/NotificationContainer';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Admin_Home = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [backendError, setBackendError] = useState(false);
  
  // Home page content organized by sections
  const [heroSection, setHeroSection] = useState(null);
  const [heroBanners, setHeroBanners] = useState([]);
  const [heroStats, setHeroStats] = useState([]);
  
  const [problemSection, setProblemSection] = useState(null);
  const [problemStats, setProblemStats] = useState([]);
  
  const [solutionSection, setSolutionSection] = useState(null);
  const [solutionCards, setSolutionCards] = useState([]);
  
  const [impactSection, setImpactSection] = useState(null);
  const [impactStats, setImpactStats] = useState([]);
  
  const [partners, setPartners] = useState([]);
  
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    // Small delay to ensure component is mounted before loading
    const timer = setTimeout(() => {
      loadData();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Helper function for fetch with timeout
  const fetchWithTimeout = (url, options = {}, timeout = 8000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  };

  const loadData = async () => {
    setLoading(true);
    const startTime = Date.now();
    
    // Always stop loading after 10 seconds max, even if requests are pending
    const loadingTimeout = setTimeout(() => {
      console.log('Load timeout reached - stopping loading state');
      setLoading(false);
    }, 10000);
    
    try {
      // Load sections
      try {
        const sectionsRes = await fetchWithTimeout(`${API_BASE}/home/sections`, {}, 5000);
        if (!sectionsRes.ok) {
          throw new Error(`HTTP ${sectionsRes.status}: ${sectionsRes.statusText}`);
        }
        const sectionsData = await sectionsRes.json();
        if (sectionsData.success) {
          const sections = sectionsData.data || [];
          setHeroSection(sections.find(s => s.section_name === 'hero') || null);
          setProblemSection(sections.find(s => s.section_name === 'problem') || null);
          setSolutionSection(sections.find(s => s.section_name === 'solution') || null);
          setImpactSection(sections.find(s => s.section_name === 'impact') || null);
        }
      } catch (error) {
        console.error('Error loading sections:', error.message);
        console.log('This is normal if the backend server is not running or tables do not exist yet.');
        setBackendError(true);
        // Continue even if sections fail - show empty state
      }
      
      // Load all content items with timeout - use Promise.allSettled to continue even if some fail
      await Promise.allSettled([
        loadHeroBanners(),
        loadHeroStats(),
        loadProblemStats(),
        loadSolutionCards(),
        loadImpactStats(),
        loadPartners(),
      ]);
      
      const duration = Date.now() - startTime;
      console.log(`Data loading completed in ${duration}ms`);
    } catch (error) {
      console.error('Error loading data:', error.message);
      console.log('Note: Make sure the backend server is running on port 5000');
      setBackendError(true);
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  const loadHeroBanners = async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/home/hero-banners`, {}, 5000);
      if (!response.ok) {
        if (response.status === 0 || response.status >= 500 || response.status === 404) {
          // 404 is OK - route might not exist or table doesn't exist
          if (response.status !== 404) {
            setBackendError(true);
          }
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setHeroBanners(data.data || []);
        setBackendError(false);
      } else {
        setHeroBanners([]);
      }
    } catch (error) {
      console.error('Error loading hero banners:', error.message);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('timeout')) {
        setBackendError(true);
      }
      setHeroBanners([]); // Set empty array on error so UI still renders
    }
  };

  const loadHeroStats = async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/home/hero-stats`, {}, 5000);
      const data = await response.json();
      if (data.success) setHeroStats(data.data || []);
    } catch (error) {
      console.error('Error loading hero stats:', error.message);
      setHeroStats([]);
    }
  };

  const loadProblemStats = async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/home/problem-stats`, {}, 5000);
      const data = await response.json();
      if (data.success) setProblemStats(data.data || []);
    } catch (error) {
      console.error('Error loading problem stats:', error.message);
      setProblemStats([]);
    }
  };

  const loadSolutionCards = async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/home/solution-cards`, {}, 5000);
      const data = await response.json();
      if (data.success) setSolutionCards(data.data || []);
    } catch (error) {
      console.error('Error loading solution cards:', error.message);
      setSolutionCards([]);
    }
  };

  const loadImpactStats = async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/home/impact-stats`, {}, 5000);
      const data = await response.json();
      if (data.success) setImpactStats(data.data || []);
    } catch (error) {
      console.error('Error loading impact stats:', error.message);
      setImpactStats([]);
    }
  };

  const loadPartners = async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/home/partners`, {}, 5000);
      const data = await response.json();
      if (data.success) setPartners(data.data || []);
    } catch (error) {
      console.error('Error loading partners:', error.message);
      setPartners([]);
    }
  };

  const handleEdit = (item, type, sectionName = null) => {
    setEditing({ type, item, sectionName });
    setFormData({ ...item });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      const { type, item, sectionName } = editing;
      let response;
      
      if (type === 'section') {
        // Handle section save
        const sectionData = {
          section_name: sectionName,
          title: formData.title,
          subtitle: formData.subtitle,
          content: formData.content,
          id: item?.id
        };
        
        if (item && item.id) {
          response = await updateItem('sections', item.id, sectionData);
        } else {
          response = await createItem('sections', sectionData);
        }
      } else if (item && item.id) {
        response = await updateItem(type, item.id, formData);
      } else {
        response = await createItem(type, formData);
      }
      
      if (response.success) {
        showSuccess('Content saved successfully!');
        setEditing(null);
        setFormData({});
        loadData();
      } else {
        showError(response.error || 'Failed to save');
      }
    } catch (error) {
      showError(error.message || 'Failed to save');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/home/${type}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        showSuccess('Item deleted successfully!');
        loadData();
      } else {
        showError(data.error || 'Failed to delete');
      }
    } catch (error) {
      showError('Failed to delete');
    }
  };

  const handleAdd = (type, sectionName = null) => {
    const defaults = {
      'section': { section_name: sectionName, title: '', subtitle: '', content: '' },
      'hero-banners': { alt_text: '', order_index: 0 },
      'hero-stats': { number: '', label: '', order_index: 0 },
      'problem-stats': { number: '', label: '', icon: '', order_index: 0 },
      'solution-cards': { title: '', description: '', icon: '', features: [], order_index: 0 },
      'impact-stats': { number: '', label: '', description: '', order_index: 0 },
      'partners': { name: '', website: '', alt_text: '', order_index: 0 },
    };
    
    if (type === 'section') {
      setEditing({ type: 'section', item: null, sectionName });
      setFormData(defaults.section);
    } else {
      setEditing({ type, item: null, sectionName: null });
      setFormData(defaults[type] || {});
    }
  };

  const createItem = async (type, data) => {
    const formDataToSend = new FormData();
    
    let fileField = null;
    if (type === 'hero-banners' || type === 'partners' || type === 'sections') {
      fileField = type === 'hero-banners' ? 'image' : (type === 'partners' ? 'logo' : 'image');
    }
    
    Object.keys(data).forEach(key => {
      if (key !== 'image' && key !== 'logo' && key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'image_url' && key !== 'logo_url') {
        if (Array.isArray(data[key])) {
          formDataToSend.append(key, JSON.stringify(data[key]));
        } else {
          formDataToSend.append(key, data[key] || '');
        }
      }
    });
    
    if (data[fileField] instanceof File) {
      formDataToSend.append(fileField, data[fileField]);
    }
    
    const response = await fetch(`${API_BASE}/home/${type}`, {
      method: 'POST',
      body: formDataToSend,
    });
    
    return await response.json();
  };

  const updateItem = async (type, id, data) => {
    const formDataToSend = new FormData();
    
    let fileField = null;
    if (type === 'hero-banners' || type === 'partners' || type === 'sections') {
      fileField = type === 'hero-banners' ? 'image' : (type === 'partners' ? 'logo' : 'image');
    }
    
    Object.keys(data).forEach(key => {
      if (key !== fileField && key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'image_url' && key !== 'logo_url') {
        if (Array.isArray(data[key])) {
          formDataToSend.append(key, JSON.stringify(data[key]));
        } else {
          formDataToSend.append(key, data[key] || '');
        }
      }
    });
    
    if (data[fileField] instanceof File) {
      formDataToSend.append(fileField, data[fileField]);
    }
    
    const endpoint = type === 'sections' && id 
      ? `${API_BASE}/home/${type}/${id}`
      : `${API_BASE}/home/${type}/${id}`;
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      body: formDataToSend,
    });
    
    return await response.json();
  };

  const renderContentList = () => {
    return (
      <div className="admin-home-content">
        <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '400', color: '#333' }}>
          Homepage Content Management
        </h1>
        
        {loading && (
          <div className="admin-loading" style={{ marginBottom: '20px', padding: '10px' }}>
            <p>Loading content from server...</p>
            <small>This may take a moment if the database is connecting</small>
          </div>
        )}
        
        {backendError && !loading && (
          <div className="admin-alert">
            <strong>⚠️ Backend Connection Issue</strong>
            <p>Could not connect to the backend server. Please ensure it's running:</p>
            <p><code>cd backend && npm start</code></p>
            <p>You can still view the content structure below.</p>
          </div>
        )}
        
        {/* Hero Section */}
        <div className="content-group">
          <h2 className="content-group-title">Hero Section</h2>
          <div className="content-items">
            <div className="content-item">
              <div className="content-item-info">
                <strong>Hero Section Content</strong>
                <span>{heroSection?.title || 'Click Change to set title and subtitle'}</span>
              </div>
              <button className="btn-edit" onClick={() => handleEdit(heroSection || {}, 'section', 'hero')}>
                {heroSection ? 'Change' : 'Add'}
              </button>
            </div>
            
            {heroBanners.length > 0 ? (
              heroBanners.map(banner => (
                <div key={banner.id} className="content-item">
                  <div className="content-item-info">
                    <strong>Hero Banner #{banner.id}</strong>
                    {banner.image_url && <img src={banner.image_url} alt={banner.alt_text} className="content-thumb" />}
                    <span>{banner.alt_text || 'No alt text'}</span>
                  </div>
                  <div className="content-item-actions">
                    <button className="btn-edit" onClick={() => handleEdit(banner, 'hero-banners')}>Change</button>
                    <button className="btn-delete" onClick={() => handleDelete('hero-banners', banner.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="content-empty">No hero banners yet. Click "+ Add Hero Banner" to create one.</div>
            )}
            <button className="btn-add-small" onClick={() => handleAdd('hero-banners')}>+ Add Hero Banner</button>
            
            {heroStats.length > 0 ? (
              heroStats.map(stat => (
                <div key={stat.id} className="content-item">
                  <div className="content-item-info">
                    <strong>{stat.number} - {stat.label}</strong>
                  </div>
                  <div className="content-item-actions">
                    <button className="btn-edit" onClick={() => handleEdit(stat, 'hero-stats')}>Change</button>
                    <button className="btn-delete" onClick={() => handleDelete('hero-stats', stat.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="content-empty">No hero stats yet. Click "+ Add Hero Stat" to create one.</div>
            )}
            <button className="btn-add-small" onClick={() => handleAdd('hero-stats')}>+ Add Hero Stat</button>
          </div>
        </div>

        {/* Problem Section */}
        <div className="content-group">
          <h2 className="content-group-title">Problem Section</h2>
          <div className="content-items">
            <div className="content-item">
              <div className="content-item-info">
                <strong>Problem Section Content</strong>
                <span>{problemSection?.title || 'Click Change to set title and subtitle'}</span>
              </div>
              <button className="btn-edit" onClick={() => handleEdit(problemSection || {}, 'section', 'problem')}>
                {problemSection ? 'Change' : 'Add'}
              </button>
            </div>
            
            {problemStats.length > 0 ? (
              problemStats.map(stat => (
                <div key={stat.id} className="content-item">
                  <div className="content-item-info">
                    <strong>{stat.number} - {stat.label}</strong>
                    {stat.icon && <span className="content-meta">Icon: {stat.icon}</span>}
                  </div>
                  <div className="content-item-actions">
                    <button className="btn-edit" onClick={() => handleEdit(stat, 'problem-stats')}>Change</button>
                    <button className="btn-delete" onClick={() => handleDelete('problem-stats', stat.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="content-empty">No problem stats yet. Click "+ Add Problem Stat" to create one.</div>
            )}
            <button className="btn-add-small" onClick={() => handleAdd('problem-stats')}>+ Add Problem Stat</button>
          </div>
        </div>

        {/* Solution Section */}
        <div className="content-group">
          <h2 className="content-group-title">Solution Section</h2>
          <div className="content-items">
            <div className="content-item">
              <div className="content-item-info">
                <strong>Solution Section Content</strong>
                <span>{solutionSection?.title || 'Click Change to set title and subtitle'}</span>
              </div>
              <button className="btn-edit" onClick={() => handleEdit(solutionSection || {}, 'section', 'solution')}>
                {solutionSection ? 'Change' : 'Add'}
              </button>
            </div>
            
            {solutionCards.length > 0 ? (
              solutionCards.map(card => (
                <div key={card.id} className="content-item">
                  <div className="content-item-info">
                    <strong>{card.title}</strong>
                    <span>{card.description?.substring(0, 80) || 'No description'}...</span>
                    {card.icon && <span className="content-meta">Icon: {card.icon}</span>}
                  </div>
                  <div className="content-item-actions">
                    <button className="btn-edit" onClick={() => handleEdit(card, 'solution-cards')}>Change</button>
                    <button className="btn-delete" onClick={() => handleDelete('solution-cards', card.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="content-empty">No solution cards yet. Click "+ Add Solution Card" to create one.</div>
            )}
            <button className="btn-add-small" onClick={() => handleAdd('solution-cards')}>+ Add Solution Card</button>
          </div>
        </div>

        {/* Impact Section */}
        <div className="content-group">
          <h2 className="content-group-title">Impact Section</h2>
          <div className="content-items">
            <div className="content-item">
              <div className="content-item-info">
                <strong>Impact Section Content</strong>
                <span>{impactSection?.title || 'Click Change to set title and subtitle'}</span>
              </div>
              <button className="btn-edit" onClick={() => handleEdit(impactSection || {}, 'section', 'impact')}>
                {impactSection ? 'Change' : 'Add'}
              </button>
            </div>
            
            {impactStats.length > 0 ? (
              impactStats.map(stat => (
                <div key={stat.id} className="content-item">
                  <div className="content-item-info">
                    <strong>{stat.number} - {stat.label}</strong>
                    <span>{stat.description || 'No description'}</span>
                  </div>
                  <div className="content-item-actions">
                    <button className="btn-edit" onClick={() => handleEdit(stat, 'impact-stats')}>Change</button>
                    <button className="btn-delete" onClick={() => handleDelete('impact-stats', stat.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="content-empty">No impact stats yet. Click "+ Add Impact Stat" to create one.</div>
            )}
            <button className="btn-add-small" onClick={() => handleAdd('impact-stats')}>+ Add Impact Stat</button>
          </div>
        </div>

        {/* Partners Section */}
        <div className="content-group">
          <h2 className="content-group-title">Partners Section</h2>
          <div className="content-items">
            {partners.length > 0 ? (
              partners.map(partner => (
                <div key={partner.id} className="content-item">
                  <div className="content-item-info">
                    <strong>{partner.name}</strong>
                    {partner.logo_url && <img src={partner.logo_url} alt={partner.alt_text} className="content-thumb" />}
                    {partner.website && <span className="content-meta">{partner.website}</span>}
                  </div>
                  <div className="content-item-actions">
                    <button className="btn-edit" onClick={() => handleEdit(partner, 'partners')}>Change</button>
                    <button className="btn-delete" onClick={() => handleDelete('partners', partner.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="content-empty">No partners yet. Click "+ Add Partner" to create one.</div>
            )}
            <button className="btn-add-small" onClick={() => handleAdd('partners')}>+ Add Partner</button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditForm = () => {
    const { type, sectionName } = editing;
    
    let fields = [];
    
    if (type === 'section') {
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
        { name: 'content', label: 'Content', type: 'textarea' },
        { name: 'image', label: 'Image', type: 'file' },
      ];
    } else if (type === 'hero-banners') {
      fields = [
        { name: 'image', label: 'Image', type: 'file', required: !editing.item?.id },
        { name: 'alt_text', label: 'Alt Text', type: 'text' },
        { name: 'order_index', label: 'Order', type: 'number' },
      ];
    } else if (type === 'hero-stats' || type === 'impact-stats') {
      fields = [
        { name: 'number', label: 'Number', type: 'text', required: true },
        { name: 'label', label: 'Label', type: 'text', required: true },
        ...(type === 'impact-stats' ? [{ name: 'description', label: 'Description', type: 'textarea' }] : []),
        { name: 'order_index', label: 'Order', type: 'number' },
      ];
    } else if (type === 'problem-stats') {
      fields = [
        { name: 'number', label: 'Number', type: 'text', required: true },
        { name: 'label', label: 'Label', type: 'text', required: true },
        { name: 'icon', label: 'Icon', type: 'text' },
        { name: 'order_index', label: 'Order', type: 'number' },
      ];
    } else if (type === 'solution-cards') {
      fields = [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'icon', label: 'Icon', type: 'text' },
        { name: 'features', label: 'Features (one per line)', type: 'textarea' },
        { name: 'order_index', label: 'Order', type: 'number' },
      ];
    } else if (type === 'partners') {
      fields = [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'website', label: 'Website', type: 'url' },
        { name: 'alt_text', label: 'Alt Text', type: 'text' },
        { name: 'logo', label: 'Logo', type: 'file' },
        { name: 'order_index', label: 'Order', type: 'number' },
      ];
    }

    return (
      <div className="admin-edit-form">
        <div className="admin-edit-header">
          <h2>
            {editing.item?.id ? 'Change' : 'Add'} {type === 'section' ? `${sectionName} Section` : type.replace('-', ' ')}
          </h2>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {fields.map(field => (
            <div key={field.name} className="form-field">
              <label>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              {field.type === 'textarea' ? (
                field.name === 'features' ? (
                  <textarea
                    value={Array.isArray(formData[field.name]) ? formData[field.name].join('\n') : (formData[field.name] || '')}
                    onChange={(e) => {
                      const value = e.target.value.split('\n').filter(line => line.trim());
                      setFormData({ ...formData, [field.name]: value });
                    }}
                    rows={6}
                    required={field.required}
                  />
                ) : (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    rows={4}
                    required={field.required}
                  />
                )
              ) : field.type === 'file' ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.files[0] })}
                    required={field.required && !editing.item?.id}
                  />
                  {formData[field.name === 'image' ? 'image_url' : 'logo_url'] && (
                    <img src={formData[field.name === 'image' ? 'image_url' : 'logo_url']} alt="Preview" className="form-preview" />
                  )}
                </div>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                />
              )}
            </div>
          ))}
          
          <div className="form-actions">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="admin-home">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      {editing ? renderEditForm() : renderContentList()}
    </div>
  );
};

export default Admin_Home;
