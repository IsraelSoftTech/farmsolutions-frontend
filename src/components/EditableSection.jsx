import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './EditableSection.css';

const EditableSection = ({ 
  children, 
  onSave, 
  sectionId, 
  editMode = false,
  className = '',
  showEditButton = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave();
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div 
      className={`editable-section ${className} ${isEditing ? 'editing' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {showEditButton && !isEditing && (isHovered || editMode) && (
        <button 
          className="edit-button"
          onClick={handleEdit}
          title="Edit this section"
        >
          <FaEdit />
        </button>
      )}
      {isEditing && (
        <div className="edit-overlay">
          <div className="edit-controls">
            <button onClick={handleSave} className="save-btn" title="Save changes">
              <FaSave /> Save
            </button>
            <button onClick={handleCancel} className="cancel-btn" title="Cancel">
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableSection;
