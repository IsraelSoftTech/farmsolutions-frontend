import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.replace('/admin', '').replace('/', '') || 'home';

  useEffect(() => {
    // Redirect /admin to /admin/home
    if (location.pathname === '/admin') {
      navigate('/admin/home', { replace: true });
    }
  }, [location.pathname, navigate]);

  const sections = [
    { id: 'home', name: 'Home', path: '/admin/home' },
    // { id: 'about', name: 'About', path: '/admin/about' },
    // { id: 'products', name: 'Products', path: '/admin/products' },
    // { id: 'impact', name: 'Impact', path: '/admin/impact' },
    // { id: 'knowledge', name: 'Knowledge', path: '/admin/knowledge' },
    // { id: 'pricing', name: 'Pricing', path: '/admin/pricing' },
    // { id: 'contact', name: 'Contact', path: '/admin/contact' },
  ];

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1>Site Administration</h1>
      </div>
      
      <div className="admin-container">
        <div className="admin-sidebar">
          <h2>Content Sections</h2>
          <nav className="admin-nav">
            {sections.map(section => (
              <Link
                key={section.id}
                to={section.path}
                className={`admin-nav-link ${currentPath === section.id ? 'active' : ''}`}
              >
                {section.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
