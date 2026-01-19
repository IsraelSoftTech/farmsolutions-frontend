import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaReply, 
  FaTrash, 
  FaCheckCircle, 
  FaCircle,
  FaUser,
  FaPhone,
  FaTag,
  FaClock,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import api, { API_ENDPOINTS } from '../config/api';
import './AdminMessages.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread'
  const [error, setError] = useState('');

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError('');
      const unreadOnly = filter === 'unread' ? 'true' : 'false';
      const response = await api.get(`${API_ENDPOINTS.messages}?unreadOnly=${unreadOnly}`);
      
      console.log('[AdminMessages] API Response:', response);
      
      if (response.ok && response.data.success) {
        const messagesArray = response.data.data?.messages || response.data.data || [];
        console.log('[AdminMessages] Setting messages:', messagesArray);
        setMessages(Array.isArray(messagesArray) ? messagesArray : []);
      } else {
        console.warn('[AdminMessages] Response not successful:', response);
        setMessages([]);
      }
    } catch (err) {
      console.error('[AdminMessages] Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.messagesUnreadCount);
      if (response.ok && response.data.success) {
        setUnreadCount(response.data.data.count);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  // Fetch on mount and when filter changes, and set up periodic refresh
  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
    
    // Refresh both messages and unread count every 30 seconds
    const interval = setInterval(() => {
      fetchMessages();
      fetchUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Mark message as read
  const markAsRead = async (messageId) => {
    try {
      const response = await api.put(API_ENDPOINTS.messageMarkRead(messageId));
      if (response.ok && response.data.success) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        ));
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  // Mark message as unread
  const markAsUnread = async (messageId) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.messages}/${messageId}/unread`);
      if (response.ok && response.data.success) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, is_read: false } : msg
        ));
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Error marking message as unread:', err);
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      const response = await api.delete(API_ENDPOINTS.messageById(messageId));
      if (response.ok && response.data.success) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message');
    }
  };

  // Open reply in default email client (Gmail)
  const openReplyEmail = (message) => {
    // Mark as read when opening reply
    if (!message.is_read) {
      markAsRead(message.id);
    }
    
    // Create mailto link with pre-filled subject
    const subject = encodeURIComponent(`Re: Your inquiry about ${message.interest || 'Farmers Solutions'}`);
    const body = encodeURIComponent(
      `Dear ${message.name},\n\n` +
      `Thank you for contacting Farmers Solutions.\n\n` +
      `[Your reply message here]\n\n` +
      `Best regards,\n` +
      `Farmers Solutions Team`
    );
    
    const mailtoLink = `mailto:${message.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-messages">
      <div className="messages-header">
        <div className="header-top">
          <h2 className="messages-title">
            <FaEnvelope className="title-icon" />
            Messages
          </h2>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Messages
            </button>
            <button
              className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </button>
          </div>
        </div>
        <button className="refresh-btn" onClick={fetchMessages} disabled={loading}>
          {loading ? <FaSpinner className="spinner" /> : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner large" />
          <p>Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="empty-state">
          <FaEnvelope className="empty-icon" />
          <h3>No messages found</h3>
          <p>{filter === 'unread' ? 'All messages have been read.' : 'No contact messages yet.'}</p>
        </div>
      ) : (
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-card ${!message.is_read ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.is_read) {
                    markAsRead(message.id);
                  }
                }}
              >
                <div className="message-header">
                  <div className="message-status">
                    {message.is_read ? (
                      <FaCheckCircle className="read-icon" />
                    ) : (
                      <FaCircle className="unread-icon" />
                    )}
                  </div>
                  <div className="message-info">
                    <h3 className="message-name">{message.name}</h3>
                    <p className="message-email">{message.email}</p>
                  </div>
                  <div className="message-time">{formatDate(message.created_at)}</div>
                </div>
                
                {message.interest && (
                  <div className="message-interest">
                    <FaTag className="interest-icon" />
                    <span>{message.interest}</span>
                  </div>
                )}
                
                <p className="message-preview">
                  {message.message && message.message.length > 100 
                    ? `${message.message.substring(0, 100)}...` 
                    : message.message || 'No message content'}
                </p>
                
                <div className="message-actions">
                  <button
                    className="action-btn reply-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openReplyEmail(message);
                    }}
                    title="Reply via Email"
                  >
                    <FaReply />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(message.id);
                    }}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedMessage && (
            <div className="message-detail">
              <div className="detail-header">
                <h3>Message Details</h3>
                <button
                  className="close-detail-btn"
                  onClick={() => setSelectedMessage(null)}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="detail-content">
                <div className="detail-section">
                  <div className="detail-item">
                    <FaUser className="detail-icon" />
                    <div>
                      <label>Full Name</label>
                      <p>{selectedMessage.name}</p>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <div>
                      <label>Email Address</label>
                      <p>{selectedMessage.email}</p>
                    </div>
                  </div>
                  
                  {selectedMessage.phone && (
                    <div className="detail-item">
                      <FaPhone className="detail-icon" />
                      <div>
                        <label>Phone Number</label>
                        <p>{selectedMessage.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedMessage.interest && (
                    <div className="detail-item">
                      <FaTag className="detail-icon" />
                      <div>
                        <label>I'm interested in</label>
                        <p>{selectedMessage.interest}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <div>
                      <label>Received</label>
                      <p>{formatDate(selectedMessage.created_at)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <label>Message</label>
                  <div className="message-text">{selectedMessage.message || 'No message content'}</div>
                </div>
                
                <div className="detail-actions">
                  <button
                    className="btn-primary reply-detail-btn"
                    onClick={() => openReplyEmail(selectedMessage)}
                  >
                    <FaReply /> Reply via Email
                  </button>
                  {selectedMessage.is_read ? (
                    <button
                      className="btn-secondary"
                      onClick={() => markAsUnread(selectedMessage.id)}
                    >
                      Mark as Unread
                    </button>
                  ) : (
                    <button
                      className="btn-secondary"
                      onClick={() => markAsRead(selectedMessage.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    className="btn-danger"
                    onClick={() => deleteMessage(selectedMessage.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
