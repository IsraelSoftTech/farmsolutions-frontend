import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import adminService from '../services/adminService';
import EditableSection from './EditableSection';
import EditableField from './EditableField';
import logo from '../assets/logo.png';
import './AdminFooter.css';
import './Footer.css';

const AdminFooter = () => {
  const [email, setEmail] = useState('');
  const [footerContent, setFooterContent] = useState({
    aboutTitle: 'About Farmers Solutions',
    aboutText: 'Leading the way in sustainable agricultural preservation technology, helping farmers reduce waste and increase profits through innovative solar-powered solutions.',
    newsletterText: 'Subscribe for updates on agricultural technology and farming tips.',
    copyright: '© 2026 Farmers Solutions. All rights reserved.'
  });
  const [contactInfo, setContactInfo] = useState([
    { type: 'email', label: 'Email', value: 'info@farmerssolution.com', icon: 'FaEnvelope' },
    { type: 'phone', label: 'Phone', value: '+234 800 000 0000', icon: 'FaPhone' },
    { type: 'location', label: 'Location', value: 'Nigeria, West Africa', icon: 'FaMapMarkerAlt' }
  ]);
  const [socialLinks, setSocialLinks] = useState([
    { platform: 'Facebook', url: '#', icon: 'FaFacebook' },
    { platform: 'Twitter', url: '#', icon: 'FaTwitter' },
    { platform: 'LinkedIn', url: '#', icon: 'FaLinkedin' },
    { platform: 'Instagram', url: '#', icon: 'FaInstagram' }
  ]);

  useEffect(() => {
    loadFooterContent();
  }, []);

  const loadFooterContent = async () => {
    try {
      const response = await adminService.getContact();
      if (response.ok && response.data.data) {
        setContactInfo(response.data.data.info || contactInfo);
      }
    } catch (error) {
      console.error('Error loading footer content:', error);
    }
  };

  const updateFooterContent = (field, value) => {
    setFooterContent({ ...footerContent, [field]: value });
  };

  const updateContactInfo = (index, field, value) => {
    const updated = [...contactInfo];
    updated[index] = { ...updated[index], [field]: value };
    setContactInfo(updated);
  };

  const updateSocialLink = (index, field, value) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
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
      await loadFooterContent();
      alert('Contact info saved!');
    } catch (error) {
      alert('Error saving contact info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  const iconMap = {
    FaEnvelope, FaPhone, FaMapMarkerAlt,
    FaFacebook, FaTwitter, FaLinkedin, FaInstagram
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section - EXACT COPY */}
          <div className="footer-section">
            <EditableSection sectionId="footer-about">
              <h3>
                <img src={logo} alt="Farmers Solutions Logo" className="footer-logo-img" />
                <span>
                  <EditableField
                    value={footerContent.aboutTitle}
                    onChange={(value) => updateFooterContent('aboutTitle', value)}
                    tag="span"
                  />
                </span>
              </h3>
              <p>
                <EditableField
                  value={footerContent.aboutText}
                  onChange={(value) => updateFooterContent('aboutText', value)}
                  multiline={true}
                  tag="span"
                />
              </p>
              <div className="social-links">
                {socialLinks.map((social, index) => {
                  const IconComponent = iconMap[social.icon];
                  return (
                    <EditableSection
                      key={index}
                      sectionId={`social-${index}`}
                    >
                      <a href={social.url} aria-label={social.platform}>
                        <IconComponent />
                      </a>
                    </EditableSection>
                  );
                })}
              </div>
            </EditableSection>
          </div>

          {/* Quick Links - EXACT COPY */}
          <div className="footer-section">
            <EditableSection sectionId="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/products">Our Products</Link></li>
                <li><Link to="/how-it-works">Know More</Link></li>
                <li><Link to="/impact">Success Stories</Link></li>
                <li><Link to="/knowledge">Knowledge</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
              </ul>
            </EditableSection>
          </div>

          {/* Contact Us - EXACT COPY */}
          <div className="footer-section">
            <EditableSection sectionId="footer-contact">
              <h3>Contact Us</h3>
              <ul className="contact-info">
                {contactInfo.map((info, index) => {
                  const IconComponent = iconMap[info.icon];
                  return (
                    <EditableSection
                      key={info.id || index}
                      onSave={() => handleSaveContactInfo(info)}
                      sectionId={`footer-contact-${info.id || index}`}
                    >
                      <li>
                        <IconComponent className="contact-icon" />
                        <span>
                          <EditableField
                            value={info.value}
                            onChange={(value) => updateContactInfo(index, 'value', value)}
                            tag="span"
                          />
                        </span>
                      </li>
                    </EditableSection>
                  );
                })}
              </ul>
            </EditableSection>
          </div>

          {/* Newsletter - EXACT COPY */}
          <div className="footer-section">
            <EditableSection sectionId="footer-newsletter">
              <h3>Newsletter</h3>
              <p>
                <EditableField
                  value={footerContent.newsletterText}
                  onChange={(value) => updateFooterContent('newsletterText', value)}
                  multiline={true}
                  tag="span"
                />
              </p>
              <form onSubmit={handleSubmit} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-subscribe">
                  Subscribe
                </button>
              </form>
            </EditableSection>
          </div>
        </div>

        {/* Footer Bottom - EXACT COPY */}
        <div className="footer-bottom">
          <EditableSection sectionId="footer-bottom">
            <p>
              <EditableField
                value={footerContent.copyright}
                onChange={(value) => updateFooterContent('copyright', value)}
                tag="span"
              />
            </p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </EditableSection>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
