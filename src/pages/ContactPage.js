import React, { useState, useEffect } from 'react';
import * as Icons from 'react-icons/fa';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import api, { API_ENDPOINTS } from '../config/api';
import './ContactPage.css';

const ContactPage = () => {
  const [content, setContent] = useState({});
  const [contentLoading, setContentLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      setContentLoading(true);
      const response = await api.get('/contact-content');
      if (response.ok && response.data.success) {
        const contentMap = {};
        Object.keys(response.data.data).forEach(section => {
          contentMap[section] = response.data.data[section].content;
        });
        setContent(contentMap);
      }
    } catch (error) {
      console.error('Error fetching contact content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  // Helper function to get icon component
  const getIconComponent = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post(API_ENDPOINTS.contact, formData);

      if (response.ok && response.data.success) {
        setMessage({
          type: 'success',
          text: response.data.message || 'Thank you for your message! We will get back to you soon.'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          interest: ''
        });
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 5000);
      } else {
        setMessage({
          type: 'error',
          text: response.data.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (contentLoading) {
    return (
      <div className="contact-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading contact information...</p>
        </div>
      </div>
    );
  }

  const hero = content.hero || { title: 'Contact Us', subtitle: 'Get in touch with our team for consultations, quotes, and support' };
  const info = content.info || { title: 'Get in Touch', description: "Have questions about our products or services? We're here to help! Reach out to us through any of the channels below.", contactDetails: [], businessHours: { title: 'Business Hours', hours: [] } };
  const formOptions = content.form || { 
    interestOptions: [
      { value: '', label: 'Select an option' },
      { value: 'hybrid-storage', label: 'Hybrid-Powered Storage Systems' },
      { value: 'smart-packaging', label: 'Smart Packaging' },
      { value: 'consultation', label: 'Consultation' },
      { value: 'other', label: 'Other' }
    ] 
  };

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">{hero.title}</h1>
          <p className="page-subtitle">{hero.subtitle}</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>{info.title}</h2>
              <p>{info.description}</p>

              <div className="contact-details">
                {info.contactDetails.map((detail, index) => (
                  <div key={index} className="contact-item">
                    <div className="contact-icon">
                      {getIconComponent(detail.icon)}
                    </div>
                    <div>
                      <h4>{detail.label}</h4>
                      <p>{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {info.businessHours && info.businessHours.hours && info.businessHours.hours.length > 0 && (
                <div className="business-hours">
                  <h4>{info.businessHours.title}</h4>
                  {info.businessHours.hours.map((hour, index) => (
                    <p key={index}>{hour}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="contact-form-container">
              {message.text && (
                <div className={`contact-message ${message.type}`}>
                  {message.type === 'success' ? (
                    <FaCheckCircle className="message-icon" />
                  ) : (
                    <FaTimesCircle className="message-icon" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="interest">I'm interested in</label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                  >
                    {formOptions.interestOptions.map((option, index) => (
                      <option key={index} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
