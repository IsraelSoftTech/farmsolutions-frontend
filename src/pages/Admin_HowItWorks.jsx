import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaClipboardList, FaPalette, FaTools, FaBook, FaMobileAlt, FaTrophy } from 'react-icons/fa';
import adminService from '../services/adminService';
import EditableSection from '../components/EditableSection';
import EditableField from '../components/EditableField';
import './Admin_HowItWorks.css';
import '../pages/HowItWorksPage.css';

const iconMap = {
  'FaClipboardList': FaClipboardList,
  'FaPalette': FaPalette,
  'FaTools': FaTools,
  'FaBook': FaBook,
  'FaMobileAlt': FaMobileAlt,
  'FaTrophy': FaTrophy
};

const Admin_HowItWorks = () => {
  const [steps, setSteps] = useState([
    { number: '1', title: 'Assessment & Consultation', description: 'Our team visits your farm to assess your specific needs, crop types, and storage requirements.', icon: 'FaClipboardList' },
    { number: '2', title: 'Custom Solution Design', description: 'We design a tailored solar storage system or packaging solution that fits your farm size and budget.', icon: 'FaPalette' },
    { number: '3', title: 'Installation & Setup', description: 'Our certified technicians install your system with minimal disruption to your farming operations.', icon: 'FaTools' },
    { number: '4', title: 'Training & Support', description: 'We provide comprehensive training on using and maintaining your system, plus ongoing support.', icon: 'FaBook' },
    { number: '5', title: 'Monitor & Optimize', description: 'Use our mobile app to monitor storage conditions and optimize your post-harvest processes.', icon: 'FaMobileAlt' },
    { number: '6', title: 'Enjoy Results', description: 'Experience reduced losses, increased income, and better quality produce for your customers.', icon: 'FaTrophy' }
  ]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('How It Works');
  const [pageSubtitle, setPageSubtitle] = useState('A simple, step-by-step process to transform your post-harvest operations');
  const [ctaTitle, setCtaTitle] = useState('Ready to Get Started?');
  const [ctaText, setCtaText] = useState('Contact us today for a free consultation and assessment');

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    try {
      const response = await adminService.getHowItWorks();
      if (response.ok && response.data.data) {
        setSteps(response.data.data);
      }
    } catch (error) {
      console.error('Error loading steps:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStep = (index, field, value) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const handleSaveStep = async (step, index) => {
    try {
      const stepData = {
        step_number: parseInt(step.number) || index + 1,
        title: step.title,
        description: step.description,
        icon: step.icon,
        order_index: index
      };
      if (step.id) {
        await adminService.updateStep(step.id, stepData);
      } else {
        await adminService.saveStep(stepData);
      }
      await loadSteps();
      alert('Step saved!');
    } catch (error) {
      alert('Error saving step');
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, { number: String(steps.length + 1), title: '', description: '', icon: 'FaClipboardList' }]);
  };

  const handleDeleteStep = async (stepId, index) => {
    if (window.confirm('Delete this step?')) {
      if (stepId) {
        try {
          await adminService.deleteStep(stepId);
          await loadSteps();
        } catch (error) {
          alert('Error deleting step');
        }
      } else {
        const updated = steps.filter((_, i) => i !== index);
        setSteps(updated);
      }
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="how-it-works-page">
      {/* Page Hero - EXACT COPY */}
      <section className="page-hero">
        <div className="container">
          <EditableSection sectionId="how-it-works-hero">
            <h1 className="page-title">
              <EditableField value={pageTitle} onChange={setPageTitle} tag="span" />
            </h1>
            <p className="page-subtitle">
              <EditableField value={pageSubtitle} onChange={setPageSubtitle} multiline={true} tag="span" />
            </p>
          </EditableSection>
        </div>
      </section>

      {/* Steps Section - EXACT COPY */}
      <section className="steps-section">
        <div className="container">
          <div className="steps-grid">
            {steps.map((step, index) => (
              <EditableSection
                key={step.id || index}
                onSave={() => handleSaveStep(step, index)}
                sectionId={`step-${step.id || index}`}
                className="step-card"
              >
                <div className="step-number">
                  <EditableField
                    value={step.number}
                    onChange={(value) => updateStep(index, 'number', value)}
                    tag="span"
                  />
                </div>
                <div className="step-icon">
                  {iconMap[step.icon] ? React.createElement(iconMap[step.icon]) : <FaClipboardList />}
                </div>
                <h3>
                  <EditableField
                    value={step.title}
                    onChange={(value) => updateStep(index, 'title', value)}
                    tag="span"
                  />
                </h3>
                <p>
                  <EditableField
                    value={step.description}
                    onChange={(value) => updateStep(index, 'description', value)}
                    multiline={true}
                    tag="span"
                  />
                </p>
                {step.id && (
                  <button 
                    onClick={() => handleDeleteStep(step.id, index)} 
                    className="admin-delete-btn"
                    style={{ marginTop: '1rem' }}
                  >
                    <FaTrash /> Delete
                  </button>
                )}
              </EditableSection>
            ))}
          </div>
          <button onClick={handleAddStep} className="admin-add-btn">
            <FaPlus /> Add Step
          </button>
        </div>
      </section>

      {/* CTA Section - EXACT COPY */}
      <section className="cta-section">
        <div className="container">
          <EditableSection sectionId="how-it-works-cta">
            <div className="cta-content">
              <h2>
                <EditableField value={ctaTitle} onChange={setCtaTitle} tag="span" />
              </h2>
              <p>
                <EditableField value={ctaText} onChange={setCtaText} multiline={true} tag="span" />
              </p>
              <Link to="/contact" className="btn-primary">
                Schedule Consultation
              </Link>
            </div>
          </EditableSection>
        </div>
      </section>
    </div>
  );
};

export default Admin_HowItWorks;
