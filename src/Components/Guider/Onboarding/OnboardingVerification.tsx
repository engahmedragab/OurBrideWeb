import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SEOHead from '../../SEO/SEOHead';
import { saveOnboardingData, getOnboardingData } from '../../../utils/onboardingStorage';

export default function OnboardingVerification() {
  const navigate = useNavigate();
  const [verification, setVerification] = useState({
    idDocument: null,
    additionalInfo: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load saved data if exists
    const saved = getOnboardingData();
    if (saved?.verification) {
      setVerification(saved.verification);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVerification(prev => ({ ...prev, idDocument: file }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVerification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = async () => {
    if (!verification.idDocument) {
      toast.error('Please upload an ID document');
      return;
    }

    try {
      setSaving(true);
      // Save verification data to localStorage
      saveOnboardingData({ verification });
      navigate('/onboarding/review');
    } catch (error) {
      console.error('Error saving verification:', error);
      toast.error('Failed to save verification. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <SEOHead
        title="Onboarding - Verification"
        description="Complete verification (KYC if required)"
        url={`${window.location.origin}/onboarding/verification`}
      />

      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Verification</h1>
          <p className="text-muted mb-4">Step 3 of 4: Verify your identity</p>

          {/* Progress Bar */}
          <div className="progress mb-4" style={{ height: '8px' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '75%' }}></div>
          </div>

          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            Please upload a valid ID document for verification purposes.
          </div>

          {/* ID Document Upload */}
          <div className="mb-4">
            <label htmlFor="idDocument" className="form-label">
              ID Document <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              id="idDocument"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              required
            />
            <small className="text-muted">
              Accepted formats: JPG, PNG, PDF (Max 5MB)
            </small>
            {verification.idDocument && (
              <div className="mt-2">
                <span className="badge bg-success">
                  <i className="fas fa-check me-1"></i>
                  {verification.idDocument.name}
                </span>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="mb-4">
            <label htmlFor="additionalInfo" className="form-label">
              Additional Information (Optional)
            </label>
            <textarea
              className="form-control"
              id="additionalInfo"
              name="additionalInfo"
              rows="4"
              value={verification.additionalInfo}
              onChange={handleInputChange}
              placeholder="Any additional information you'd like to provide..."
            />
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/onboarding/portfolio')}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              disabled={saving || !verification.idDocument}
            >
              {saving ? 'Saving...' : 'Next: Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
