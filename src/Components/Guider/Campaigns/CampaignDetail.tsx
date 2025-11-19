import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function CampaignDetail() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view campaign details');
      navigate('/');
      return;
    }
    loadCampaign();
  }, [campaignId, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadCampaign = async () => {
    try {
      setLoading(true);
      let guideProfileId = getGuideProfileId();
      
      if (!guideProfileId) {
        const userId = user?.id || user?.userId;
        if (userId) {
          const profile = await guiderService.guides.getByUserId(userId);
          if (profile?.guideProfileId || profile?.id) {
            guideProfileId = profile.guideProfileId || profile.id;
            localStorage.setItem('guideProfileId', guideProfileId.toString());
          }
        }
        if (!guideProfileId) {
          throw new Error('No guide profile found.');
        }
      }
      
      // Note: Campaigns may be in a different service
      // For now, using placeholder - may need to check if there's a campaign service
      const data = null; // await guiderService.campaigns.getById(guideProfileId, parseInt(campaignId));
      setCampaign(data);
    } catch (error) {
      console.error('Error loading campaign:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load campaign.';
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

  if (!campaign) {
    return (
      <div className="alert alert-warning">
        <h4>Campaign Not Found</h4>
        <Link to="/campaigns" className="btn btn-primary">Back to Campaigns</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <SEOHead
        title={`Campaign - ${campaign.title || campaign.name}`}
        description={campaign.description}
        url={`${window.location.origin}/campaigns/${campaignId}`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{campaign.title || campaign.name}</h1>
        <Link to="/campaigns" className="btn btn-outline-secondary">
          Back to Campaigns
        </Link>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Campaign Details</h5>
              <p>{campaign.description}</p>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Status:</strong> {campaign.status || 'N/A'}</p>
                  <p><strong>Start Date:</strong> {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>End Date:</strong> {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Budget:</strong> ${campaign.budget || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6>Quick Links</h6>
              <Link
                to={`/campaigns/${campaignId}/invites`}
                className="btn btn-sm btn-outline-primary w-100 mb-2"
              >
                View Invites
              </Link>
              <Link
                to={`/campaigns/${campaignId}/milestones`}
                className="btn btn-sm btn-outline-primary w-100 mb-2"
              >
                View Milestones
              </Link>
              <Link
                to={`/campaigns/${campaignId}/deliverables`}
                className="btn btn-sm btn-outline-primary w-100 mb-2"
              >
                View Deliverables
              </Link>
              <Link
                to={`/campaigns/${campaignId}/chat`}
                className="btn btn-sm btn-outline-primary w-100 mb-2"
              >
                Chat
              </Link>
              <Link
                to={`/campaigns/${campaignId}/insights`}
                className="btn btn-sm btn-outline-primary w-100"
              >
                Insights
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
