import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <FaLeaf className="logo-icon" />
          <span>Farmer's Solution</span>
        </Link>
        
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
        
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/products" className={isActive('/products')} onClick={() => setIsMenuOpen(false)}>Products</Link></li>
          <li><Link to="/how-it-works" className={isActive('/how-it-works')} onClick={() => setIsMenuOpen(false)}>How It Works</Link></li>
          <li><Link to="/impact" className={isActive('/impact')} onClick={() => setIsMenuOpen(false)}>Impact</Link></li>
          <li><Link to="/knowledge" className={isActive('/knowledge')} onClick={() => setIsMenuOpen(false)}>Knowledge Hub</Link></li>
          <li><Link to="/pricing" className={isActive('/pricing')} onClick={() => setIsMenuOpen(false)}>Pricing</Link></li>
          <li><Link to="/contact" className={isActive('/contact')} onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
        </ul>
        
        <Link to="/contact" className="cta-button" onClick={() => setIsMenuOpen(false)}>
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
