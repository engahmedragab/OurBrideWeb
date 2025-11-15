import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SEOHead from '../../SEO/SEOHead';
import { saveOnboardingData, getOnboardingData } from '../../../utils/onboardingStorage';

export default function OnboardingPortfolio() {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState({
    links: [''],
    samples: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load saved data if exists
    const saved = getOnboardingData();
    if (saved?.portfolio) {
      setPortfolio(saved.portfolio);
    }
  }, []);

  const handleLinkChange = (index, value) => {
    const newLinks = [...portfolio.links];
    newLinks[index] = value;
    setPortfolio(prev => ({ ...prev, links: newLinks }));
  };

  const addLink = () => {
    setPortfolio(prev => ({
      ...prev,
      links: [...prev.links, '']
    }));
  };

  const removeLink = (index) => {
    setPortfolio(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setPortfolio(prev => ({
      ...prev,
      samples: [...prev.samples, ...files]
    }));
  };

  const removeSample = (index) => {
    setPortfolio(prev => ({
      ...prev,
      samples: prev.samples.filter((_, i) => i !== index)
    }));
  };

  const handleNext = async () => {
    try {
      setSaving(true);
      // Save portfolio data to localStorage
      saveOnboardingData({ portfolio });
      navigate('/onboarding/verification');
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast.error('Failed to save portfolio. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <SEOHead
        title="Onboarding - Portfolio"
        description="Add your portfolio links and samples"
        url={`${window.location.origin}/onboarding/portfolio`}
      />

      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Add Your Portfolio</h1>
          <p className="text-muted mb-4">Step 2 of 4: Showcase your work</p>

          {/* Progress Bar */}
          <div className="progress mb-4" style={{ height: '8px' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '50%' }}></div>
          </div>

          {/* Portfolio Links */}
          <div className="mb-4">
            <label className="form-label">Portfolio Links</label>
            {portfolio.links.map((link, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://instagram.com/yourprofile or https://yourwebsite.com"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                />
                {portfolio.links.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeLink(index)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={addLink}
            >
              <i className="fas fa-plus me-1"></i>Add Another Link
            </button>
          </div>

          {/* Sample Uploads */}
          <div className="mb-4">
            <label className="form-label">Sample Work (Photos/Videos)</label>
            <input
              type="file"
              className="form-control"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
            />
            <small className="text-muted">Upload samples of your work (max 10 files)</small>

            {portfolio.samples.length > 0 && (
              <div className="mt-3">
                <div className="row">
                  {portfolio.samples.map((file, index) => (
                    <div key={index} className="col-md-3 mb-2">
                      <div className="card">
                        <div className="card-body p-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-truncate" style={{ maxWidth: '150px' }}>
                              {file.name}
                            </small>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeSample(index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/onboarding/profile')}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Next: Verification'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
