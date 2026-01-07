import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Reducing Post-Harvest Losses with <span className="highlight-yellow">Solar Innovation</span>
          </h1>
          <p className="hero-tagline">
            Empowering farmers with sustainable preservation technology to increase income and reduce waste
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">
              View Products
            </Link>
            <Link to="/how-it-works" className="btn-secondary">
              Learn More
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-number">85%</div>
              <div className="stat-label">Loss Reduction</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Farmers Helped</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">2.5x</div>
              <div className="stat-label">Income Growth</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
