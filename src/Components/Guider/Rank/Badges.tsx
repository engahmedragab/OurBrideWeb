import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function Badges() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view badges');
      navigate('/');
      return;
    }
    loadBadges();
  }, [isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadBadges = async () => {
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
      
      // Badges may be part of profile or separate endpoint
      // For now, get profile which may contain badges
      const profile = await guiderService.guides.getById(guideProfileId);
      const data = profile?.badges || [];
      setBadges(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading badges:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load badges.';
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
        title="Badges"
        description="View your earned badges"
        url={`${window.location.origin}/rank/badges`}
      />

      <h1 className="mb-4">Badges</h1>

      {badges.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No badges earned yet.
        </div>
      ) : (
        <div className="row">
          {badges.map((badge) => (
            <div key={badge.id} className="col-md-3 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  {badge.iconUrl && (
                    <img
                      src={badge.iconUrl}
                      alt={badge.name}
                      style={{ width: '64px', height: '64px' }}
                      className="mb-3"
                    />
                  )}
                  <h5 className="card-title">{badge.name}</h5>
                  <p className="card-text text-muted small">{badge.description}</p>
                  {badge.earnedAt && (
                    <small className="text-muted">
                      Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                    </small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
