import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ban1 from '../assets/ban1.jpeg';
import ban2 from '../assets/ban2.jpeg';
import './Hero.css';

const Hero = () => {
  // Add more banner images here as needed (ban3, ban4, etc.)
  const bannerImages = [
    ban1,
    ban2,
    // Add more images: ban3, ban4, etc.
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  return (
    <section className="hero">
      <div className="hero-slider">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="hero-slide-overlay"></div>
          </div>
        ))}
      </div>
      
      {bannerImages.length > 1 && (
        <>
          <button className="hero-nav-button hero-nav-prev" onClick={goToPrevious} aria-label="Previous slide">
            <FaChevronLeft />
          </button>
          <button className="hero-nav-button hero-nav-next" onClick={goToNext} aria-label="Next slide">
            <FaChevronRight />
          </button>
          <div className="hero-dots">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

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
              <div className="hero-stat-number">85%</div>
              <div className="hero-stat-label-white">Loss Reduction</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">10,000+</div>
              <div className="hero-stat-label-white">Farmers Helped</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">2.5x</div>
              <div className="hero-stat-label-white">Income Growth</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
