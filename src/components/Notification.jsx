import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import './Notification.css';

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle />,
    error: <FaTimesCircle />,
    info: <FaInfoCircle />,
    warning: <FaExclamationTriangle />
  };

  const icon = icons[type] || icons.success;

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-icon">{icon}</div>
      <div className="notification-message">{message}</div>
      <button className="notification-close" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
};

export default Notification;
