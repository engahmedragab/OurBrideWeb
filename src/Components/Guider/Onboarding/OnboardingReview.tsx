import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { guiderService } from '../../../services/guiderService';
import { toast } from 'react-toastify';
import SEOHead from '../../SEO/SEOHead';
import { getOnboardingData, clearOnboardingData } from '../../../utils/onboardingStorage';

export default function OnboardingReview() {
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Load saved onboarding data for review
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    try {
      // Load saved data from localStorage
      const data = getOnboardingData();
      setOnboardingData(data);
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    }
  };

  const handleSubmit = async () => {
    if (!onboardingData) {
      toast.error('No onboarding data found. Please start over.');
      navigate('/onboarding/profile');
      return;
    }

    try {
      setSubmitting(true);
      // Prepare onboarding request
      const requestData = {
        fullName: onboardingData.fullName,
        email: onboardingData.email,
        phoneNumber: onboardingData.phoneNumber,
        city: onboardingData.city || null,
        role: onboardingData.role || 'LocalGuider',
        languages: onboardingData.languages || [],
        niches: onboardingData.niches || [],
        additionalNotes: onboardingData.verification?.additionalInfo || null,
        requiredDocuments: onboardingData.verification?.idDocument ? ['id'] : null,
        // Add other fields as needed
      };

      // Submit onboarding
      await guiderService.onboarding.create(requestData);
      
      // Clear saved data
      clearOnboardingData();
      
      toast.success('Onboarding submitted successfully!');
      navigate('/status');
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <SEOHead
        title="Onboarding - Review"
        description="Review and submit your onboarding application"
        url={`${window.location.origin}/onboarding/review`}
      />

      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Review & Submit</h1>
          <p className="text-muted mb-4">Step 4 of 4: Review your information</p>

          {/* Progress Bar */}
          <div className="progress mb-4" style={{ height: '8px' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '100%' }}></div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Profile Information</h5>
              <p><strong>Full Name:</strong> {onboardingData?.fullName || 'Not provided'}</p>
              <p><strong>Email:</strong> {onboardingData?.email || 'Not provided'}</p>
              <p><strong>Phone:</strong> {onboardingData?.phoneNumber || 'Not provided'}</p>
              <p><strong>City:</strong> {onboardingData?.city || 'Not provided'}</p>
              <p><strong>Languages:</strong> {onboardingData?.languages?.join(', ') || 'Not provided'}</p>
              <p><strong>Niches:</strong> {onboardingData?.niches?.join(', ') || 'Not provided'}</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Portfolio</h5>
              <p><strong>Links:</strong> {onboardingData?.portfolio?.links?.filter(l => l).length || 0} link(s)</p>
              <p><strong>Samples:</strong> {onboardingData?.portfolio?.samples?.length || 0} file(s)</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Verification</h5>
              <p><strong>ID Document:</strong> {onboardingData?.verification?.idDocument ? 'Uploaded' : 'Not uploaded'}</p>
              {onboardingData?.verification?.additionalInfo && (
                <p><strong>Additional Notes:</strong> {onboardingData.verification.additionalInfo}</p>
              )}
            </div>
          </div>

          <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Please review all information carefully. Once submitted, your application will be reviewed by our team.
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/onboarding/verification')}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-success btn-lg"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
