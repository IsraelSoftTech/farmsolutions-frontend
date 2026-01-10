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
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (onSave && !isSaving) {
      setIsSaving(true);
      try {
        await onSave();
        // Only exit edit mode if save was successful
        // onSave should handle showing success/error messages
        setIsEditing(false);
      } catch (error) {
        // Error handling is done in onSave, just keep edit mode open
        console.error('Save error in EditableSection:', error);
      } finally {
        setIsSaving(false);
      }
    } else if (!onSave) {
      // No save handler, just exit edit mode
      setIsEditing(false);
    }
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
            <button 
              onClick={handleSave} 
              className="save-btn" 
              title="Save changes"
              disabled={isSaving}
            >
              <FaSave /> {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={handleCancel} 
              className="cancel-btn" 
              title="Cancel"
              disabled={isSaving}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableSection;
