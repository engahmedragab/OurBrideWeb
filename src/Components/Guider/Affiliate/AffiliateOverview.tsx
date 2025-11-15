import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function AffiliateOverview() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalConversions: 0,
    totalEarnings: 0,
    activeLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view affiliate overview');
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
        const status = await guiderService.status.get();
        if (status?.guideProfileId) {
          guideProfileId = status.guideProfileId;
          localStorage.setItem('guideProfileId', guideProfileId.toString());
        } else {
          throw new Error('No guide profile found.');
        }
      }
      
      // const data = await guiderService.affiliate.getStats(guideProfileId);
      // setStats(data);
    } catch (error) {
      console.error('Error loading affiliate stats:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load stats.';
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
        title="Affiliate Overview"
        description="Manage your affiliate links and offers"
        url={`${window.location.origin}/affiliate`}
      />

      <h1 className="mb-4">Affiliate Overview</h1>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats.totalClicks}</h3>
              <p className="text-muted mb-0">Total Clicks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats.totalConversions}</h3>
              <p className="text-muted mb-0">Conversions</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>${stats.totalEarnings.toFixed(2)}</h3>
              <p className="text-muted mb-0">Total Earnings</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats.activeLinks}</h3>
              <p className="text-muted mb-0">Active Links</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Affiliate Links</h5>
              <p className="card-text">Manage your affiliate links</p>
              <Link to="/affiliate/links" className="btn btn-primary">
                View Links
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Offers</h5>
              <p className="card-text">Browse and join affiliate offers</p>
              <Link to="/affiliate/offers" className="btn btn-primary">
                View Offers
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Events</h5>
              <p className="card-text">Manage event affiliate links</p>
              <Link to="/affiliate/events" className="btn btn-primary">
                View Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
