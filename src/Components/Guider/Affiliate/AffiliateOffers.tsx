import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function AffiliateOffers() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view offers');
      navigate('/');
      return;
    }
    loadOffers();
  }, [filters, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadOffers = async () => {
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
      
      const params = {
        GuideProfileId: guideProfileId,
        ...filters,
      };
      const data = await guiderService.affiliate.getOffers(guideProfileId, params);
      setOffers(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading affiliate offers:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load offers.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOffer = async (offerId) => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to join offers');
      return;
    }

    try {
      const guideProfileId = getGuideProfileId();
      if (!guideProfileId) {
        throw new Error('No guide profile found.');
      }
      await guiderService.affiliate.joinOffer(guideProfileId, offerId);
      toast.success('Successfully joined offer!');
      loadOffers();
    } catch (error) {
      console.error('Error joining offer:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to join offer.';
      toast.error(errorMessage);
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
    <div className="container-fluid">
      <SEOHead
        title="Affiliate Offers"
        description="Browse and join affiliate offers"
        url={`${window.location.origin}/affiliate/offers`}
      />

      <h1 className="mb-4">Affiliate Offers</h1>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="joined">Joined</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">All Categories</option>
                <option value="wedding">Wedding</option>
                <option value="venue">Venue</option>
                <option value="catering">Catering</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => setFilters({ status: '', category: '' })}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Offers List */}
      {offers.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No offers found.
        </div>
      ) : (
        <div className="row">
          {offers.map((offer) => (
            <div key={offer.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{offer.title || offer.name}</h5>
                  <p className="card-text text-muted">
                    {offer.description || 'No description available'}
                  </p>
                  <div className="mb-2">
                    <span className="badge bg-primary">
                      Commission: {offer.commissionRate || 0}%
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Status: {offer.status || 'N/A'}
                    </small>
                    {offer.status !== 'joined' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleJoinOffer(offer.id)}
                      >
                        Join Offer
                      </button>
                    )}
                    {offer.status === 'joined' && (
                      <Link
                        to={`/affiliate/offers/${offer.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
