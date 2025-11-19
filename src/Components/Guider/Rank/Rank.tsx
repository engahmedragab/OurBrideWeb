import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function Rank() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view your rank');
      navigate('/');
      return;
    }
    loadRank();
  }, [isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadRank = async () => {
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
      
      // Get tier information
      const userId = user?.id || user?.userId;
      const tierCode = await guiderService.tiers.getCurrentTierCode(userId);
      const profile = await guiderService.guides.getById(guideProfileId);
      const data = {
        tier: tierCode || profile?.tier || 'N/A',
        points: profile?.points || 0,
        rank: profile?.rank || 'N/A',
      };
      setRank(data);
    } catch (error) {
      console.error('Error loading rank:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load rank.';
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
        title="Rank & Achievements"
        description="View your rank and achievements"
        url={`${window.location.origin}/rank`}
      />

      <h1 className="mb-4">Rank & Achievements</h1>

      <div className="row">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h2>#{rank?.rank || 'N/A'}</h2>
              <p className="text-muted mb-0">Your Rank</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h2>{rank?.points || 0}</h2>
              <p className="text-muted mb-0">Total Points</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h2>{rank?.tier || 'N/A'}</h2>
              <p className="text-muted mb-0">Current Tier</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Links</h5>
              <Link to="/rank/badges" className="btn btn-outline-primary w-100 mb-2">
                <i className="fas fa-award me-1"></i>View Badges
              </Link>
              <Link to="/rank/leaderboard" className="btn btn-outline-primary w-100">
                <i className="fas fa-trophy me-1"></i>View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
