import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function Status() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view your status');
      navigate('/');
      return;
    }
    loadStatus();
  }, [isAuthenticated]);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await guiderService.status.get();
      setStatus(data);
      
      // Store guideProfileId if available
      if (data?.guideProfileId) {
        localStorage.setItem('guideProfileId', data.guideProfileId.toString());
      }
    } catch (error) {
      console.error('Error loading status:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load status.';
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="badge bg-success">Approved</span>;
      case 'Pending':
        return <span className="badge bg-warning">Pending Review</span>;
      case 'Rejected':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container">
      <SEOHead
        title="Application Status"
        description="Check your guide application status"
        url={`${window.location.origin}/status`}
      />

      <h1 className="mb-4">Application Status</h1>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                {getStatusBadge(status?.status)}
              </div>
              
              <h3 className="mb-3">
                {status?.status === 'Approved' && 'Congratulations! Your application has been approved.'}
                {status?.status === 'Pending' && 'Your application is under review.'}
                {status?.status === 'Rejected' && 'Your application was not approved.'}
              </h3>

              {status?.status === 'Pending' && (
                <div className="alert alert-info">
                  <i className="fas fa-clock me-2"></i>
                  We're reviewing your application. You'll be notified once a decision is made.
                </div>
              )}

              {status?.status === 'Rejected' && status?.rejectionReason && (
                <div className="alert alert-danger">
                  <h5>Rejection Reason:</h5>
                  <p>{status.rejectionReason}</p>
                  <Link to="/onboarding" className="btn btn-primary">
                    Update Application
                  </Link>
                </div>
              )}

              {status?.status === 'Approved' && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle me-2"></i>
                  You can now start creating content and earning!
                  <div className="mt-3">
                    <Link to="/" className="btn btn-success me-2">
                      Go to Dashboard
                    </Link>
                    <Link to="/profile" className="btn btn-outline-primary">
                      Complete Profile
                    </Link>
                  </div>
                </div>
              )}

              {status?.submittedAt && (
                <p className="text-muted mt-3">
                  Submitted: {new Date(status.submittedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
