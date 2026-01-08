import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaUser, FaUserTie, FaUsers, FaUserCircle } from 'react-icons/fa';
import adminService from '../services/adminService';
import EditableSection from '../components/EditableSection';
import EditableField from '../components/EditableField';
import './Admin_Impact.css';
import '../pages/ImpactPage.css';

const iconMap = {
  'FaUser': FaUser,
  'FaUserTie': FaUserTie,
  'FaUsers': FaUsers,
  'FaUserCircle': FaUserCircle
};

const Admin_Impact = () => {
  const [stats, setStats] = useState([
    { number: '10,000+', label: 'Farmers Helped' },
    { number: '85%', label: 'Average Loss Reduction' },
    { number: '$2.5M', label: 'Income Generated' },
    { number: '50,000+', label: 'Tons Saved' }
  ]);
  const [testimonials, setTestimonials] = useState([
    { name: 'John Mwangi', location: 'Kenya', role: 'Smallholder Farmer', icon: 'FaUser', text: 'The Spethacs Room A transformed my tomato farming. I used to lose 40% of my harvest, now I lose less than 10%. My income has doubled!', rating: 5 },
    { name: 'Amina Yusuf', location: 'Nigeria', role: 'Vegetable Farmer', icon: 'FaUserTie', text: 'Easy to install and maintain. My vegetables stay fresh for weeks, allowing me to sell at better prices. Best investment I\'ve made.', rating: 5 },
    { name: 'Rwanda Farmers Union', location: 'Rwanda', role: 'Agricultural Cooperative', icon: 'FaUsers', text: 'Our cooperative serves 200 farmers. The Spethacs Room B has helped us collectively save over $50,000 in lost produce. Game changer!', rating: 5 },
    { name: 'Grace Okonkwo', location: 'Nigeria', role: 'Market Vendor', icon: 'FaUserCircle', text: 'FreshGuard bags have revolutionized how I store and transport my vegetables. Customers love the freshness and I waste less.', rating: 5 }
  ]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('Our Impact');
  const [pageSubtitle, setPageSubtitle] = useState('Real stories from farmers whose lives have been transformed by our solutions');
  const [sectionTitle, setSectionTitle] = useState('Success Stories');
  const [ctaTitle, setCtaTitle] = useState('Join Our Success Stories');
  const [ctaText, setCtaText] = useState('Start your journey to reduced losses and increased income today');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await adminService.getImpact();
      if (response.ok && response.data.data) {
        setStats(response.data.data.stats || stats);
        setTestimonials(response.data.data.testimonials || testimonials);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStat = (index, field, value) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    setStats(updated);
  };

  const updateTestimonial = (index, field, value) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  const handleSaveStat = async (stat, index) => {
    try {
      await adminService.saveStat({
        number: stat.number,
        label: stat.label,
        order_index: index
      });
      await loadContent();
      alert('Stat saved!');
    } catch (error) {
      alert('Error saving stat');
    }
  };

  const handleSaveTestimonial = async (testimonial, index) => {
    try {
      const testimonialData = {
        name: testimonial.name,
        location: testimonial.location,
        role: testimonial.role,
        text: testimonial.text,
        rating: testimonial.rating || 5,
        order_index: index
      };
      if (testimonial.id) {
        await adminService.updateTestimonial(testimonial.id, testimonialData);
      } else {
        await adminService.saveTestimonial(testimonialData);
      }
      await loadContent();
      alert('Testimonial saved!');
    } catch (error) {
      alert('Error saving testimonial');
    }
  };

  const handleAddTestimonial = () => {
    setTestimonials([...testimonials, { name: '', location: '', role: '', icon: 'FaUser', text: '', rating: 5 }]);
  };

  const handleDeleteTestimonial = async (testimonialId, index) => {
    if (window.confirm('Delete this testimonial?')) {
      if (testimonialId) {
        try {
          await adminService.deleteTestimonial(testimonialId);
          await loadContent();
        } catch (error) {
          alert('Error deleting testimonial');
        }
      } else {
        const updated = testimonials.filter((_, i) => i !== index);
        setTestimonials(updated);
      }
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="impact-page">
      {/* Page Hero - EXACT COPY */}
      <section className="page-hero">
        <div className="container">
          <EditableSection sectionId="impact-hero">
            <h1 className="page-title">
              <EditableField value={pageTitle} onChange={setPageTitle} tag="span" />
            </h1>
            <p className="page-subtitle">
              <EditableField value={pageSubtitle} onChange={setPageSubtitle} multiline={true} tag="span" />
            </p>
          </EditableSection>
        </div>
      </section>

      {/* Stats Section - EXACT COPY */}
      <section className="impact-stats-section">
        <div className="container">
          <div className="impact-stats-grid">
            {stats.map((stat, index) => (
              <EditableSection
                key={stat.id || index}
                onSave={() => handleSaveStat(stat, index)}
                sectionId={`stat-${stat.id || index}`}
                className="impact-stat-card"
              >
                <div className="impact-stat-number">
                  <EditableField
                    value={stat.number}
                    onChange={(value) => updateStat(index, 'number', value)}
                    tag="span"
                  />
                </div>
                <div className="impact-stat-label">
                  <EditableField
                    value={stat.label}
                    onChange={(value) => updateStat(index, 'label', value)}
                    tag="span"
                  />
                </div>
              </EditableSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - EXACT COPY */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">
            <EditableField value={sectionTitle} onChange={setSectionTitle} tag="span" />
          </h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <EditableSection
                key={testimonial.id || index}
                onSave={() => handleSaveTestimonial(testimonial, index)}
                sectionId={`testimonial-${testimonial.id || index}`}
                className="testimonial-card-large"
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {iconMap[testimonial.icon] ? React.createElement(iconMap[testimonial.icon]) : <FaUser />}
                  </div>
                  <div className="testimonial-info">
                    <h4>
                      <EditableField
                        value={testimonial.name}
                        onChange={(value) => updateTestimonial(index, 'name', value)}
                        tag="span"
                      />
                    </h4>
                    <p className="testimonial-role">
                      <EditableField
                        value={testimonial.role}
                        onChange={(value) => updateTestimonial(index, 'role', value)}
                        tag="span"
                      />
                    </p>
                    <p className="testimonial-location">
                      <EditableField
                        value={testimonial.location}
                        onChange={(value) => updateTestimonial(index, 'location', value)}
                        tag="span"
                      />
                    </p>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-text-large">
                  <EditableField
                    value={testimonial.text}
                    onChange={(value) => updateTestimonial(index, 'text', value)}
                    multiline={true}
                    tag="span"
                  />
                </p>
                {testimonial.id && (
                  <button 
                    onClick={() => handleDeleteTestimonial(testimonial.id, index)} 
                    className="admin-delete-btn"
                    style={{ marginTop: '1rem' }}
                  >
                    <FaTrash /> Delete
                  </button>
                )}
              </EditableSection>
            ))}
          </div>
          <button onClick={handleAddTestimonial} className="admin-add-btn">
            <FaPlus /> Add Testimonial
          </button>
        </div>
      </section>

      {/* CTA Section - EXACT COPY */}
      <section className="cta-section">
        <div className="container">
          <EditableSection sectionId="impact-cta">
            <div className="cta-content">
              <h2>
                <EditableField value={ctaTitle} onChange={setCtaTitle} tag="span" />
              </h2>
              <p>
                <EditableField value={ctaText} onChange={setCtaText} multiline={true} tag="span" />
              </p>
              <Link to="/contact" className="btn-primary">
                Get Started
              </Link>
            </div>
          </EditableSection>
        </div>
      </section>
    </div>
  );
};

export default Admin_Impact;
