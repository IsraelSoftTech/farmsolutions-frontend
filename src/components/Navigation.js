import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useLogo } from '../hooks/useLogo';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { logoUrl } = useLogo();

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
          {logoUrl && <img src={logoUrl} alt="Farmers Solutions Logo" className="logo-img" />}
          <span>Farmers Solutions</span>
        </Link>
        
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/about" className={isActive('/about')} onClick={() => setIsMenuOpen(false)}>About</Link></li>
          <li><Link to="/products" className={isActive('/products')} onClick={() => setIsMenuOpen(false)}>Products</Link></li>
          <li><Link to="/how-it-works" className={isActive('/how-it-works')} onClick={() => setIsMenuOpen(false)}>Know More</Link></li>
          <li><Link to="/impact" className={isActive('/impact')} onClick={() => setIsMenuOpen(false)}>Impact</Link></li>
          <li><Link to="/knowledge" className={isActive('/knowledge')} onClick={() => setIsMenuOpen(false)}>Knowledge</Link></li>
          <li><Link to="/pricing" className={isActive('/pricing')} onClick={() => setIsMenuOpen(false)}>Pricing</Link></li>
          <li><Link to="/contact" className={isActive('/contact')} onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          <li><Link to="/login" className={isActive('/login')} onClick={() => setIsMenuOpen(false)}>Admin</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
