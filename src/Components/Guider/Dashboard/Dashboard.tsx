import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view your dashboard');
      navigate('/');
      return;
    }
    loadDashboard();
  }, [isAuthenticated]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const params = {};
      const data = await guiderService.dashboard.get(params);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load dashboard.';
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
    <div>
      <SEOHead
        title="Guide Dashboard"
        description="Your guide workspace dashboard"
        url={`${window.location.origin}`}
      />
      
      <h1 className="mb-4">Dashboard</h1>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Content</h5>
              <h3>{dashboardData?.totalContent || 0}</h3>
              <Link to="/content" className="btn btn-sm btn-primary">View All</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Campaigns</h5>
              <h3>{dashboardData?.activeCampaigns || 0}</h3>
              <Link to="/campaigns" className="btn btn-sm btn-primary">View All</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Earnings</h5>
              <h3>${dashboardData?.totalEarnings || 0}</h3>
              <Link to="/wallet" className="btn btn-sm btn-primary">View Wallet</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Rank</h5>
              <h3>{dashboardData?.currentTier || 'N/A'}</h3>
              <Link to="/rank" className="btn btn-sm btn-primary">View Rank</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <h3>Quick Actions</h3>
          <div className="d-flex gap-2 flex-wrap">
            <Link to="/content/new" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>Create Content
            </Link>
            <Link to="/affiliate/links/new" className="btn btn-success">
              <i className="fas fa-link me-2"></i>Create Affiliate Link
            </Link>
            <Link to="/campaigns/invites" className="btn btn-info">
              <i className="fas fa-envelope me-2"></i>View Invites
            </Link>
            <Link to="/analytics" className="btn btn-warning">
              <i className="fas fa-chart-line me-2"></i>View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

