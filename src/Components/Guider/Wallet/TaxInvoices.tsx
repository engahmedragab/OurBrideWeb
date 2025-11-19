import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function TaxInvoices() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view tax invoices');
      navigate('/');
      return;
    }
    loadInvoices();
  }, [isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadInvoices = async () => {
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
      
      // Tax invoices may be part of payouts - get payouts with invoices
      const payouts = await guiderService.payouts.getRequestsByGuide(guideProfileId, { includeInvoices: true });
      // Extract invoices from payouts or use payouts as invoices
      const data = payouts || [];
      setInvoices(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading invoices:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load invoices.';
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
        title="Tax Invoices"
        description="View your tax invoices"
        url={`${window.location.origin}/wallet/tax-invoices`}
      />

      <h1 className="mb-4">Tax Invoices</h1>

      {invoices.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No tax invoices found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>#{invoice.invoiceNumber || invoice.id}</td>
                  <td>{invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>${(invoice.amount || 0).toFixed(2)}</td>
                  <td>
                    <a
                      href={invoice.downloadUrl}
                      className="btn btn-sm btn-outline-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
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
