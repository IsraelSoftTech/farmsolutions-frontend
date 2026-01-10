import React, { useState, useEffect } from 'react';
import './EditableField.css';

const EditableField = ({ 
  value, 
  onChange, 
  type = 'text', 
  multiline = false,
  placeholder = '',
  className = '',
  tag: Tag = 'span'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleBlur = () => {
    // Always sync value on blur
    if (editValue !== value) {
      onChange(editValue);
    }
    setIsEditing(false);
  };

  // Sync value when prop changes (when parent updates it)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Handle change - update local state and immediately sync to parent
  const handleChange = (newValue) => {
    setEditValue(newValue);
    // Sync immediately so parent state is always up-to-date for save
    onChange(newValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          className={`editable-field ${className}`}
          value={editValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus
          rows={4}
        />
      );
    }
    return (
      <input
        type={type}
        className={`editable-field ${className}`}
        value={editValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus
      />
    );
  }

  return (
    <Tag 
      className={`editable-text ${className}`}
      onClick={handleClick}
      title="Click to edit"
    >
      {value || placeholder || 'Click to edit'}
    </Tag>
  );
};

export default EditableField;
