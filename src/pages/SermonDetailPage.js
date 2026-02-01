import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaShareAlt } from 'react-icons/fa';
import api from '../config/api';
import './SermonDetailPage.css';

const SermonDetailPage = () => {
  const { id } = useParams();
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSermon();
  }, [id]);

  const fetchSermon = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try multiple possible API endpoints
      let response;
      const endpoints = [
        `/sermons/${id}`,
        `/knowledge-content/sermons/${id}`,
        `/sermon/${id}`,
        `/knowledge-content/sermon/${id}`
      ];

      for (const endpoint of endpoints) {
        try {
          response = await api.get(endpoint);
          if (response.ok) {
            break;
          }
        } catch (err) {
          // Continue to next endpoint
          continue;
        }
      }

      if (response && response.ok) {
        // Handle different response structures
        const sermonData = response.data.data || response.data;
        setSermon(sermonData);
      } else {
        throw new Error('Sermon not found');
      }
    } catch (err) {
      console.error('Error fetching sermon:', err);
      setError(err.message || 'Failed to load sermon');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon?.title || 'Sermon',
          text: sermon?.description || '',
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback: show URL in prompt
        prompt('Copy this link:', shareUrl);
      }
    }
  };

  if (loading) {
    return (
      <div className="sermon-detail-page">
        <div className="container">
          <div className="sermon-loading">
            <p>Loading sermon...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="sermon-detail-page">
        <div className="container">
          <div className="sermon-not-found">
            <h1>Sermon Not Found</h1>
            <p>The sermon you're looking for doesn't exist or may have been removed.</p>
            <Link to="/knowledge" className="btn-primary">Back to Knowledge</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sermon-detail-page">
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/knowledge">Knowledge</Link>
            <span>/</span>
            <span>{sermon.title || 'Sermon'}</span>
          </nav>
        </div>
      </section>

      {/* Sermon Header */}
      <section className="sermon-header-section">
        <div className="container">
          <div className="sermon-header">
            <div className="sermon-meta">
              {sermon.date && (
                <div className="meta-item">
                  <FaCalendar />
                  <span>{new Date(sermon.date).toLocaleDateString()}</span>
                </div>
              )}
              {sermon.speaker && (
                <div className="meta-item">
                  <FaUser />
                  <span>{sermon.speaker}</span>
                </div>
              )}
            </div>
            
            <h1 className="sermon-title">{sermon.title}</h1>
            
            {sermon.subtitle && (
              <p className="sermon-subtitle">{sermon.subtitle}</p>
            )}

            <div className="sermon-actions">
              <button onClick={handleShare} className="btn-secondary">
                <FaShareAlt /> Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sermon Content */}
      <section className="sermon-content-section">
        <div className="container">
          <div className="sermon-content">
            {sermon.content && (
              <div 
                className="sermon-text"
                dangerouslySetInnerHTML={{ __html: sermon.content }}
              />
            )}
            
            {sermon.description && !sermon.content && (
              <div className="sermon-text">
                <p>{sermon.description}</p>
              </div>
            )}

            {sermon.videoUrl && (
              <div className="sermon-video">
                <iframe
                  src={sermon.videoUrl}
                  title={sermon.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {sermon.audioUrl && (
              <div className="sermon-audio">
                <audio controls>
                  <source src={sermon.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Content */}
      {sermon.relatedSermons && sermon.relatedSermons.length > 0 && (
        <section className="related-sermons-section">
          <div className="container">
            <h2 className="section-title">Related Sermons</h2>
            <div className="related-sermons-grid">
              {sermon.relatedSermons.map((related, index) => (
                <Link key={index} to={`/sermon/${related.id}`} className="related-sermon-card">
                  <h3>{related.title}</h3>
                  {related.date && (
                    <p className="related-date">{new Date(related.date).toLocaleDateString()}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SermonDetailPage;
