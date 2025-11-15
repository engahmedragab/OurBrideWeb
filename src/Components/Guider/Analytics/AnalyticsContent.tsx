import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function AnalyticsContent() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view analytics');
      navigate('/');
      return;
    }
    loadAnalytics();
  }, [isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadAnalytics = async () => {
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
      
      const data = await guiderService.analytics.getContent(guideProfileId);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading content analytics:', error);
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
    <div className="container">
      <SEOHead
        title="Content Analytics"
        description="View content performance analytics"
        url={`${window.location.origin}/analytics/content`}
      />

      <h1 className="mb-4">Content Analytics</h1>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Performance Metrics</h5>
          <p className="text-muted">Content analytics data will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
