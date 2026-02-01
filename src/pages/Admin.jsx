import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaEnvelope, FaImage } from 'react-icons/fa';
import { useLogo } from '../hooks/useLogo';
import AdminHome from './AdminHome';
import AdminAbout from './AdminAbout';
import AdminMessages from './AdminMessages';
import AdminProduct from './AdminProduct';
import AdminKnowMore from './AdminKnowMore';
import AdminImpact from './AdminImpact';
import AdminKnowledge from './AdminKnowledge';
import AdminPricing from './AdminPricing';
import AdminContact from './AdminContact';
import AdminImages from './AdminImages';
import api, { API_ENDPOINTS } from '../config/api';
import './Admin.css';

const Admin = () => {
  const [activeMenu, setActiveMenu] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { logoUrl } = useLogo();

  const menuItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'products', label: 'Products', path: '/products' },
    { id: 'know-more', label: 'Know More', path: '/how-it-works' },
    { id: 'impact', label: 'Impact', path: '/impact' },
    { id: 'knowledge', label: 'Knowledge', path: '/knowledge' },
    { id: 'pricing', label: 'Pricing', path: '/pricing' },
    { id: 'contact', label: 'Contact', path: '/contact' },
    { id: 'images', label: 'Images', path: '/admin', icon: FaImage },
    { id: 'messages', label: 'Messages', path: '/admin', icon: FaEnvelope, badge: unreadCount }
  ];

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.messagesUnreadCount);
        if (response.ok && response.data.success) {
          setUnreadCount(response.data.data.count);
        }
      } catch (err) {
        console.error('Error fetching unread count:', err);
      }
    };

    fetchUnreadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-page">
      {/* Sidebar */}  
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {logoUrl && <img src={logoUrl} alt="Farmers Solutions Logo" className="sidebar-logo-img" />}
            <span className="sidebar-logo-text">Farmers Solutions</span>
          </div>
          <button 
            className="sidebar-close-btn" 
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <HiX size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`sidebar-menu-item ${activeMenu === item.id ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  {item.icon && <item.icon className="menu-icon" />}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="menu-badge">{item.badge}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <HiMenu size={24} />
          </button>
          <h1 className="admin-header-title">Admin Panel</h1>
          <button 
            className="admin-logout-btn"
            onClick={() => navigate('/')}
          >
            Back to Site
          </button>
        </header>

        {/* Content Area */}
        <main className="admin-content">
          {activeMenu === 'home' ? (
            <AdminHome />
          ) : activeMenu === 'about' ? (
            <AdminAbout />
          ) : activeMenu === 'products' ? (
            <AdminProduct />
          ) : activeMenu === 'know-more' ? (
            <AdminKnowMore />
          ) : activeMenu === 'impact' ? (
            <AdminImpact />
          ) : activeMenu === 'knowledge' ? (
            <AdminKnowledge />
          ) : activeMenu === 'pricing' ? (
            <AdminPricing />
          ) : activeMenu === 'contact' ? (
            <AdminContact />
          ) : activeMenu === 'images' ? (
            <AdminImages />
          ) : activeMenu === 'messages' ? (
            <AdminMessages />
          ) : (
            <div className="admin-content-wrapper">
              <h2 className="admin-page-title">
                {menuItems.find(item => item.id === activeMenu)?.label || 'Admin'}
              </h2>
              <p className="admin-placeholder">yet to be added</p>
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default Admin;
