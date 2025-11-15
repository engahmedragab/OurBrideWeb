import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function ProfilePublic() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState({
    handle: '',
    bio: '',
    avatarUrl: '',
    coverUrl: '',
    socialLinks: {
      instagram: '',
      tiktok: '',
      youtube: '',
      website: '',
    },
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to edit your profile');
      navigate('/');
      return;
    }
    loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const guideProfileId = user?.guideProfileId || getGuideProfileIdFromStorage();

      if (!guideProfileId) {
        // Try to get from status
        const status = await guiderService.status.get();
        if (status?.guideProfileId) {
          localStorage.setItem('guideProfileId', status.guideProfileId.toString());
          const data = await guiderService.profile.getById(status.guideProfileId);
          setProfileData(data);
        } else {
          throw new Error('No guide profile found. Please complete onboarding.');
        }
      } else {
        const data = await guiderService.profile.getById(guideProfileId);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error loading public profile:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load profile. Please try again.';
      toast.error(errorMessage);

      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  const setProfileData = (data) => {
    setProfile({
      handle: data.handle || '',
      bio: data.bio || '',
      avatarUrl: data.avatarUrl || '',
      coverUrl: data.coverUrl || '',
      socialLinks: data.socialLinks || {
        instagram: '',
        tiktok: '',
        youtube: '',
        website: '',
      },
    });
  };

  const getGuideProfileIdFromStorage = () => {
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to save changes');
      return;
    }

    try {
      setSaving(true);
      const guideProfileId = user?.guideProfileId || getGuideProfileIdFromStorage();
      if (!guideProfileId) {
        throw new Error('No guide profile found. Please complete onboarding first.');
      }

      await guiderService.profile.update(guideProfileId, {
        handle: profile.handle,
        bio: profile.bio,
        socialLinks: profile.socialLinks,
        // Note: Avatar and cover uploads may need separate endpoints
      });

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save profile. Please try again.';
      toast.error(errorMessage);

      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setSaving(false);
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
        title="Public Profile"
        description="Edit your public profile"
        url={`${window.location.origin}/profile/public`}
      />

      <h1 className="mb-4">Public Profile</h1>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Public Information</h5>

              <div className="mb-3">
                <label htmlFor="handle" className="form-label">
                  Handle/Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="handle"
                  name="handle"
                  value={profile.handle}
                  onChange={handleInputChange}
                  placeholder="@yourhandle"
                />
                <small className="text-muted">Your unique handle for your profile URL</small>
              </div>

              <div className="mb-3">
                <label htmlFor="bio" className="form-label">
                  Bio
                </label>
                <textarea
                  className="form-control"
                  id="bio"
                  name="bio"
                  rows="4"
                  value={profile.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Avatar</label>
                <input type="file" className="form-control" accept="image/*" />
              </div>

              <div className="mb-3">
                <label className="form-label">Cover Image</label>
                <input type="file" className="form-control" accept="image/*" />
              </div>

              <h6 className="mt-4">Social Links</h6>

              <div className="mb-3">
                <label htmlFor="instagram" className="form-label">
                  Instagram
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="instagram"
                  name="social.instagram"
                  value={profile.socialLinks.instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="tiktok" className="form-label">
                  TikTok
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="tiktok"
                  name="social.tiktok"
                  value={profile.socialLinks.tiktok}
                  onChange={handleInputChange}
                  placeholder="https://tiktok.com/@yourprofile"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="youtube" className="form-label">
                  YouTube
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="youtube"
                  name="social.youtube"
                  value={profile.socialLinks.youtube}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="website" className="form-label">
                  Website
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="website"
                  name="social.website"
                  value={profile.socialLinks.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
