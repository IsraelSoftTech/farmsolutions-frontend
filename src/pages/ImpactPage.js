import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserTie, FaUsers, FaUserCircle } from 'react-icons/fa';
import './ImpactPage.css';

const ImpactPage = () => {
  const testimonials = [
    {
      name: 'John Mwangi',
      location: 'Kenya',
      role: 'Smallholder Farmer',
      icon: FaUser,
      text: 'The Spethacs Room A transformed my tomato farming. I used to lose 40% of my harvest, now I lose less than 10%. My income has doubled!',
      rating: 5
    },
    {
      name: 'Amina Yusuf',
      location: 'Nigeria',
      role: 'Vegetable Farmer',
      icon: FaUserTie,
      text: 'Easy to install and maintain. My vegetables stay fresh for weeks, allowing me to sell at better prices. Best investment I\'ve made.',
      rating: 5
    },
    {
      name: 'Rwanda Farmers Union',
      location: 'Rwanda',
      role: 'Agricultural Cooperative',
      icon: FaUsers,
      text: 'Our cooperative serves 200 farmers. The Spethacs Room B has helped us collectively save over $50,000 in lost produce. Game changer!',
      rating: 5
    },
    {
      name: 'Grace Okonkwo',
      location: 'Nigeria',
      role: 'Market Vendor',
      icon: FaUserCircle,
      text: 'FreshGuard bags have revolutionized how I store and transport my vegetables. Customers love the freshness and I waste less.',
      rating: 5
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Farmers Helped' },
    { number: '85%', label: 'Average Loss Reduction' },
    { number: '$2.5M', label: 'Income Generated' },
    { number: '50,000+', label: 'Tons Saved' }
  ];

  return (
    <div className="impact-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Our Impact</h1>
          <p className="page-subtitle">
            Real stories from farmers whose lives have been transformed by our solutions
          </p>
        </div>
      </section>

      <section className="impact-stats-section">
        <div className="container">
          <div className="impact-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="impact-stat-card">
                <div className="impact-stat-number">{stat.number}</div>
                <div className="impact-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => {
              const IconComponent = testimonial.icon;
              return (
                <div key={index} className="testimonial-card-large">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <IconComponent />
                    </div>
                    <div className="testimonial-info">
                      <h4>{testimonial.name}</h4>
                      <p className="testimonial-role">{testimonial.role}</p>
                      <p className="testimonial-location">{testimonial.location}</p>
                    </div>
                  </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-text-large">"{testimonial.text}"</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Success Stories</h2>
            <p>Start your journey to reduced losses and increased income today</p>
            <Link to="/contact" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImpactPage;
