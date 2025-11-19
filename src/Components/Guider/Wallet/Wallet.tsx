import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function Wallet() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view your wallet');
      navigate('/');
      return;
    }
    loadWallet();
  }, [isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadWallet = async () => {
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
      
      // Get wallet by user ID
      const userId = user?.id || user?.userId;
      const data = await guiderService.wallets.getByUserId(userId);
      setWallet(data);
    } catch (error) {
      console.error('Error loading wallet:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load wallet.';
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
        title="Wallet"
        description="Manage your earnings and wallet"
        url={`${window.location.origin}/wallet`}
      />

      <h1 className="mb-4">Wallet</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3>${(wallet?.availableBalance || wallet?.balance || 0).toFixed(2)}</h3>
              <p className="text-muted mb-0">Available Balance</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3>${(wallet?.pendingBalance || wallet?.pending || 0).toFixed(2)}</h3>
              <p className="text-muted mb-0">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3>${(wallet?.totalEarnings || wallet?.totalCommissions || 0).toFixed(2)}</h3>
              <p className="text-muted mb-0">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <Link to="/wallet/transactions" className="btn btn-outline-primary w-100 mb-2">
                View Transactions
              </Link>
              <Link to="/wallet/payouts" className="btn btn-outline-primary w-100 mb-2">
                View Payouts
              </Link>
              <Link to="/wallet/payouts/new" className="btn btn-primary w-100">
                Request Payout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
