import React from 'react';
import { getTeamImage } from '../utils/teamImages';
import './TeamSection.css';

const TeamSection = () => {
  // Team members data - ordered: CTO and CEO up, COO and CFO down
  const teamMembers = [
    {
      id: 1,
      name: 'Njong Nya Nadia Keng',
      position: 'CTO',
      qualification: 'MTech Renewable Energy Engineering, BTech Electrical and Electronics, Trained Technician',
      image: 'T1.jpg'
    },
    {
      id: 3,
      name: 'Njong Nya Malaica',
      position: 'CEO',
      qualification: 'MBA: Project Management/Information and Communication Technology, Public Health Administrator',
      image: 'T3.jpg'
    },
    {
      id: 2,
      name: 'Yasin Sidik Nkwankwa',
      position: 'Chief Operation Officer',
      qualification: 'PhD Electrical Power Systems',
      image: 'T2.jpeg'
    },
    {
      id: 4,
      name: 'Ashu Diane Enow',
      position: 'CFO',
      qualification: 'MBA in Finance',
      image: 'T4.jpeg'
    }
  ];

  return (
    <section className="team-section-home">
      <div className="container">
        <h2 className="section-title">Our Excellent Team</h2>
        
        {/* About Content */}
        <div className="about-content">
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

        {/* Team Members Grid */}
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-card-image">
                <img src={getTeamImage(member.image)} alt={member.name} />
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
  );
};

export default TeamSection;
