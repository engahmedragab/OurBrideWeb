import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function ContentInsights() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { contentId } = useParams();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view insights');
      navigate('/');
      return;
    }
    loadInsights();
  }, [contentId, isAuthenticated]);

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
      
      const data = await guiderService.ugcContent.getAnalytics(parseInt(contentId));
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
        title="Content Insights"
        description="View content performance insights"
        url={`${window.location.origin}/content/${contentId}/insights`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Content Insights</h1>
        <Link to={`/content/${contentId}`} className="btn btn-outline-secondary">
          Back to Content
        </Link>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{insights?.views || 0}</h3>
              <p className="text-muted mb-0">Views</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{insights?.clicks || 0}</h3>
              <p className="text-muted mb-0">Clicks</p>
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

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Performance Over Time</h5>
          <p className="text-muted">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
