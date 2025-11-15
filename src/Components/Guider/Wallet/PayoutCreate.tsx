import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function PayoutCreate() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    method: 'bank',
    accountDetails: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to request payout');
      navigate('/');
      return;
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to request payout');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setSubmitting(true);
      const guideProfileId = getGuideProfileId();
      if (!guideProfileId) {
        throw new Error('No guide profile found.');
      }
      
      await guiderService.wallet.createPayout(guideProfileId, {
        ...formData,
        guideProfileId,
        amount: parseFloat(formData.amount),
      });
      toast.success('Payout request submitted successfully!');
      navigate('/wallet/payouts');
    } catch (error) {
      console.error('Error creating payout:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit payout request.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <SEOHead
        title="Request Payout"
        description="Request a payout"
        url={`${window.location.origin}/wallet/payouts/new`}
      />

      <h1 className="mb-4">Request Payout</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
            min="1"
            step="0.01"
            placeholder="Enter amount"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="method" className="form-label">
            Payout Method <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="method"
            name="method"
            value={formData.method}
            onChange={handleInputChange}
            required
          >
            <option value="bank">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="accountDetails" className="form-label">
            Account Details <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            id="accountDetails"
            name="accountDetails"
            rows="4"
            value={formData.accountDetails}
            onChange={handleInputChange}
            required
            placeholder="Enter your account details..."
          />
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/wallet/payouts')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
