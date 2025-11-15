import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SEOHead from '../../SEO/SEOHead';
import { saveOnboardingData, getOnboardingData } from '../../../utils/onboardingStorage';

export default function OnboardingProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: '',
    languages: [],
    niches: [],
    role: 'LocalGuider', // Default role - must match LocalGuiderRole enum
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load saved data if exists
    const saved = getOnboardingData();
    if (saved) {
      setFormData(prev => ({
        ...prev,
        ...saved,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleNicheToggle = (niche) => {
    setFormData(prev => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter(n => n !== niche)
        : [...prev.niches, niche]
    }));
  };

  const handleNext = async () => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!formData.city) {
      toast.error('Please enter your city');
      return;
    }

    try {
      setSaving(true);
      // Save profile data to localStorage
      saveOnboardingData(formData);
      navigate('/onboarding/portfolio');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const commonLanguages = ['Arabic', 'English', 'French', 'Spanish'];
  const commonNiches = [
    'Bridal Makeup',
    'Wedding Photography',
    'Venue Selection',
    'Catering',
    'Floral Design',
    'Wedding Planning',
    'Fashion & Attire',
    'Entertainment',
  ];

  return (
    <div className="container">
      <SEOHead
        title="Onboarding - Profile"
        description="Complete your guide profile"
        url={`${window.location.origin}/onboarding/profile`}
      />

      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Complete Your Profile</h1>
          <p className="text-muted mb-4">Step 1 of 4: Tell us about yourself</p>

          {/* Progress Bar */}
          <div className="progress mb-4" style={{ height: '8px' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '25%' }}></div>
          </div>

          <form>
            {/* Full Name */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            {/* City */}
            <div className="mb-3">
              <label htmlFor="city" className="form-label">
                City <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                placeholder="Enter your city"
              />
            </div>

            {/* Languages */}
            <div className="mb-3">
              <label className="form-label">
                Languages
              </label>
              <div className="d-flex flex-wrap gap-2">
                {commonLanguages.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    className={`btn ${formData.languages.includes(lang) ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleLanguageToggle(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <small className="text-muted">Select all languages you speak</small>
            </div>

            {/* Niches */}
            <div className="mb-4">
              <label className="form-label">
                Specializations / Niches
              </label>
              <div className="d-flex flex-wrap gap-2">
                {commonNiches.map(niche => (
                  <button
                    key={niche}
                    type="button"
                    className={`btn ${formData.niches.includes(niche) ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => handleNicheToggle(niche)}
                  >
                    {niche}
                  </button>
                ))}
              </div>
              <small className="text-muted">Select your areas of expertise</small>
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Next: Portfolio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
