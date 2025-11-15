import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function CampaignDeliverables() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { campaignId } = useParams();
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view deliverables');
      navigate('/');
      return;
    }
    loadDeliverables();
  }, [campaignId, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadDeliverables = async () => {
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
      
      const data = await guiderService.campaigns.getDeliverables(guideProfileId, parseInt(campaignId));
      setDeliverables(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading deliverables:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load deliverables.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
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
        title="Campaign Deliverables"
        description="View campaign deliverables"
        url={`${window.location.origin}/campaigns/${campaignId}/deliverables`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Campaign Deliverables</h1>
        <Link to={`/campaigns/${campaignId}`} className="btn btn-outline-secondary">
          Back to Campaign
        </Link>
      </div>

      {deliverables.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No deliverables found.
        </div>
      ) : (
        <div className="row">
          {deliverables.map((deliverable) => (
            <div key={deliverable.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{deliverable.title || deliverable.name}</h5>
                  <p className="card-text">{deliverable.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge bg-${getStatusColor(deliverable.status)}`}>
                      {deliverable.status || 'N/A'}
                    </span>
                    <small className="text-muted">
                      Due: {deliverable.dueDate ? new Date(deliverable.dueDate).toLocaleDateString() : 'N/A'}
                    </small>
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

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'info';
    case 'pending':
      return 'warning';
    default:
      return 'secondary';
  }
}
