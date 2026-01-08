import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { FaChartLine, FaDollarSign, FaGlobe, FaArrowUp } from 'react-icons/fa';
import { FaSolarPanel, FaBox, FaMobileAlt } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';
import adminService from '../services/adminService';
import EditableSection from '../components/EditableSection';
import EditableField from '../components/EditableField';
import ban1 from '../assets/ban1.jpeg';
import ban2 from '../assets/ban2.jpeg';
import './Admin_Home.css';
import '../components/Hero.css';
import '../components/ProblemSection.css';
import '../components/SolutionSection.css';
import '../components/ImpactSection.css';

const Admin_Home = () => {
  const [homeContent, setHomeContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerImages, setBannerImages] = useState([ban1, ban2]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Problem stats
  const [problemStats, setProblemStats] = useState([
    { number: '40%', label: 'Post-harvest losses in developing countries', icon: 'FaChartLine' },
    { number: '$31B', label: 'Annual economic losses in Africa alone', icon: 'FaDollarSign' },
    { number: '1.3B', label: 'Tons of food wasted globally each year', icon: 'FaGlobe' },
    { number: '30%', label: 'Income increase potential with proper storage', icon: 'FaArrowUp' }
  ]);

  // Solution cards
  const [solutionCards, setSolutionCards] = useState([
    { icon: 'FaSolarPanel', title: 'Solar Storage Systems', description: 'Climate-controlled storage rooms powered by solar energy, maintaining optimal temperature and humidity for extending crop shelf life.', features: ['100% Solar Powered', 'Climate Control', 'Real-time Monitoring'] },
    { icon: 'FaBox', title: 'Smart Packaging', description: 'Innovative packaging solutions that monitor and maintain product freshness, reducing spoilage during transportation and storage.', features: ['Freshness Sensors', 'Reusable Design', 'GPS Tracking'] },
    { icon: 'FaMobileAlt', title: 'Digital Monitoring', description: 'Real-time tracking and analytics to help farmers make informed decisions about storage conditions and market timing.', features: ['Mobile App', 'Data Analytics', 'Alerts & Notifications'] }
  ]);

  // Impact stats
  const [impactStats, setImpactStats] = useState([
    { number: '85%', label: 'Loss Reduction', description: 'Average reduction in post-harvest losses' },
    { number: '2.5x', label: 'Income Growth', description: 'Increase in farmer income' },
    { number: '10,000+', label: 'Farmers Helped', description: 'Farmers using our solutions' },
    { number: '50%', label: 'Quality Improvement', description: 'Better product quality maintained' }
  ]);

  // Hero stats
  const [heroStats, setHeroStats] = useState([
    { number: '85%', label: 'Loss Reduction' },
    { number: '10,000+', label: 'Farmers Helped' },
    { number: '2.5x', label: 'Income Growth' }
  ]);

  useEffect(() => {
    loadContent();
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const loadContent = async () => {
    try {
      const response = await adminService.getHomeContent();
      if (response.ok && response.data.data) {
        setHomeContent(response.data.data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionContent = (sectionName) => {
    return homeContent.find(s => s.section === sectionName) || {};
  };

  const handleSave = async (sectionName, data, imageFile) => {
    try {
      const sectionData = {
        section: sectionName,
        ...data,
        order_index: 0
      };
      await adminService.saveHomeContent(sectionData, imageFile);
      await loadContent();
      alert('Content saved successfully!');
    } catch (error) {
      alert('Error saving content');
    }
  };

  const handleBannerImageChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...bannerImages];
        newImages[index] = reader.result;
        setBannerImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBanner = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBannerImages([...bannerImages, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDeleteBanner = (index) => {
    if (window.confirm('Delete this banner image?')) {
      const newImages = bannerImages.filter((_, i) => i !== index);
      setBannerImages(newImages);
      if (currentSlide >= newImages.length) {
        setCurrentSlide(0);
      }
    }
  };

  const updateProblemStat = (index, field, value) => {
    const updated = [...problemStats];
    updated[index] = { ...updated[index], [field]: value };
    setProblemStats(updated);
  };

  const updateSolutionCard = (index, field, value) => {
    const updated = [...solutionCards];
    updated[index] = { ...updated[index], [field]: value };
    setSolutionCards(updated);
  };

  const updateSolutionFeature = (cardIndex, featureIndex, value) => {
    const updated = [...solutionCards];
    updated[cardIndex].features[featureIndex] = value;
    setSolutionCards(updated);
  };

  const updateImpactStat = (index, field, value) => {
    const updated = [...impactStats];
    updated[index] = { ...updated[index], [field]: value };
    setImpactStats(updated);
  };

  const updateHeroStat = (index, field, value) => {
    const updated = [...heroStats];
    updated[index] = { ...updated[index], [field]: value };
    setHeroStats(updated);
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  const heroContent = getSectionContent('hero');
  const problemContent = getSectionContent('problem');
  const solutionContent = getSectionContent('solution');
  const impactContent = getSectionContent('impact');

  const iconMap = {
    FaChartLine, FaDollarSign, FaGlobe, FaArrowUp,
    FaSolarPanel, FaBox, FaMobileAlt
  };

  return (
    <div className="admin-home-page">
      {/* Hero Section - EXACT COPY */}
      <section className="hero">
        <div className="hero-slider">
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="hero-slide-overlay"></div>
              <div className="admin-banner-controls">
                <label className="admin-upload-btn-small">
                  <FaEdit />
                  <input type="file" accept="image/*" onChange={(e) => handleBannerImageChange(index, e.target.files[0])} style={{ display: 'none' }} />
                </label>
                {bannerImages.length > 1 && (
                  <button onClick={() => handleDeleteBanner(index)} className="admin-delete-btn-small">
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {bannerImages.length > 1 && (
          <>
            <button className="hero-nav-button hero-nav-prev" onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}>
              <FaChevronLeft />
            </button>
            <button className="hero-nav-button hero-nav-next" onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerImages.length)}>
              <FaChevronRight />
            </button>
            <div className="hero-dots">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </>
        )}

        <div className="container">
          <EditableSection
            onSave={async () => {
              await handleSave('hero', {
                title: heroContent.title || 'Reducing Post-Harvest Losses with Solar Innovation',
                subtitle: heroContent.subtitle || 'Empowering farmers with sustainable preservation technology',
              });
            }}
            sectionId="hero"
          >
            <div className="hero-content">
              <h1 className="hero-title">
                <EditableField
                  value={heroContent.title || 'Reducing Post-Harvest Losses with <span class="highlight-yellow">Solar Innovation</span>'}
                  onChange={(value) => {
                    const updated = homeContent.map(s => 
                      s.section === 'hero' ? { ...s, title: value } : s
                    );
                    if (!updated.find(s => s.section === 'hero')) {
                      updated.push({ section: 'hero', title: value });
                    }
                    setHomeContent(updated);
                  }}
                  multiline={false}
                  tag="span"
                />
              </h1>
              <p className="hero-tagline">
                <EditableField
                  value={heroContent.subtitle || 'Empowering farmers with sustainable preservation technology to increase income and reduce waste'}
                  onChange={(value) => {
                    const updated = homeContent.map(s => 
                      s.section === 'hero' ? { ...s, subtitle: value } : s
                    );
                    if (!updated.find(s => s.section === 'hero')) {
                      updated.push({ section: 'hero', subtitle: value });
                    }
                    setHomeContent(updated);
                  }}
                  multiline={true}
                  tag="span"
                />
              </p>
              <div className="hero-buttons">
                <Link to="/products" className="btn-primary">View Products</Link>
                <Link to="/how-it-works" className="btn-secondary">Learn More</Link>
              </div>
              <div className="hero-stats">
                {heroStats.map((stat, index) => (
                  <EditableSection
                    key={index}
                    onSave={async () => {
                      // Save hero stats
                    }}
                    sectionId={`hero-stat-${index}`}
                    className="hero-stat"
                  >
                    <div className="hero-stat-number">
                      <EditableField
                        value={stat.number}
                        onChange={(value) => updateHeroStat(index, 'number', value)}
                        tag="span"
                      />
                    </div>
                    <div className="hero-stat-label-white">
                      <EditableField
                        value={stat.label}
                        onChange={(value) => updateHeroStat(index, 'label', value)}
                        tag="span"
                      />
                    </div>
                  </EditableSection>
                ))}
              </div>
            </div>
          </EditableSection>
        </div>
        <button onClick={handleAddBanner} className="admin-add-banner-btn">
          <FaPlus /> Add Banner Image
        </button>
      </section>

      {/* Problem Section - EXACT COPY */}
      <section className="problem-section">
        <div className="container">
          <EditableSection
            onSave={async () => {
              await handleSave('problem', {
                title: problemContent.title || 'The Challenge We Address',
                subtitle: problemContent.subtitle || 'Post-harvest losses are a critical issue...',
              });
            }}
            sectionId="problem"
          >
            <h2 className="section-title">
              <EditableField
                value={problemContent.title || 'The Challenge We Address'}
                onChange={(value) => {
                  const updated = homeContent.map(s => 
                    s.section === 'problem' ? { ...s, title: value } : s
                  );
                  if (!updated.find(s => s.section === 'problem')) {
                    updated.push({ section: 'problem', title: value });
                  }
                  setHomeContent(updated);
                }}
                tag="span"
              />
            </h2>
            <p className="section-subtitle">
              <EditableField
                value={problemContent.subtitle || 'Post-harvest losses are a critical issue affecting millions of farmers worldwide, leading to food insecurity and economic hardship.'}
                onChange={(value) => {
                  const updated = homeContent.map(s => 
                    s.section === 'problem' ? { ...s, subtitle: value } : s
                  );
                  if (!updated.find(s => s.section === 'problem')) {
                    updated.push({ section: 'problem', subtitle: value });
                  }
                  setHomeContent(updated);
                }}
                multiline={true}
                tag="span"
              />
            </p>
            <div className="problem-stats">
              {problemStats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon];
                return (
                  <EditableSection
                    key={index}
                    onSave={async () => {}}
                    sectionId={`problem-stat-${index}`}
                    className="stat-card"
                  >
                    <div className="stat-icon">
                      <IconComponent />
                    </div>
                    <div className="stat-number">
                      <EditableField
                        value={stat.number}
                        onChange={(value) => updateProblemStat(index, 'number', value)}
                        tag="span"
                      />
                    </div>
                    <div className="stat-label">
                      <EditableField
                        value={stat.label}
                        onChange={(value) => updateProblemStat(index, 'label', value)}
                        multiline={true}
                        tag="span"
                      />
                    </div>
                  </EditableSection>
                );
              })}
            </div>
          </EditableSection>
        </div>
      </section>

      {/* Solution Section - EXACT COPY */}
      <section className="solution-section">
        <div className="container">
          <EditableSection
            onSave={async () => {
              await handleSave('solution', {
                title: solutionContent.title || 'Our Solar-Powered Solutions',
                subtitle: solutionContent.subtitle || 'Innovative technology designed to reduce post-harvest losses...',
              });
            }}
            sectionId="solution"
          >
            <h2 className="section-title">
              <EditableField
                value={solutionContent.title || 'Our Solar-Powered Solutions'}
                onChange={(value) => {
                  const updated = homeContent.map(s => 
                    s.section === 'solution' ? { ...s, title: value } : s
                  );
                  if (!updated.find(s => s.section === 'solution')) {
                    updated.push({ section: 'solution', title: value });
                  }
                  setHomeContent(updated);
                }}
                tag="span"
              />
            </h2>
            <p className="section-subtitle">
              <EditableField
                value={solutionContent.subtitle || 'Innovative technology designed to reduce post-harvest losses and increase farmer income'}
                onChange={(value) => {
                  const updated = homeContent.map(s => 
                    s.section === 'solution' ? { ...s, subtitle: value } : s
                  );
                  if (!updated.find(s => s.section === 'solution')) {
                    updated.push({ section: 'solution', subtitle: value });
                  }
                  setHomeContent(updated);
                }}
                multiline={true}
                tag="span"
              />
            </p>
            <div className="solution-cards">
              {solutionCards.map((solution, index) => {
                const IconComponent = iconMap[solution.icon];
                return (
                  <EditableSection
                    key={index}
                    onSave={async () => {}}
                    sectionId={`solution-card-${index}`}
                    className="solution-card"
                  >
                    <div className="solution-icon">
                      <IconComponent />
                    </div>
                    <h3>
                      <EditableField
                        value={solution.title}
                        onChange={(value) => updateSolutionCard(index, 'title', value)}
                        tag="span"
                      />
                    </h3>
                    <p>
                      <EditableField
                        value={solution.description}
                        onChange={(value) => updateSolutionCard(index, 'description', value)}
                        multiline={true}
                        tag="span"
                      />
                    </p>
                    <ul className="solution-features">
                      {solution.features.map((feature, idx) => (
                        <li key={idx}>
                          <HiCheck className="check-icon" />
                          <EditableField
                            value={feature}
                            onChange={(value) => updateSolutionFeature(index, idx, value)}
                            tag="span"
                          />
                        </li>
                      ))}
                    </ul>
                  </EditableSection>
                );
              })}
            </div>
          </EditableSection>
        </div>
      </section>

      {/* Impact Section - EXACT COPY */}
      <section className="impact-section">
        <div className="container">
          <EditableSection
            onSave={async () => {
              await handleSave('impact', {
                title: impactContent.title || 'Real Impact, Real Results',
                subtitle: impactContent.subtitle || 'Our solutions are making a tangible difference...',
              });
            }}
            sectionId="impact"
          >
            <h2 className="section-title">
              <EditableField
                value={impactContent.title || 'Real Impact, Real Results'}
                onChange={(value) => {
                  const updated = homeContent.map(s => 
                    s.section === 'impact' ? { ...s, title: value } : s
                  );
                  if (!updated.find(s => s.section === 'impact')) {
                    updated.push({ section: 'impact', title: value });
                  }
                  setHomeContent(updated);
                }}
                tag="span"
              />
            </h2>
            <p className="section-subtitle">
              <EditableField
                value={impactContent.subtitle || 'Our solutions are making a tangible difference in the lives of farmers across Africa'}
                onChange={(value) => {
                  const updated = homeContent.map(s => 
                    s.section === 'impact' ? { ...s, subtitle: value } : s
                  );
                  if (!updated.find(s => s.section === 'impact')) {
                    updated.push({ section: 'impact', subtitle: value });
                  }
                  setHomeContent(updated);
                }}
                multiline={true}
                tag="span"
              />
            </p>
            <div className="impact-grid">
              {impactStats.map((impact, index) => (
                <EditableSection
                  key={index}
                  onSave={async () => {}}
                  sectionId={`impact-stat-${index}`}
                  className="impact-item"
                >
                  <div className="impact-number">
                    <EditableField
                      value={impact.number}
                      onChange={(value) => updateImpactStat(index, 'number', value)}
                      tag="span"
                    />
                  </div>
                  <div className="impact-label-white">
                    <EditableField
                      value={impact.label}
                      onChange={(value) => updateImpactStat(index, 'label', value)}
                      tag="span"
                    />
                  </div>
                  <div className="impact-description">
                    <EditableField
                      value={impact.description}
                      onChange={(value) => updateImpactStat(index, 'description', value)}
                      tag="span"
                    />
                  </div>
                </EditableSection>
              ))}
            </div>
          </EditableSection>
        </div>
      </section>
    </div>
  );
};

export default Admin_Home;
