import React, { useState, useEffect } from 'react';
import { FaChartLine, FaDollarSign, FaGlobe, FaArrowUp, FaLeaf } from 'react-icons/fa';
import api from '../config/api';
import './ProblemSection.css';

const ProblemSection = () => {
  const [problemContent, setProblemContent] = useState(null);

  const iconMap = {
    FaChartLine,
    FaDollarSign,
    FaGlobe,
    FaArrowUp,
    FaLeaf
  };

  useEffect(() => {
    fetchProblemContent();
  }, []);

  const fetchProblemContent = async () => {
    try {
      const response = await api.get('/home-content/problem');
      if (response.ok && response.data.data) {
        setProblemContent(response.data.data.content);
      }
    } catch (error) {
      console.error('Error fetching problem content:', error);
      // Fallback to default content
      setProblemContent({
        title: "The Challenge We Address",
        subtitle: "Post-harvest losses are a critical issue affecting millions of farmers worldwide, leading to food insecurity and economic hardship.",
        stats: [
          { number: '40%', label: 'Post-harvest losses in developing countries', icon: 'FaChartLine' },
          { number: '$31B', label: 'Annual economic losses in Africa alone', icon: 'FaDollarSign' },
          { number: '1.3B', label: 'Tons of food wasted globally each year', icon: 'FaGlobe' },
          { number: '30%', label: 'Income increase potential with proper storage', icon: 'FaArrowUp' },
          { number: '10%', label: 'Global emissions from food waste/spoilage', icon: 'FaLeaf' }
        ]
      });
    }
  };

  if (!problemContent) {
    return <div className="problem-loading">Loading...</div>;
  }

  return (
    <section className="problem-section">
      <div className="container">
        <h2 className="section-title">{problemContent.title}</h2>
        <p className="section-subtitle">{problemContent.subtitle}</p>
        <div className="problem-stats">
          {(problemContent.stats || []).map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || FaChartLine;
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <IconComponent />
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
