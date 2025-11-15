import React, { useEffect, useState } from 'react';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await guiderService.help.getAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <SEOHead
        title="Announcements"
        description="View platform announcements"
        url={`${window.location.origin}/help/announcements`}
      />

      <h1 className="mb-4">Announcements</h1>

      {announcements.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No announcements available.
        </div>
      ) : (
        <div className="row">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{announcement.title}</h5>
                  <p className="card-text">{announcement.content || announcement.description}</p>
                  <small className="text-muted">
                    {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : ''}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
