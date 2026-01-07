import React from 'react';
import { Link } from 'react-router-dom';
import './HowItWorksPage.css';

const HowItWorksPage = () => {
  const steps = [
    {
      number: '1',
      title: 'Assessment & Consultation',
      description: 'Our team visits your farm to assess your specific needs, crop types, and storage requirements.',
      icon: '📋'
    },
    {
      number: '2',
      title: 'Custom Solution Design',
      description: 'We design a tailored solar storage system or packaging solution that fits your farm size and budget.',
      icon: '🎨'
    },
    {
      number: '3',
      title: 'Installation & Setup',
      description: 'Our certified technicians install your system with minimal disruption to your farming operations.',
      icon: '🔧'
    },
    {
      number: '4',
      title: 'Training & Support',
      description: 'We provide comprehensive training on using and maintaining your system, plus ongoing support.',
      icon: '📚'
    },
    {
      number: '5',
      title: 'Monitor & Optimize',
      description: 'Use our mobile app to monitor storage conditions and optimize your post-harvest processes.',
      icon: '📱'
    },
    {
      number: '6',
      title: 'Enjoy Results',
      description: 'Experience reduced losses, increased income, and better quality produce for your customers.',
      icon: '🎉'
    }
  ];

  return (
    <div className="how-it-works-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">How It Works</h1>
          <p className="page-subtitle">
            A simple, step-by-step process to transform your post-harvest operations
          </p>
        </div>
      </section>

      <section className="steps-section">
        <div className="container">
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Contact us today for a free consultation and assessment</p>
            <Link to="/contact" className="btn-primary">
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
