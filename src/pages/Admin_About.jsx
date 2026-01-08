import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import EditableSection from '../components/EditableSection';
import EditableField from '../components/EditableField';
import './Admin_About.css';
import '../pages/AboutPage.css';

const Admin_About = () => {
  const [content, setContent] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await adminService.getAboutContent();
      if (response.ok) {
        setContent(response.data.data.content || []);
        setTeam(response.data.data.team || []);
      } else {
        setDefaultContent();
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setDefaultContent();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultContent = () => {
    setContent([
      { section: 'intro', content: 'Farmers Solution is an agri-tech company created to tackle one of Africa\'s most persistent challenges: post-harvest losses and limited access to modern preservation infrastructure.' },
      { section: 'mission', content: 'We design and deploy smart, IoT-enabled, renewable-powered cold and dry storage and preservation systems, known as SPETHACS ROOMS. These systems help farmers preserve product quality, extend shelf life, and sell at better prices.' },
      { section: 'approach', content: 'Beyond technology, we work closely with smallholder farmers, cooperatives, aggregators, and agribusinesses, offering installation, training, maintenance, and after-sales support to ensure long-term impact and usability.' },
      { section: 'vision', content: 'At Farmers Solution, we believe that preserving food is preserving income, dignity, and opportunity. By reducing losses, improving quality, and strengthening food systems, we help farmers move from survival to sustainability.' },
    ]);
    setTeam([
      { id: 1, name: 'John Doe', position: 'Chief Executive Officer', qualification: 'M.Sc. Agricultural Engineering', image: 'https://via.placeholder.com/300x300?text=Team+Member+1' },
      { id: 2, name: 'Jane Smith', position: 'Chief Technology Officer', qualification: 'Ph.D. Renewable Energy Systems', image: 'https://via.placeholder.com/300x300?text=Team+Member+2' },
      { id: 3, name: 'Michael Johnson', position: 'Head of Operations', qualification: 'M.Sc. Supply Chain Management', image: 'https://via.placeholder.com/300x300?text=Team+Member+3' },
      { id: 4, name: 'Sarah Williams', position: 'Head of Business Development', qualification: 'MBA, Business Administration', image: 'https://via.placeholder.com/300x300?text=Team+Member+4' },
    ]);
  };

  const getSectionContent = (sectionName) => {
    return content.find(s => s.section === sectionName) || {};
  };

  const handleSaveContent = async (sectionName, text) => {
    try {
      await adminService.saveAboutContent({
        section: sectionName,
        content: text,
        order_index: 0
      });
      await loadContent();
      alert('Content saved!');
    } catch (error) {
      alert('Error saving content');
    }
  };

  const handleSaveTeam = async () => {
    try {
      const { imageFile, ...data } = formData;
      if (editingTeam.id) {
        await adminService.updateTeamMember(editingTeam.id, data, imageFile);
      } else {
        await adminService.saveTeamMember(data, imageFile);
      }
      alert('Team member saved!');
      setEditingTeam(null);
      loadContent();
    } catch (error) {
      alert('Error saving team member');
    }
  };

  const handleAddTeam = () => {
    setEditingTeam({ id: null });
    setFormData({ name: '', position: '', qualification: '' });
    setImagePreview(null);
  };

  const handleEditTeam = (member) => {
    setEditingTeam(member);
    setFormData({ name: member.name, position: member.position, qualification: member.qualification });
    setImagePreview(member.image_url || null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="about-page">
      {/* Page Hero - Exact copy */}
      <section className="page-hero">
        <div className="container">
          <EditableSection sectionId="about-hero">
            <h1 className="page-title">
              <EditableField value="About Us" tag="span" />
            </h1>
            <p className="page-subtitle">
              <EditableField 
                value="Empowering farmers with innovative preservation solutions"
                multiline={true}
                tag="span"
              />
            </p>
          </EditableSection>
        </div>
      </section>

      {/* About Content - Exact copy with editing */}
      <section className="about-content-section">
        <div className="container">
          <EditableSection
            onSave={async () => {
              const intro = getSectionContent('intro');
              await handleSaveContent('intro', intro.content);
            }}
            sectionId="intro"
          >
            <div className="about-writeup">
              <p>
                <EditableField
                  value={getSectionContent('intro').content || 'Farmers Solution is an agri-tech company...'}
                  onChange={(value) => {
                    const updated = content.map(s => 
                      s.section === 'intro' ? { ...s, content: value } : s
                    );
                    setContent(updated);
                  }}
                  multiline={true}
                  tag="span"
                />
              </p>
              <p>
                <EditableField
                  value={getSectionContent('mission').content || 'We design and deploy smart, IoT-enabled...'}
                  onChange={(value) => {
                    const updated = content.map(s => 
                      s.section === 'mission' ? { ...s, content: value } : s
                    );
                    setContent(updated);
                  }}
                  multiline={true}
                  tag="span"
                />
              </p>
              <p>
                <EditableField
                  value={getSectionContent('approach').content || 'Beyond technology, we work closely...'}
                  onChange={(value) => {
                    const updated = content.map(s => 
                      s.section === 'approach' ? { ...s, content: value } : s
                    );
                    setContent(updated);
                  }}
                  multiline={true}
                  tag="span"
                />
              </p>
              <p>
                <EditableField
                  value={getSectionContent('vision').content || 'At Farmers Solution, we believe...'}
                  onChange={(value) => {
                    const updated = content.map(s => 
                      s.section === 'vision' ? { ...s, content: value } : s
                    );
                    setContent(updated);
                  }}
                  multiline={true}
                  tag="span"
                />
              </p>
            </div>
          </EditableSection>
        </div>
      </section>

      {/* Team Section - Exact copy with editing */}
      <section className="team-section">
        <div className="container">
          <EditableSection sectionId="team-section-title">
            <h2 className="section-title">
              <EditableField value="Our Team" tag="span" />
            </h2>
          </EditableSection>
          <div className="team-grid">
            {team.map((member) => (
              <EditableSection
                key={member.id}
                onSave={async () => {
                  await handleSaveTeam();
                }}
                sectionId={`team-${member.id}`}
              >
                <div className="team-card">
                  <div className="team-card-image">
                    <img src={member.image_url || member.image || 'https://via.placeholder.com/300x300'} alt={member.name} />
                    <div className="admin-image-overlay">
                      <label className="admin-upload-btn">
                        Change Photo
                        <input type="file" accept="image/*" onChange={(e) => {
                          handleImageChange(e);
                          handleEditTeam(member);
                        }} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                  <div className="team-card-content">
                    <h3 className="team-member-name">
                      <EditableField
                        value={member.name}
                        onChange={(value) => {
                          const updated = team.map(m => 
                            m.id === member.id ? { ...m, name: value } : m
                          );
                          setTeam(updated);
                          setFormData({ ...formData, name: value });
                        }}
                        tag="span"
                      />
                    </h3>
                    <p className="team-member-position">
                      <EditableField
                        value={member.position}
                        onChange={(value) => {
                          const updated = team.map(m => 
                            m.id === member.id ? { ...m, position: value } : m
                          );
                          setTeam(updated);
                          setFormData({ ...formData, position: value });
                        }}
                        tag="span"
                      />
                    </p>
                    <p className="team-member-qualification">
                      <EditableField
                        value={member.qualification}
                        onChange={(value) => {
                          const updated = team.map(m => 
                            m.id === member.id ? { ...m, qualification: value } : m
                          );
                          setTeam(updated);
                          setFormData({ ...formData, qualification: value });
                        }}
                        tag="span"
                      />
                    </p>
                  </div>
                </div>
              </EditableSection>
            ))}
          </div>
          <button onClick={handleAddTeam} className="admin-add-btn">+ Add Team Member</button>
        </div>
      </section>
    </div>
  );
};

export default Admin_About;
