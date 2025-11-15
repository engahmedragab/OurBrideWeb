import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function PayoutDetail() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { payoutId } = useParams();
  const [payout, setPayout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view payout details');
      navigate('/');
      return;
    }
    loadPayout();
  }, [payoutId, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadPayout = async () => {
    try {
      setLoading(true);
      let guideProfileId = getGuideProfileId();
      
      if (!guideProfileId) {
        const status = await guiderService.status.get();
        if (status?.guideProfileId) {
          guideProfileId = status.guideProfileId;
          localStorage.setItem('guideProfileId', guideProfileId.toString());
        } else {
          throw new Error('No guide profile found.');
        }
      }
      
      const data = await guiderService.wallet.getPayoutById(guideProfileId, parseInt(payoutId));
      setPayout(data);
    } catch (error) {
      console.error('Error loading payout:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load payout.';
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

  if (!payout) {
    return (
      <div className="alert alert-warning">
        <h4>Payout Not Found</h4>
        <Link to="/wallet/payouts" className="btn btn-primary">Back to Payouts</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <SEOHead
        title="Payout Details"
        description="View payout details"
        url={`${window.location.origin}/wallet/payouts/${payoutId}`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Payout Details</h1>
        <Link to="/wallet/payouts" className="btn btn-outline-secondary">
          Back to Payouts
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Payout #{payout.id}</h5>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Amount:</strong> ${(payout.amount || 0).toFixed(2)}</p>
              <p><strong>Method:</strong> {payout.method || 'N/A'}</p>
              <p><strong>Status:</strong> {payout.status || 'N/A'}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Created:</strong> {payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Processed:</strong> {payout.processedAt ? new Date(payout.processedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          {payout.accountDetails && (
            <div className="mt-3">
              <strong>Account Details:</strong>
              <p className="text-muted">{payout.accountDetails}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
