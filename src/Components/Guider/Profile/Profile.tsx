import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view your profile');
      navigate('/');
      return;
    }
    loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userId = user?.id || user?.userId;
      const guideProfileId = user?.guideProfileId || getGuideProfileIdFromStorage();
      
      let data;
      if (guideProfileId) {
        data = await guiderService.profile.getById(guideProfileId);
        // Store for future use
        localStorage.setItem('guideProfileId', guideProfileId.toString());
      } else if (userId) {
        data = await guiderService.profile.getByUserId(userId);
        // If profile has guideProfileId, store it
        if (data?.id) {
          localStorage.setItem('guideProfileId', data.id.toString());
        }
      } else {
        // Try to get from status first
        const status = await guiderService.status.get();
        if (status?.guideProfileId) {
          localStorage.setItem('guideProfileId', status.guideProfileId.toString());
          data = await guiderService.profile.getById(status.guideProfileId);
        } else {
          throw new Error('No guide profile found. Please complete onboarding.');
        }
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load profile. Please try again.';
      toast.error(errorMessage);
      
      // If 401, redirect to login
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  const getGuideProfileIdFromStorage = () => {
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
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
        title="Profile"
        description="Manage your guide profile"
        url={`${window.location.origin}/profile`}
      />

      <h1 className="mb-4">Profile</h1>

      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            <Link to="/profile" className="list-group-item list-group-item-action active">
              Overview
            </Link>
            <Link to="/profile/public" className="list-group-item list-group-item-action">
              Public Profile
            </Link>
            <Link to="/profile/settings" className="list-group-item list-group-item-action">
              Settings
            </Link>
            <Link to="/profile/links" className="list-group-item list-group-item-action">
              Links
            </Link>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profile Overview</h5>
              {profile ? (
                <div>
                  <p><strong>Name:</strong> {profile.fullName || profile.name || 'N/A'}</p>
                  <p><strong>City:</strong> {profile.city || 'N/A'}</p>
                  <p><strong>Status:</strong> {profile.status || 'N/A'}</p>
                  <p><strong>Tier:</strong> {profile.tier || profile.tierName || 'N/A'}</p>
                  <p><strong>Handle:</strong> {profile.handle || 'N/A'}</p>
                  {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
                </div>
              ) : (
                <div className="alert alert-info">
                  <p>No profile data available. Please complete your profile setup.</p>
                  <Link to="/onboarding" className="btn btn-primary">Start Onboarding</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
