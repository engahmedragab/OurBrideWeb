import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function CampaignInsights() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { campaignId } = useParams();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view insights');
      navigate('/');
      return;
    }
    loadInsights();
  }, [campaignId, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadInsights = async () => {
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
      
      const data = await guiderService.campaigns.getInsights(guideProfileId, parseInt(campaignId));
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load insights.';
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
        title="Campaign Insights"
        description="View campaign performance insights"
        url={`${window.location.origin}/campaigns/${campaignId}/insights`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Campaign Insights</h1>
        <Link to={`/campaigns/${campaignId}`} className="btn btn-outline-secondary">
          Back to Campaign
        </Link>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{insights?.views || 0}</h3>
              <p className="text-muted mb-0">Total Views</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{insights?.clicks || 0}</h3>
              <p className="text-muted mb-0">Total Clicks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{insights?.conversions || 0}</h3>
              <p className="text-muted mb-0">Conversions</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{(insights?.ctr || 0).toFixed(2)}%</h3>
              <p className="text-muted mb-0">CTR</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Performance Over Time</h5>
          <p className="text-muted">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
