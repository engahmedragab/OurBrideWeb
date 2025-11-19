import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function AnalyticsOverview() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view analytics');
      navigate('/');
      return;
    }
    loadStats();
  }, [isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadStats = async () => {
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
      
      const data = await guiderService.guides.getAnalytics(guideProfileId);
      setStats(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load analytics.';
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
    <div className="container-fluid">
      <SEOHead
        title="Analytics Overview"
        description="View your analytics overview"
        url={`${window.location.origin}/analytics`}
      />

      <h1 className="mb-4">Analytics Overview</h1>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats?.totalViews || 0}</h3>
              <p className="text-muted mb-0">Total Views</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats?.totalClicks || 0}</h3>
              <p className="text-muted mb-0">Total Clicks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats?.totalConversions || 0}</h3>
              <p className="text-muted mb-0">Conversions</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{(stats?.averageCtr || 0).toFixed(2)}%</h3>
              <p className="text-muted mb-0">Average CTR</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Links</h5>
              <Link to="/analytics/content" className="btn btn-outline-primary w-100 mb-2">
                Content Analytics
              </Link>
              <Link to="/analytics/affiliate" className="btn btn-outline-primary w-100 mb-2">
                Affiliate Analytics
              </Link>
              <Link to="/analytics/campaigns" className="btn btn-outline-primary w-100">
                Campaign Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
