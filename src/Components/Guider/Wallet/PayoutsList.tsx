import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function PayoutsList() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view payouts');
      navigate('/');
      return;
    }
    loadPayouts();
  }, [isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadPayouts = async () => {
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
      
      const data = await guiderService.payouts.getRequestsByGuide(guideProfileId);
      setPayouts(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading payouts:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load payouts.';
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
        title="Payouts"
        description="View your payout history"
        url={`${window.location.origin}/wallet/payouts`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Payouts</h1>
        <Link to="/wallet/payouts/new" className="btn btn-primary">
          Request Payout
        </Link>
      </div>

      {payouts.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No payouts found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id}>
                  <td>{payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>${(payout.amount || 0).toFixed(2)}</td>
                  <td>{payout.method || 'N/A'}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(payout.status)}`}>
                      {payout.status || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/wallet/payouts/${payout.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'failed':
      return 'danger';
    default:
      return 'secondary';
  }
}
