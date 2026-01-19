import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './AnimatedLogo.css';

const AnimatedLogo = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Show animation on route change (website launch or page navigation)
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000); // 3 seconds total

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isAnimating) return null;

  return (
    <div className="animated-logo-overlay">
      <div className="animated-logo-container">
        {/* Actual logo image - revealed progressively */}
        <div className="logo-image-mask">
          <img 
            src={logo} 
            alt="Farmers Solutions Logo" 
            className="logo-image"
          />
        </div>
        {/* SVG drawing lines overlay */}
        <svg 
          className="logo-svg" 
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated drawing lines - leaf-like shape with green strokes */}
          <g className="logo-paths">
            {/* Main leaf outline - left curve */}
            <path
              d="M 100 30 Q 70 50 60 85 Q 55 105 60 125 Q 70 150 85 160 Q 100 168 100 168"
              fill="none"
              stroke="#00A859"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="logo-path path-1"
            />
            {/* Main leaf outline - right curve */}
            <path
              d="M 100 30 Q 130 50 140 85 Q 145 105 140 125 Q 130 150 115 160 Q 100 168 100 168"
              fill="none"
              stroke="#00A859"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="logo-path path-2"
            />
            {/* Stem */}
            <path
              d="M 100 168 L 100 185"
              fill="none"
              stroke="#00A859"
              strokeWidth="3"
              strokeLinecap="round"
              className="logo-path path-3"
            />
            {/* Veins - left side */}
            <path
              d="M 100 50 Q 80 60 70 80"
              fill="none"
              stroke="#00A859"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="logo-path path-4"
            />
            <path
              d="M 100 70 Q 80 85 70 100"
              fill="none"
              stroke="#00A859"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="logo-path path-5"
            />
            <path
              d="M 100 90 Q 80 105 70 120"
              fill="none"
              stroke="#00A859"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="logo-path path-6"
            />
            {/* Veins - right side */}
            <path
              d="M 100 50 Q 120 60 130 80"
              fill="none"
              stroke="#00A859"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="logo-path path-7"
            />
            <path
              d="M 100 70 Q 120 85 130 100"
              fill="none"
              stroke="#00A859"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="logo-path path-8"
            />
            <path
              d="M 100 90 Q 120 105 130 120"
              fill="none"
              stroke="#00A859"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="logo-path path-9"
            />
            {/* Center main vein */}
            <path
              d="M 100 30 L 100 168"
              fill="none"
              stroke="#00A859"
              strokeWidth="2"
              strokeLinecap="round"
              className="logo-path path-10"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default AnimatedLogo;
