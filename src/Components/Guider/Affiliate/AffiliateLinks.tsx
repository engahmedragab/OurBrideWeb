import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function AffiliateLinks() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view affiliate links');
      navigate('/');
      return;
    }
    loadLinks();
  }, [isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadLinks = async () => {
    try {
      setLoading(true);
      let guideProfileId = getGuideProfileId();
      
      if (!guideProfileId) {
        const status = await guiderService.status.get();
        if (status?.guideProfileId) {
          guideProfileId = status.guideProfileId;
          localStorage.setItem('guideProfileId', guideProfileId.toString());
        } else {
          throw new Error('No guide profile found. Please complete onboarding.');
        }
      }
      
      const data = await guiderService.affiliate.getLinks(guideProfileId);
      setLinks(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading affiliate links:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load affiliate links.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
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
    <div className="container-fluid">
      <SEOHead
        title="Affiliate Links"
        description="Manage your affiliate links"
        url={`${window.location.origin}/affiliate/links`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Affiliate Links</h1>
      </div>

      {links.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No affiliate links found. Create links from offers or events.
        </div>
      ) : (
        <div className="row">
          {links.map((link) => (
            <div key={link.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{link.title || link.offerName || 'Untitled Link'}</h5>
                  <p className="text-muted small mb-2">
                    <strong>Type:</strong> {link.type || 'N/A'}
                  </p>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={link.affiliateUrl || link.url}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => copyToClipboard(link.affiliateUrl || link.url)}
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">
                      Clicks: {link.clickCount || 0} | Conversions: {link.conversionCount || 0}
                    </small>
                    <Link
                      to={`/affiliate/links/${link.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
