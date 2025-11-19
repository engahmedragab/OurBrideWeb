import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function WalletTransactions() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view transactions');
      navigate('/');
      return;
    }
    loadTransactions();
  }, [isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadTransactions = async () => {
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
      
      // Get wallet first, then get ledger
      const userId = user?.id || user?.userId;
      const wallet = await guiderService.wallets.getByUserId(userId);
      if (wallet?.id) {
        const data = await guiderService.wallets.getLedger(wallet.id);
        setTransactions(Array.isArray(data) ? data : (data?.data || []));
      } else {
        setTransactions([]);
      }
      setTransactions(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading transactions:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load transactions.';
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
        title="Wallet Transactions"
        description="View your wallet transactions"
        url={`${window.location.origin}/wallet/transactions`}
      />

      <h1 className="mb-4">Transactions</h1>

      {transactions.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No transactions found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>{transaction.type || 'N/A'}</td>
                  <td>{transaction.description || 'N/A'}</td>
                  <td className={transaction.amount >= 0 ? 'text-success' : 'text-danger'}>
                    ${Math.abs(transaction.amount || 0).toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge bg-${getStatusColor(transaction.status)}`}>
                      {transaction.status || 'N/A'}
                    </span>
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
    case 'failed':
      return 'danger';
    default:
      return 'secondary';
  }
}
