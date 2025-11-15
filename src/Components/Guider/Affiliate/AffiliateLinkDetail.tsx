import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function AffiliateLinkDetail() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { linkId } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view link details');
      navigate('/');
      return;
    }
    loadLink();
  }, [linkId, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadLink = async () => {
    try {
      setLoading(true);
      let guideProfileId = getGuideProfileId();
      
      if (!guideProfileId) {
        const status = await guiderService.status.get();
        if (status?.guideProfileId) {
          guideProfileId = status.guideProfileId;
          localStorage.setItem('guideProfileId', guideProfileId.toString());
        } else {
          throw new Error('No guide profile found.');
        }
      }
      
      const data = await guiderService.affiliate.getLinkById(parseInt(linkId));
      setLink(data);
    } catch (error) {
      console.error('Error loading affiliate link:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load link.';
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

  if (!link) {
    return (
      <div className="alert alert-warning">
        <h4>Link Not Found</h4>
        <Link to="/affiliate/links" className="btn btn-primary">Back to Links</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <SEOHead
        title={`Affiliate Link - ${link.title || 'Details'}`}
        description="View affiliate link details and performance"
        url={`${window.location.origin}/affiliate/links/${linkId}`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{link.title || 'Affiliate Link Details'}</h1>
        <Link to="/affiliate/links" className="btn btn-outline-secondary">
          Back to Links
        </Link>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Link Information</h5>
              <div className="mb-3">
                <label className="form-label">Affiliate URL</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={link.affiliateUrl || link.url}
                    readOnly
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => copyToClipboard(link.affiliateUrl || link.url)}
                  >
                    <i className="fas fa-copy me-1"></i>Copy
                  </button>
                </div>
              </div>
              <p><strong>Type:</strong> {link.type || 'N/A'}</p>
              {link.description && <p><strong>Description:</strong> {link.description}</p>}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Performance</h5>
              <div className="row">
                <div className="col-md-4">
                  <h3>{link.clickCount || 0}</h3>
                  <p className="text-muted mb-0">Total Clicks</p>
                </div>
                <div className="col-md-4">
                  <h3>{link.conversionCount || 0}</h3>
                  <p className="text-muted mb-0">Conversions</p>
                </div>
                <div className="col-md-4">
                  <h3>{(link.conversionRate || 0).toFixed(2)}%</h3>
                  <p className="text-muted mb-0">Conversion Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6>Quick Actions</h6>
              <button
                className="btn btn-sm btn-outline-primary w-100 mb-2"
                onClick={() => copyToClipboard(link.affiliateUrl || link.url)}
              >
                <i className="fas fa-copy me-1"></i>Copy Link
              </button>
              <Link
                to="/tools/share"
                className="btn btn-sm btn-outline-secondary w-100"
              >
                <i className="fas fa-share me-1"></i>Share Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
