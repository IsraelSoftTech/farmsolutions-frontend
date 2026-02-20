import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../config/api';
import { getImageUrl } from '../utils/imageUtils';
import './Hero.css';

const Hero = () => {
  const [heroContent, setHeroContent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      // Fetch content
      const contentResponse = await api.get(`/home-content/hero?t=${Date.now()}`);
      if (contentResponse.ok && contentResponse.data.data) {
        const content = contentResponse.data.data.content;
        setHeroContent(content);
      }
      
      // Fetch banner images directly from images API
      try {
        const imagesResponse = await api.get(`/images?category=banner&t=${Date.now()}`);
        if (imagesResponse.ok && imagesResponse.data.success) {
          const images = imagesResponse.data.data
            .map(img => getImageUrl(img.url))
            .filter(url => url); // Filter out any null/empty URLs
          setBannerImages(images);
        } else {
          // Fallback to content bannerImages if images API fails
          const content = contentResponse.ok ? contentResponse.data.data.content : {};
          if (content.bannerImages && content.bannerImages.length > 0) {
            const images = content.bannerImages
              .filter(img => img && img.trim())
              .map(img => getImageUrl(img));
            setBannerImages(images);
          } else {
            setBannerImages([]);
          }
        }
      } catch (imagesError) {
        console.error('Error fetching banner images:', imagesError);
        // Fallback to content bannerImages
        const content = contentResponse.ok ? contentResponse.data.data.content : {};
        if (content.bannerImages && content.bannerImages.length > 0) {
          const images = content.bannerImages
            .filter(img => img && img.trim())
            .map(img => getImageUrl(img));
          setBannerImages(images);
        } else {
          setBannerImages([]);
        }
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
      setHeroContent({
        title: "",
        tagline: "",
        primaryButton: { text: "", link: "" },
        secondaryButton: { text: "", link: "" },
        stats: []
      });
      setBannerImages([]);
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
    return <div className="hero-loading" aria-hidden="true"></div>;
  }

  return (
    <section className="hero" style={bannerImages.length === 0 ? { background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%)' } : {}}>
      {bannerImages.length > 0 && (
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
      )}
      
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
