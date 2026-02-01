import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-message">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn-primary">
              Go to Home
            </Link>
            <Link to="/knowledge" className="btn-secondary">
              Browse Knowledge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
