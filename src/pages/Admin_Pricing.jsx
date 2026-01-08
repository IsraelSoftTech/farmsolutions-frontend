import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaWrench, FaPhone } from 'react-icons/fa';
import adminService from '../services/adminService';
import EditableSection from '../components/EditableSection';
import EditableField from '../components/EditableField';
import { solarStorageProducts } from '../data/products';
import './Admin_Pricing.css';
import '../pages/PricingPage.css';

const iconMap = {
  'FaCreditCard': FaCreditCard,
  'FaWrench': FaWrench,
  'FaPhone': FaPhone
};

const Admin_Pricing = () => {
  const [packages, setPackages] = useState(solarStorageProducts);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('Pricing & Packages');
  const [pageSubtitle, setPageSubtitle] = useState('Flexible pricing options to suit farms of all sizes');
  const [infoCards, setInfoCards] = useState([
    { icon: 'FaCreditCard', title: 'Flexible Payment', description: 'Payment plans available for qualified farmers and cooperatives' },
    { icon: 'FaWrench', title: 'Installation Included', description: 'Professional installation and setup included in all packages' },
    { icon: 'FaPhone', title: 'Ongoing Support', description: '24/7 technical support and maintenance services available' }
  ]);
  const [ctaTitle, setCtaTitle] = useState('Need a Custom Solution?');
  const [ctaText, setCtaText] = useState('Contact us for a personalized quote tailored to your specific needs');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await adminService.getPricing();
      if (response.ok && response.data.data) {
        setPackages(response.data.data);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePackage = (packageId, field, value) => {
    const updated = packages.map(p => 
      (p.id === packageId || p.product_id === packageId) ? { ...p, [field]: value } : p
    );
    setPackages(updated);
  };

  const updatePackageBenefit = (packageId, index, value) => {
    const updated = packages.map(p => {
      if (p.id === packageId || p.product_id === packageId) {
        const benefits = Array.isArray(p.benefits) ? [...p.benefits] : [];
        benefits[index] = value;
        return { ...p, benefits };
      }
      return p;
    });
    setPackages(updated);
  };

  const updateInfoCard = (index, field, value) => {
    const updated = [...infoCards];
    updated[index] = { ...updated[index], [field]: value };
    setInfoCards(updated);
  };

  const handleSavePackage = async (pkg) => {
    try {
      const packageData = {
        name: pkg.name,
        capacity: pkg.capacity,
        features: Array.isArray(pkg.benefits) ? pkg.benefits.slice(0, 4) : [],
        price_note: 'Contact for pricing',
        order_index: 0
      };
      await adminService.savePackage(packageData);
      await loadPackages();
      alert('Package saved!');
    } catch (error) {
      alert('Error saving package');
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="pricing-page">
      {/* Page Hero - EXACT COPY */}
      <section className="page-hero">
        <div className="container">
          <EditableSection sectionId="pricing-hero">
            <h1 className="page-title">
              <EditableField value={pageTitle} onChange={setPageTitle} tag="span" />
            </h1>
            <p className="page-subtitle">
              <EditableField value={pageSubtitle} onChange={setPageSubtitle} multiline={true} tag="span" />
            </p>
          </EditableSection>
        </div>
      </section>

      {/* Pricing Section - EXACT COPY */}
      <section className="pricing-section">
        <div className="container">
          <div className="pricing-grid">
            {packages.map((pkg, index) => (
              <EditableSection
                key={pkg.id || pkg.product_id || index}
                onSave={() => handleSavePackage(pkg)}
                sectionId={`pricing-${pkg.id || index}`}
                className="pricing-card"
              >
                <div className="pricing-header">
                  <h3>
                    <EditableField
                      value={pkg.name}
                      onChange={(value) => updatePackage(pkg.id || pkg.product_id, 'name', value)}
                      tag="span"
                    />
                  </h3>
                  <div className="pricing-capacity">
                    <EditableField
                      value={pkg.capacity || ''}
                      onChange={(value) => updatePackage(pkg.id || pkg.product_id, 'capacity', value)}
                      tag="span"
                    />
                  </div>
                </div>
                <div className="pricing-features">
                  <ul>
                    {(Array.isArray(pkg.benefits) ? pkg.benefits.slice(0, 4) : []).map((benefit, idx) => (
                      <li key={idx}>
                        ✓{' '}
                        <EditableField
                          value={benefit}
                          onChange={(value) => updatePackageBenefit(pkg.id || pkg.product_id, idx, value)}
                          tag="span"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pricing-footer">
                  <div className="pricing-note">Contact for pricing</div>
                  <Link to={`/products/${pkg.id || pkg.product_id}`} className="btn-primary">
                    View Details
                  </Link>
                  <Link to="/contact" className="btn-secondary">
                    Request Quote
                  </Link>
                </div>
              </EditableSection>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section - EXACT COPY */}
      <section className="pricing-info-section">
        <div className="container">
          <div className="info-grid">
            {infoCards.map((card, index) => (
              <EditableSection
                key={index}
                sectionId={`info-card-${index}`}
                className="info-card"
              >
                <div className="info-icon">
                  {iconMap[card.icon] ? React.createElement(iconMap[card.icon]) : <FaCreditCard />}
                </div>
                <h3>
                  <EditableField
                    value={card.title}
                    onChange={(value) => updateInfoCard(index, 'title', value)}
                    tag="span"
                  />
                </h3>
                <p>
                  <EditableField
                    value={card.description}
                    onChange={(value) => updateInfoCard(index, 'description', value)}
                    multiline={true}
                    tag="span"
                  />
                </p>
              </EditableSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - EXACT COPY */}
      <section className="cta-section">
        <div className="container">
          <EditableSection sectionId="pricing-cta">
            <div className="cta-content">
              <h2>
                <EditableField value={ctaTitle} onChange={setCtaTitle} tag="span" />
              </h2>
              <p>
                <EditableField value={ctaText} onChange={setCtaText} multiline={true} tag="span" />
              </p>
              <Link to="/contact" className="btn-primary">
                Get Custom Quote
              </Link>
            </div>
          </EditableSection>
        </div>
      </section>
    </div>
  );
};

export default Admin_Pricing;
