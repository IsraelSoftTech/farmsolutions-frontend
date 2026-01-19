import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ban1 from '../assets/ban1.jpeg';
import ban2 from '../assets/ban2.jpeg';
import api from '../config/api';
import './Hero.css';

const Hero = () => {
  const [heroContent, setHeroContent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerImages, setBannerImages] = useState([ban1, ban2]);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const response = await api.get('/home-content/hero');
      if (response.ok && response.data.data) {
        const content = response.data.data.content;
        setHeroContent(content);
        
        // Load banner images from FTP if available
        if (content.bannerImages && content.bannerImages.length > 0) {
          const images = content.bannerImages.map(img => {
            if (img.startsWith('http')) return img;
            return `https://st69310.ispot.cc/farmsolutionss/uploads/${img}`;
          });
          setBannerImages(images);
        }
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
      // Fallback to default content
      setHeroContent({
        title: "Reducing Post-Harvest Losses with <span class=\"highlight-yellow\">Solar Innovation</span>",
        tagline: "Empowering farmers with sustainable preservation technology to increase income and reduce waste",
        primaryButton: { text: "View Products", link: "/products" },
        secondaryButton: { text: "Learn More", link: "/how-it-works" },
        stats: [
          { number: "85%", label: "Loss Reduction" },
          { number: "10,000+", label: "Farmers Helped" },
          { number: "2.5x", label: "Income Growth" }
        ]
      });
    }
  };

  useEffect(() => {
    if (bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
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

  if (!heroContent) {
    return <div className="hero-loading">Loading...</div>;
  }

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
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: heroContent.title }} />
          <p className="hero-tagline">{heroContent.tagline}</p>
          <div className="hero-buttons">
            <Link to={heroContent.primaryButton?.link || "/products"} className="btn-primary">
              {heroContent.primaryButton?.text || "View Products"}
            </Link>
            <Link to={heroContent.secondaryButton?.link || "/how-it-works"} className="btn-secondary">
              {heroContent.secondaryButton?.text || "Learn More"}
            </Link>
          </div>
          <div className="hero-stats">
            {(heroContent.stats || []).map((stat, index) => (
              <div key={index} className="hero-stat">
                <div className="hero-stat-number">{stat.number}</div>
                <div className="hero-stat-label-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
