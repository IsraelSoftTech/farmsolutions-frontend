import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  // Team members data - you can update this with actual team member information
  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Chief Executive Officer',
      qualification: 'M.Sc. Agricultural Engineering',
      image: 'https://via.placeholder.com/300x300?text=Team+Member+1'
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Chief Technology Officer',
      qualification: 'Ph.D. Renewable Energy Systems',
      image: 'https://via.placeholder.com/300x300?text=Team+Member+2'
    },
    {
      id: 3,
      name: 'Michael Johnson',
      position: 'Head of Operations',
      qualification: 'M.Sc. Supply Chain Management',
      image: 'https://via.placeholder.com/300x300?text=Team+Member+3'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      position: 'Head of Business Development',
      qualification: 'MBA, Business Administration',
      image: 'https://via.placeholder.com/300x300?text=Team+Member+4'
    }
  ];

  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">
            Empowering farmers with innovative preservation solutions
          </p>
        </div>
      </section>

      <section className="about-content-section">
        <div className="container">
          <div className="about-writeup">
            <p>
              Farmers Solution is an agri-tech company created to tackle one of Africa's most persistent challenges: post-harvest losses and limited access to modern preservation infrastructure.
            </p>
            <p>
              We design and deploy smart, IoT-enabled, renewable-powered cold and dry storage and preservation systems, known as SPETHACS ROOMS. These systems help farmers preserve product quality, extend shelf life, and sell at better prices.
            </p>
            <p>
              Beyond technology, we work closely with smallholder farmers, cooperatives, aggregators, and agribusinesses, offering installation, training, maintenance, and after-sales support to ensure long-term impact and usability.
            </p>
            <p>
              At Farmers Solution, we believe that preserving food is preserving income, dignity, and opportunity. By reducing losses, improving quality, and strengthening food systems, we help farmers move from survival to sustainability.
            </p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-card-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-card-content">
                  <h3 className="team-member-name">{member.name}</h3>
                  <p className="team-member-position">{member.position}</p>
                  <p className="team-member-qualification">{member.qualification}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
