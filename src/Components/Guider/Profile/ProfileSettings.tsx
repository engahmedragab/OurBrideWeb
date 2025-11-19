import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';

export default function ProfileSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEarnings: false,
    },
    language: 'en',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // const data = await guiderService.profile.getSettings();
      // setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  const handleSelectChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // await guiderService.profile.updateSettings(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
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
        title="Profile Settings"
        description="Manage your profile settings"
        url={`${window.location.origin}/profile/settings`}
      />

      <h1 className="mb-4">Settings</h1>

      <div className="row">
        <div className="col-md-8">
          {/* Notifications */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Notifications</h5>
              
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.notifications.email}
                  onChange={() => handleToggle('notifications', 'email')}
                />
                <label className="form-check-label" htmlFor="emailNotifications">
                  Email Notifications
                </label>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="pushNotifications"
                  checked={settings.notifications.push}
                  onChange={() => handleToggle('notifications', 'push')}
                />
                <label className="form-check-label" htmlFor="pushNotifications">
                  Push Notifications
                </label>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="smsNotifications"
                  checked={settings.notifications.sms}
                  onChange={() => handleToggle('notifications', 'sms')}
                />
                <label className="form-check-label" htmlFor="smsNotifications">
                  SMS Notifications
                </label>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Privacy</h5>
              
              <div className="mb-3">
                <label htmlFor="profileVisibility" className="form-label">
                  Profile Visibility
                </label>
                <select
                  className="form-select"
                  id="profileVisibility"
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleSelectChange('privacy', 'profileVisibility', e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="followers">Followers Only</option>
                </select>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showEarnings"
                  checked={settings.privacy.showEarnings}
                  onChange={() => handleToggle('privacy', 'showEarnings')}
                />
                <label className="form-check-label" htmlFor="showEarnings">
                  Show Earnings Publicly
                </label>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Language</h5>
              
              <div className="mb-3">
                <label htmlFor="language" className="form-label">
                  Preferred Language
                </label>
                <select
                  className="form-select"
                  id="language"
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
