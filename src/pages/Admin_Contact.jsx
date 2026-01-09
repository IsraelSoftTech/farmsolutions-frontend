import React, { useState, useEffect } from 'react';
import { FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import adminService from '../services/adminService';
import EditableSection from '../components/EditableSection';
import EditableField from '../components/EditableField';
import './Admin_Contact.css';
import '../pages/ContactPage.css';

const iconMap = {
  'FaEnvelope': FaEnvelope,
  'FaPhone': FaPhone,
  'FaMapMarkerAlt': FaMapMarkerAlt
};

const Admin_Contact = () => {
  const [contactInfo, setContactInfo] = useState([
    { type: 'email', label: 'Email', value: 'info@farmerssolution.com', icon: 'FaEnvelope' },
    { type: 'phone', label: 'Phone', value: '+237 651 412 772', icon: 'FaPhone' },
    { type: 'location', label: 'Location', value: 'Buea', icon: 'FaMapMarkerAlt' }
  ]);
  const [businessHours, setBusinessHours] = useState([
    { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('Contact Us');
  const [pageSubtitle, setPageSubtitle] = useState('Get in touch with our team for consultations, quotes, and support');
  const [sectionTitle, setSectionTitle] = useState('Get in Touch');
  const [sectionText, setSectionText] = useState('Have questions about our products or services? We\'re here to help! Reach out to us through any of the channels below.');
  const [hoursTitle, setHoursTitle] = useState('Business Hours');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await adminService.getContact();
      if (response.ok && response.data.data) {
        setContactInfo(response.data.data.info || contactInfo);
        setBusinessHours(response.data.data.hours || businessHours);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactInfo = (index, field, value) => {
    const updated = [...contactInfo];
    updated[index] = { ...updated[index], [field]: value };
    setContactInfo(updated);
  };

  const updateBusinessHours = (index, field, value) => {
    const updated = [...businessHours];
    updated[index] = { ...updated[index], [field]: value };
    setBusinessHours(updated);
  };

  const handleSaveContactInfo = async (info) => {
    try {
      await adminService.saveContactInfo({
        type: info.type,
        label: info.label,
        value: info.value,
        icon: info.icon,
        order_index: 0
      });
      await loadContent();
      alert('Contact info saved!');
    } catch (error) {
      alert('Error saving contact info');
    }
  };

  const handleSaveBusinessHours = async (hours, index) => {
    try {
      const hoursData = {
        day: hours.day,
        hours: hours.hours,
        order_index: index
      };
      if (hours.id) {
        await adminService.updateBusinessHours(hours.id, hoursData);
      } else {
        await adminService.saveBusinessHours(hoursData);
      }
      await loadContent();
      alert('Business hours saved!');
    } catch (error) {
      alert('Error saving business hours');
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="contact-page">
      {/* Page Hero - EXACT COPY */}
      <section className="page-hero">
        <div className="container">
          <EditableSection sectionId="contact-hero">
            <h1 className="page-title">
              <EditableField value={pageTitle} onChange={setPageTitle} tag="span" />
            </h1>
            <p className="page-subtitle">
              <EditableField value={pageSubtitle} onChange={setPageSubtitle} multiline={true} tag="span" />
            </p>
          </EditableSection>
        </div>
      </section>

      {/* Contact Section - EXACT COPY */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <EditableSection sectionId="contact-info-section">
                <h2>
                  <EditableField value={sectionTitle} onChange={setSectionTitle} tag="span" />
                </h2>
                <p>
                  <EditableField value={sectionText} onChange={setSectionText} multiline={true} tag="span" />
                </p>

                <div className="contact-details">
                  {contactInfo.map((info, index) => (
                    <EditableSection
                      key={info.id || index}
                      onSave={() => handleSaveContactInfo(info)}
                      sectionId={`contact-info-${info.id || index}`}
                      className="contact-item"
                    >
                      <div className="contact-icon">
                        {iconMap[info.icon] ? React.createElement(iconMap[info.icon]) : <FaEnvelope />}
                      </div>
                      <div>
                        <h4>
                          <EditableField
                            value={info.label}
                            onChange={(value) => updateContactInfo(index, 'label', value)}
                            tag="span"
                          />
                        </h4>
                        <p>
                          <EditableField
                            value={info.value}
                            onChange={(value) => updateContactInfo(index, 'value', value)}
                            tag="span"
                          />
                        </p>
                      </div>
                    </EditableSection>
                  ))}
                </div>

                <div className="business-hours">
                  <h4>
                    <EditableField value={hoursTitle} onChange={setHoursTitle} tag="span" />
                  </h4>
                  {businessHours.map((hours, index) => (
                    <EditableSection
                      key={hours.id || index}
                      onSave={() => handleSaveBusinessHours(hours, index)}
                      sectionId={`hours-${hours.id || index}`}
                    >
                      <p>
                        <EditableField
                          value={hours.day}
                          onChange={(value) => updateBusinessHours(index, 'day', value)}
                          tag="span"
                        />
                        :{' '}
                        <EditableField
                          value={hours.hours}
                          onChange={(value) => updateBusinessHours(index, 'hours', value)}
                          tag="span"
                        />
                      </p>
                    </EditableSection>
                  ))}
                </div>
              </EditableSection>
            </div>

            <div className="contact-form-container">
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" />
                </div>
                <div className="form-group">
                  <label htmlFor="interest">I'm interested in</label>
                  <select id="interest" name="interest">
                    <option value="">Select an option</option>
                    <option value="solar-storage">Solar Storage Systems</option>
                    <option value="smart-packaging">Smart Packaging</option>
                    <option value="consultation">Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin_Contact;
