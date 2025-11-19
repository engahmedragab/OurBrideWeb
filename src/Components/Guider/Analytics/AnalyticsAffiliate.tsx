import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function AnalyticsAffiliate() {
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
      
      // Note: Affiliate analytics may be in a different service
      // For now, using placeholder - may need to check if there's an affiliate service
      const data = null; // await guiderService.affiliate.getAnalytics(guideProfileId);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading affiliate analytics:', error);
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
        title="Affiliate Analytics"
        description="View affiliate performance analytics"
        url={`${window.location.origin}/analytics/affiliate`}
      />

      <h1 className="mb-4">Affiliate Analytics</h1>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Performance Metrics</h5>
          <p className="text-muted">Affiliate analytics data will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
