import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function AffiliateOfferDetail() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { offerId } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view offer details');
      navigate('/');
      return;
    }
    loadOffer();
  }, [offerId, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadOffer = async () => {
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
      
      const data = await guiderService.affiliate.getOfferById(guideProfileId, parseInt(offerId));
      setOffer(data);
    } catch (error) {
      console.error('Error loading offer:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load offer.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOffer = async () => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to join offers');
      return;
    }

    try {
      const guideProfileId = getGuideProfileId();
      if (!guideProfileId) {
        throw new Error('No guide profile found.');
      }
      await guiderService.affiliate.joinOffer(guideProfileId, parseInt(offerId));
      toast.success('Successfully joined offer!');
      loadOffer();
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

  if (!offer) {
    return (
      <div className="alert alert-warning">
        <h4>Offer Not Found</h4>
        <Link to="/affiliate/offers" className="btn btn-primary">Back to Offers</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <SEOHead
        title={`Affiliate Offer - ${offer.title || offer.name}`}
        description={offer.description}
        url={`${window.location.origin}/affiliate/offers/${offerId}`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{offer.title || offer.name}</h1>
        <Link to="/affiliate/offers" className="btn btn-outline-secondary">
          Back to Offers
        </Link>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Offer Details</h5>
              <p>{offer.description}</p>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Commission Rate:</strong> {offer.commissionRate || 0}%</p>
                  <p><strong>Status:</strong> {offer.status || 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Category:</strong> {offer.category || 'N/A'}</p>
                  <p><strong>Valid Until:</strong> {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {offer.terms && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Terms & Conditions</h5>
                <div dangerouslySetInnerHTML={{ __html: offer.terms }} />
              </div>
            </div>
          )}
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6>Actions</h6>
              {offer.status !== 'joined' && (
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={handleJoinOffer}
                >
                  Join Offer
                </button>
              )}
              {offer.status === 'joined' && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle me-2"></i>
                  You've joined this offer
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
