import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaBook, FaSun, FaSeedling, FaChartBar, FaTools, FaBookOpen } from 'react-icons/fa';
import adminService from '../services/adminService';
import EditableSection from '../components/EditableSection';
import EditableField from '../components/EditableField';
import './Admin_Knowledge.css';
import '../pages/KnowledgePage.css';

const iconMap = {
  'FaBook': FaBook,
  'FaSun': FaSun,
  'FaSeedling': FaSeedling,
  'FaChartBar': FaChartBar,
  'FaTools': FaTools,
  'FaBookOpen': FaBookOpen
};

const Admin_Knowledge = () => {
  const [resources, setResources] = useState([
    { title: 'Post-Harvest Loss Prevention Guide', description: 'Comprehensive guide on reducing post-harvest losses in agricultural operations.', type: 'Guide', icon: 'FaBook' },
    { title: 'Solar Storage Best Practices', description: 'Learn how to maximize the efficiency of your solar storage system.', type: 'Article', icon: 'FaSun' },
    { title: 'Crop-Specific Storage Tips', description: 'Tailored storage recommendations for different crop types.', type: 'Resource', icon: 'FaSeedling' },
    { title: 'Market Timing Strategies', description: 'When to sell your produce for maximum profit.', type: 'Guide', icon: 'FaChartBar' },
    { title: 'Maintenance & Care', description: 'Keep your storage systems running at peak performance.', type: 'Article', icon: 'FaTools' },
    { title: 'Success Stories Collection', description: 'Real stories from farmers who have transformed their operations.', type: 'Case Study', icon: 'FaBookOpen' }
  ]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('Knowledge Hub');
  const [pageSubtitle, setPageSubtitle] = useState('Educational resources and farming guides to help you succeed');
  const [newsletterTitle, setNewsletterTitle] = useState('Stay Updated');
  const [newsletterText, setNewsletterText] = useState('Subscribe to our newsletter for the latest farming tips and updates');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await adminService.getKnowledge();
      if (response.ok && response.data.data) {
        setResources(response.data.data);
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateResource = (index, field, value) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  };

  const handleSaveResource = async (resource, index) => {
    try {
      const resourceData = {
        title: resource.title,
        description: resource.description,
        type: resource.type,
        icon: resource.icon,
        order_index: index
      };
      if (resource.id) {
        await adminService.updateResource(resource.id, resourceData);
      } else {
        await adminService.saveResource(resourceData);
      }
      await loadResources();
      alert('Resource saved!');
    } catch (error) {
      alert('Error saving resource');
    }
  };

  const handleAddResource = () => {
    setResources([...resources, { title: '', description: '', type: '', icon: 'FaBook' }]);
  };

  const handleDeleteResource = async (resourceId, index) => {
    if (window.confirm('Delete this resource?')) {
      if (resourceId) {
        try {
          await adminService.deleteResource(resourceId);
          await loadResources();
        } catch (error) {
          alert('Error deleting resource');
        }
      } else {
        const updated = resources.filter((_, i) => i !== index);
        setResources(updated);
      }
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="knowledge-page">
      {/* Page Hero - EXACT COPY */}
      <section className="page-hero">
        <div className="container">
          <EditableSection sectionId="knowledge-hero">
            <h1 className="page-title">
              <EditableField value={pageTitle} onChange={setPageTitle} tag="span" />
            </h1>
            <p className="page-subtitle">
              <EditableField value={pageSubtitle} onChange={setPageSubtitle} multiline={true} tag="span" />
            </p>
          </EditableSection>
        </div>
      </section>

      {/* Resources Section - EXACT COPY */}
      <section className="resources-section">
        <div className="container">
          <div className="resources-grid">
            {resources.map((resource, index) => (
              <EditableSection
                key={resource.id || index}
                onSave={() => handleSaveResource(resource, index)}
                sectionId={`resource-${resource.id || index}`}
                className="resource-card"
              >
                <div className="resource-icon">
                  {iconMap[resource.icon] ? React.createElement(iconMap[resource.icon]) : <FaBook />}
                </div>
                <span className="resource-type">
                  <EditableField
                    value={resource.type}
                    onChange={(value) => updateResource(index, 'type', value)}
                    tag="span"
                  />
                </span>
                <h3>
                  <EditableField
                    value={resource.title}
                    onChange={(value) => updateResource(index, 'title', value)}
                    tag="span"
                  />
                </h3>
                <p>
                  <EditableField
                    value={resource.description}
                    onChange={(value) => updateResource(index, 'description', value)}
                    multiline={true}
                    tag="span"
                  />
                </p>
                <button className="btn-resource">Read More</button>
                {resource.id && (
                  <button 
                    onClick={() => handleDeleteResource(resource.id, index)} 
                    className="admin-delete-btn"
                    style={{ marginTop: '1rem', width: '100%' }}
                  >
                    <FaTrash /> Delete
                  </button>
                )}
              </EditableSection>
            ))}
          </div>
          <button onClick={handleAddResource} className="admin-add-btn">
            <FaPlus /> Add Resource
          </button>
        </div>
      </section>

      {/* Newsletter Section - EXACT COPY */}
      <section className="newsletter-section">
        <div className="container">
          <EditableSection sectionId="knowledge-newsletter">
            <div className="newsletter-box">
              <h2>
                <EditableField value={newsletterTitle} onChange={setNewsletterTitle} tag="span" />
              </h2>
              <p>
                <EditableField value={newsletterText} onChange={setNewsletterText} multiline={true} tag="span" />
              </p>
              <form className="newsletter-form">
                <input type="email" placeholder="Your email address" required />
                <button type="submit" className="btn-primary">Subscribe</button>
              </form>
            </div>
          </EditableSection>
        </div>
      </section>
    </div>
  );
};

export default Admin_Knowledge;
