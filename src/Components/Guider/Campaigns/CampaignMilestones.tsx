import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function CampaignMilestones() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { campaignId } = useParams();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view milestones');
      navigate('/');
      return;
    }
    loadMilestones();
  }, [campaignId, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadMilestones = async () => {
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
      
      const data = await guiderService.campaigns.getMilestones(guideProfileId, parseInt(campaignId));
      setMilestones(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading milestones:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load milestones.';
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
        title="Campaign Milestones"
        description="View campaign milestones"
        url={`${window.location.origin}/campaigns/${campaignId}/milestones`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Campaign Milestones</h1>
        <Link to={`/campaigns/${campaignId}`} className="btn btn-outline-secondary">
          Back to Campaign
        </Link>
      </div>

      {milestones.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No milestones found.
        </div>
      ) : (
        <div className="timeline">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title">
                      Milestone {index + 1}: {milestone.title || milestone.name}
                    </h5>
                    <p className="card-text">{milestone.description}</p>
                    <p className="text-muted small">
                      Due Date: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <span className={`badge bg-${getStatusColor(milestone.status)}`}>
                    {milestone.status || 'N/A'}
                  </span>
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
