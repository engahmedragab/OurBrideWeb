import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';

export default function ProfileLinks() {
  const [links, setLinks] = useState({
    personalLandingLink: '',
    linkInBio: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      // const data = await guiderService.profile.getLinks();
      // setLinks(data);
    } catch (error) {
      console.error('Error loading links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // await guiderService.profile.updateLinks(links);
      toast.success('Links updated successfully!');
    } catch (error) {
      console.error('Error saving links:', error);
      toast.error('Failed to save links. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
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
        title="Profile Links"
        description="Manage your profile links"
        url={`${window.location.origin}/profile/links`}
      />

      <h1 className="mb-4">Profile Links</h1>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Personal Landing Link</h5>
              <p className="text-muted">Your unique profile link</p>
              
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={links.personalLandingLink || `${window.location.origin}/guide/@yourhandle`}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => copyToClipboard(links.personalLandingLink)}
                >
                  <i className="fas fa-copy"></i> Copy
                </button>
              </div>

              <Link to="/tools/share" className="btn btn-sm btn-outline-primary">
                <i className="fas fa-share me-1"></i>Share Link
              </Link>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Link-in-Bio</h5>
              <p className="text-muted">Your link-in-bio page URL</p>
              
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={links.linkInBio || `${window.location.origin}/guide/@yourhandle/bio`}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => copyToClipboard(links.linkInBio)}
                >
                  <i className="fas fa-copy"></i> Copy
                </button>
              </div>
            </div>
          </div>

          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            These links are automatically generated based on your profile handle. Update your handle in Public Profile to customize them.
          </div>
        </div>
      </div>
    </div>
  );
}
