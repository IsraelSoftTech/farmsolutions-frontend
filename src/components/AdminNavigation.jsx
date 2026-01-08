import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { authService } from '../services/apiService';
import logo from '../assets/logo.png';
import './AdminNavigation.css';

const AdminNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">
        <Link to="/admin" className="admin-logo">
          <img src={logo} alt="Farmers Solutions Logo" className="admin-logo-img" />
          <span>Farmers Solutions</span>
        </Link>
        
        <button className="admin-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        <ul className={`admin-nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/admin" className={isActive('/admin')} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/admin/about" className={isActive('/admin/about')} onClick={() => setIsMenuOpen(false)}>About</Link></li>
          <li><Link to="/admin/products" className={isActive('/admin/products')} onClick={() => setIsMenuOpen(false)}>Products</Link></li>
          <li><Link to="/admin/how-it-works" className={isActive('/admin/how-it-works')} onClick={() => setIsMenuOpen(false)}>Know More</Link></li>
          <li><Link to="/admin/impact" className={isActive('/admin/impact')} onClick={() => setIsMenuOpen(false)}>Impact</Link></li>
          <li><Link to="/admin/knowledge" className={isActive('/admin/knowledge')} onClick={() => setIsMenuOpen(false)}>Knowledge</Link></li>
          <li><Link to="/admin/pricing" className={isActive('/admin/pricing')} onClick={() => setIsMenuOpen(false)}>Pricing</Link></li>
          <li><Link to="/admin/contact" className={isActive('/admin/contact')} onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          <li>
            <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavigation;
