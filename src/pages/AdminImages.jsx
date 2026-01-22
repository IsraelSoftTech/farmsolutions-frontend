import React, { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaEdit, FaSearch, FaImage, FaFilter, FaCopy, FaCheck } from 'react-icons/fa';
import api, { API_BASE_URL } from '../config/api';
import useNotification from '../hooks/useNotification';
import NotificationContainer from '../components/NotificationContainer';
import { getImageUrl } from '../utils/imageUtils';
import './AdminImages.css';

const IMAGE_CATEGORIES = [
  { value: 'logo', label: 'Logo' },
  { value: 'banner', label: 'Banner Images' },
  { value: 'team', label: 'Team Member Photos' },
  { value: 'product', label: 'Product Images' },
  { value: 'partner', label: 'Partner Logos' },
  { value: 'other', label: 'Other' }
];

const AdminImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingImage, setEditingImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [editingImageFile, setEditingImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);
  
  // Data for dropdowns
  const [partners, setPartners] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [uploadForm, setUploadForm] = useState({
    category: 'other',
    description: '',
    alt: '',
    team_name: '',
    team_role: '',
    team_qualification: '',
    selected_partner: '',
    selected_team_member: '',
    selected_product: ''
  });
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  useEffect(() => {
    fetchImages();
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch partners
      try {
        const partnersResponse = await api.get('/home-content/partners');
        if (partnersResponse.ok && partnersResponse.data.data) {
          const partnersData = partnersResponse.data.data.content.partners || [];
          setPartners(partnersData);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
      
      // Fetch team members
      try {
        const teamResponse = await api.get('/home-content/team');
        if (teamResponse.ok && teamResponse.data.data) {
          const teamData = teamResponse.data.data.content.teamMembers || [];
          setTeamMembers(teamData);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
      
      // Fetch products
      try {
        const productsResponse = await api.get('/products-content');
        if (productsResponse.ok && productsResponse.data.success) {
          const solarProducts = productsResponse.data.data.solar_storage?.content?.products || [];
          const packagingProducts = productsResponse.data.data.smart_packaging?.content?.products || [];
          setProducts([...solarProducts, ...packagingProducts]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const category = selectedCategory !== 'all' ? selectedCategory : null;
      const url = category 
        ? `/images?category=${category}`
        : '/images';
      
      const response = await api.get(url);
      if (response.ok && response.data.success) {
        setImages(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      showError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('Image size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', uploadForm.category);
      formData.append('description', uploadForm.description);
      formData.append('alt', uploadForm.alt);
      
      // Add category-specific fields
      if (uploadForm.category === 'team') {
        // If team member is selected from dropdown, use that data
        if (uploadForm.selected_team_member) {
          const selectedMember = teamMembers.find(m => m.id === parseInt(uploadForm.selected_team_member) || m.name === uploadForm.selected_team_member);
          if (selectedMember) {
            formData.append('team_name', selectedMember.name || '');
            formData.append('team_role', selectedMember.position || '');
            formData.append('team_qualification', selectedMember.qualification || '');
            formData.append('alt', selectedMember.name || uploadForm.alt);
          }
        } else {
          // Manual entry
          formData.append('team_name', uploadForm.team_name || '');
          formData.append('team_role', uploadForm.team_role || '');
          formData.append('team_qualification', uploadForm.team_qualification || '');
        }
      } else if (uploadForm.category === 'partner') {
        // If partner is selected from dropdown, use that data
        if (uploadForm.selected_partner) {
          const selectedPartner = partners.find(p => p.id === parseInt(uploadForm.selected_partner) || p.name === uploadForm.selected_partner);
          if (selectedPartner) {
            formData.append('alt', selectedPartner.name || uploadForm.alt);
            formData.append('description', selectedPartner.name || uploadForm.description);
          }
        }
      } else if (uploadForm.category === 'product') {
        // If product is selected from dropdown, use that data
        if (uploadForm.selected_product) {
          const selectedProduct = products.find(p => p.id === parseInt(uploadForm.selected_product) || p.name === uploadForm.selected_product);
          if (selectedProduct) {
            formData.append('alt', selectedProduct.name || uploadForm.alt);
            formData.append('description', selectedProduct.name || uploadForm.description);
          }
        }
      }

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Image uploaded successfully!');
        setUploadForm({ 
          category: 'other', 
          description: '', 
          alt: '', 
          team_name: '', 
          team_role: '', 
          team_qualification: '',
          selected_partner: '',
          selected_team_member: '',
          selected_product: ''
        });
        setShowUploadModal(false);
        fetchImages();
      } else {
        showError(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleDeleteClick = (id, filename) => {
    setImageToDelete({ id, filename });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/images/${imageToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Image deleted successfully');
        fetchImages();
      } else {
        showError(result.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showError('Failed to delete image');
    } finally {
      setShowDeleteModal(false);
      setImageToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setImageToDelete(null);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return;
      }
      setEditingImageFile(file);
    }
  };

  const handleEdit = async (image) => {
    try {
      setUploadingImage(true);
      const token = localStorage.getItem('authToken');
      
      // If a new image file is selected, upload it first
      let imageUrl = image.url;
      if (editingImageFile) {
        const formData = new FormData();
        formData.append('image', editingImageFile);
        formData.append('category', image.category);
        formData.append('description', image.description || '');
        formData.append('alt', image.alt_text || '');
        
        if (image.category === 'team') {
          formData.append('team_name', image.team_name || '');
          formData.append('team_role', image.team_role || '');
          formData.append('team_qualification', image.team_qualification || '');
        }
        
        const uploadResponse = await fetch(`${API_BASE_URL}/images/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (!uploadResult.success) {
          showError(uploadResult.error || 'Failed to upload new image');
          setUploadingImage(false);
          return;
        }
        
        imageUrl = uploadResult.data.url;
        
        // Delete the old image
        try {
          await fetch(`${API_BASE_URL}/images/${image.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (deleteError) {
          console.warn('Could not delete old image:', deleteError);
        }
        
        // Update the new image with all metadata
        const updateResponse = await fetch(`${API_BASE_URL}/images/${uploadResult.data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            category: image.category,
            description: image.description,
            alt_text: image.alt_text,
            team_name: image.category === 'team' ? (image.team_name || null) : null,
            team_role: image.category === 'team' ? (image.team_role || null) : null,
            team_qualification: image.category === 'team' ? (image.team_qualification || null) : null
          })
        });
        
        const updateResult = await updateResponse.json();
        
        if (updateResult.success) {
          showSuccess('Image updated successfully');
          setEditingImage(null);
          setEditingImageFile(null);
          fetchImages();
        } else {
          showError(updateResult.error || 'Failed to update image metadata');
        }
        setUploadingImage(false);
        return;
      }
      
      // If no new file, just update metadata
      const requestBody = {
        category: image.category,
        description: image.description,
        alt_text: image.alt_text
      };
      
      // Add team-specific fields if category is 'team'
      if (image.category === 'team') {
        requestBody.team_name = image.team_name || null;
        requestBody.team_role = image.team_role || null;
        requestBody.team_qualification = image.team_qualification || null;
      }
      
      const response = await fetch(`${API_BASE_URL}/images/${image.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Image updated successfully');
        setEditingImage(null);
        setEditingImageFile(null);
        fetchImages();
      } else {
        showError(result.error || 'Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      showError('Failed to update image');
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredImages = images.filter(image => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        image.filename.toLowerCase().includes(searchLower) ||
        (image.description && image.description.toLowerCase().includes(searchLower)) ||
        (image.alt_text && image.alt_text.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const getCategoryLabel = (category) => {
    const cat = IMAGE_CATEGORIES.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const handleCopyUrl = async (imageUrl) => {
    const fullUrl = getImageUrl(imageUrl);
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(fullUrl);
      showSuccess('Image URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      showError('Failed to copy URL. Please copy manually.');
    }
  };

  return (
    <div className="admin-images">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      
      <div className="admin-images-header">
        <div className="header-content">
          <h2 className="page-title">
            <FaImage className="title-icon" />
            Image Management
          </h2>
          <p className="page-subtitle">Upload and manage all images used across the website</p>
        </div>
        <button 
          className="btn-primary upload-btn"
          onClick={() => setShowUploadModal(true)}
        >
          <FaUpload /> Upload Image
        </button>
      </div>

      {/* Filters */}
      <div className="images-filters">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {IMAGE_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="search-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload New Image</h3>
              <button className="modal-close" onClick={() => setShowUploadModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="form-input"
                >
                  {IMAGE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Image File *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="form-input"
                />
                <small>Max size: 10MB. Supported formats: JPG, PNG, GIF, WebP</small>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="form-input"
                  rows="3"
                  placeholder="Optional description of the image"
                />
              </div>
              <div className="form-group">
                <label>Alt Text</label>
                <input
                  type="text"
                  value={uploadForm.alt}
                  onChange={(e) => setUploadForm({ ...uploadForm, alt: e.target.value })}
                  className="form-input"
                  placeholder="Alternative text for accessibility"
                />
              </div>
              
              {/* Partner Selection */}
              {uploadForm.category === 'partner' && (
                <div className="form-group">
                  <label>Select Partner *</label>
                  <select
                    value={uploadForm.selected_partner}
                    onChange={(e) => setUploadForm({ ...uploadForm, selected_partner: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">-- Select a Partner --</option>
                    {partners.map(partner => (
                      <option key={partner.id || partner.name} value={partner.id || partner.name}>
                        {partner.name}
                      </option>
                    ))}
                  </select>
                  {partners.length === 0 && !loadingData && (
                    <small style={{ color: '#dc3545' }}>
                      No partners found. Add partners in the Home section first.
                    </small>
                  )}
                </div>
              )}
              
              {/* Team Member Selection */}
              {uploadForm.category === 'team' && (
                <>
                  <div className="form-group">
                    <label>Select Team Member (Optional)</label>
                    <select
                      value={uploadForm.selected_team_member}
                      onChange={(e) => {
                        const selectedMember = teamMembers.find(m => 
                          (m.id && m.id.toString() === e.target.value) || 
                          m.name === e.target.value
                        );
                        setUploadForm({ 
                          ...uploadForm, 
                          selected_team_member: e.target.value,
                          team_name: selectedMember ? selectedMember.name : uploadForm.team_name,
                          team_role: selectedMember ? selectedMember.position : uploadForm.team_role,
                          team_qualification: selectedMember ? selectedMember.qualification : uploadForm.team_qualification
                        });
                      }}
                      className="form-input"
                    >
                      <option value="">-- Select a Team Member (or enter manually) --</option>
                      {teamMembers.map(member => (
                        <option key={member.id || member.name} value={member.id || member.name}>
                          {member.name} {member.position ? `- ${member.position}` : ''}
                        </option>
                      ))}
                    </select>
                    {teamMembers.length === 0 && !loadingData && (
                      <small style={{ color: '#dc3545' }}>
                        No team members found. Add team members in the Home section first.
                      </small>
                    )}
                  </div>
                  {!uploadForm.selected_team_member && (
                    <>
                      <div className="form-group">
                        <label>Team Member Name *</label>
                        <input
                          type="text"
                          value={uploadForm.team_name}
                          onChange={(e) => setUploadForm({ ...uploadForm, team_name: e.target.value })}
                          className="form-input"
                          placeholder="Full name of the team member"
                          required={!uploadForm.selected_team_member}
                        />
                      </div>
                      <div className="form-group">
                        <label>Role/Position</label>
                        <input
                          type="text"
                          value={uploadForm.team_role}
                          onChange={(e) => setUploadForm({ ...uploadForm, team_role: e.target.value })}
                          className="form-input"
                          placeholder="e.g., CEO, CTO, CFO"
                        />
                      </div>
                      <div className="form-group">
                        <label>Qualification</label>
                        <textarea
                          value={uploadForm.team_qualification}
                          onChange={(e) => setUploadForm({ ...uploadForm, team_qualification: e.target.value })}
                          className="form-input"
                          rows="3"
                          placeholder="Educational background, certifications, etc."
                        />
                      </div>
                    </>
                  )}
                </>
              )}
              
              {/* Product Selection */}
              {uploadForm.category === 'product' && (
                <div className="form-group">
                  <label>Select Product *</label>
                  <select
                    value={uploadForm.selected_product}
                    onChange={(e) => setUploadForm({ ...uploadForm, selected_product: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">-- Select a Product --</option>
                    {products.map(product => (
                      <option key={product.id || product.name} value={product.id || product.name}>
                        {product.name} {product.category ? `(${product.category})` : ''}
                      </option>
                    ))}
                  </select>
                  {products.length === 0 && !loadingData && (
                    <small style={{ color: '#dc3545' }}>
                      No products found. Add products in the Products section first.
                    </small>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadForm({ 
                    category: 'other', 
                    description: '', 
                    alt: '', 
                    team_name: '', 
                    team_role: '', 
                    team_qualification: '',
                    selected_partner: '',
                    selected_team_member: '',
                    selected_product: ''
                  });
                }}
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {loading ? (
        <div className="loading-state">
          <p>Loading images...</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="empty-state">
          <FaImage className="empty-icon" />
          <h3>No images found</h3>
          <p>
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your filters or search term'
              : 'Upload your first image to get started'}
          </p>
        </div>
      ) : (
        <div className="images-grid">
          {filteredImages.map(image => (
            <div key={image.id} className="image-card">
              <div className="image-preview">
                <img src={getImageUrl(image.url)} alt={image.alt_text || image.filename} />
                <div className="image-overlay">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => setEditingImage(editingImage?.id === image.id ? null : image)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => handleDeleteClick(image.id, image.filename)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="image-info">
                <div className="image-category">{getCategoryLabel(image.category)}</div>
                <div className="image-filename" title={image.filename}>{image.filename}</div>
                
                {/* Team member info */}
                {image.category === 'team' && image.team_name && (
                  <div className="team-member-info">
                    <div className="team-member-name-display"><strong>{image.team_name}</strong></div>
                    {image.team_role && (
                      <div className="team-member-role">{image.team_role}</div>
                    )}
                    {image.team_qualification && (
                      <div className="team-member-qualification">{image.team_qualification}</div>
                    )}
                  </div>
                )}
                
                {image.description && (
                  <div className="image-description">{image.description}</div>
                )}
                <div className="image-url-section">
                  <button
                    className="copy-url-btn"
                    onClick={() => handleCopyUrl(image.url)}
                    title="Copy image URL"
                  >
                    {copiedUrl === getImageUrl(image.url) ? (
                      <>
                        <FaCheck /> Copied!
                      </>
                    ) : (
                      <>
                        <FaCopy /> Copy URL
                      </>
                    )}
                  </button>
                  <span className="image-url-preview" title={getImageUrl(image.url)}>
                    {getImageUrl(image.url).length > 50 
                      ? getImageUrl(image.url).substring(0, 50) + '...'
                      : getImageUrl(image.url)}
                  </span>
                </div>
                <div className="image-date">
                  {new Date(image.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Edit Form */}
              {editingImage?.id === image.id && (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Change Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="form-input"
                    />
                    {editingImageFile && (
                      <div className="image-preview-small">
                        <img 
                          src={URL.createObjectURL(editingImageFile)} 
                          alt="Preview" 
                          style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '0.5rem' }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                          New image: {editingImageFile.name}
                        </p>
                      </div>
                    )}
                    <small>Leave empty to keep current image. Max size: 10MB</small>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={editingImage.category}
                      onChange={(e) => setEditingImage({ ...editingImage, category: e.target.value })}
                      className="form-input"
                    >
                      {IMAGE_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editingImage.description || ''}
                      onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                      className="form-input"
                      rows="2"
                    />
                  </div>
                  <div className="form-group">
                    <label>Alt Text</label>
                    <input
                      type="text"
                      value={editingImage.alt_text || ''}
                      onChange={(e) => setEditingImage({ ...editingImage, alt_text: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      className="btn-primary btn-sm"
                      onClick={() => handleEdit(editingImage)}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? 'Uploading...' : 'Save'}
                    </button>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        setEditingImage(null);
                        setEditingImageFile(null);
                      }}
                      disabled={uploadingImage}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredImages.length > 0 && (
        <div className="images-footer">
          <p>Showing {filteredImages.length} of {images.length} images</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && imageToDelete && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Image</h3>
              <button className="modal-close" onClick={handleDeleteCancel}>×</button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <FaTrash className="delete-icon" />
                <h4>Are you sure you want to delete this image?</h4>
                <p className="delete-filename">{imageToDelete.filename}</p>
                <p className="delete-warning-text">
                  This action cannot be undone. The image will be permanently removed from the server and all references to it will be broken.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteConfirm}
              >
                <FaTrash /> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </div>
  );
};

export default AdminImages;
