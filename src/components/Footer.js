import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useLogo } from '../hooks/useLogo';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { logoUrl } = useLogo();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              {logoUrl && <img src={logoUrl} alt="Farmers Solutions Logo" className="footer-logo-img" />}
              <span>About Farmers Solutions</span>
            </h3>
            <p>
              Leading the way in sustainable agricultural preservation technology, 
              helping farmers reduce waste and increase profits through innovative 
              hybrid-powered solutions.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/share/1FC9khcBtB/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://www.linkedin.com/company/farm-solutionss/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/products">Our Products</Link></li>
              <li><Link to="/how-it-works">Know More</Link></li>
              <li><Link to="/impact">Success Stories</Link></li>
              <li><Link to="/knowledge">Knowledge</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>
                <FaEnvelope className="contact-icon" />
                <a href="mailto:farms.solution247@gmail.com">farms.solution247@gmail.com</a>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>+237 651 412 772</span>
              </li>
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>Buea</span>
              </li>
              <li>
                <FaLinkedin className="contact-icon" />
                <a href="https://www.linkedin.com/company/farm-solutionss/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Newsletter</h3>
            <p>Subscribe for updates on agricultural technology and farming tips.</p>
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
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Farmers Solutions. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
