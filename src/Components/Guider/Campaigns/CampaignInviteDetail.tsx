import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function CampaignInviteDetail() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { campaignId, inviteId } = useParams();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view invite details');
      navigate('/');
      return;
    }
    loadInvite();
  }, [campaignId, inviteId, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadInvite = async () => {
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
      
      const data = await guiderService.campaigns.getInviteById(guideProfileId, parseInt(campaignId), inviteId);
      setInvite(data);
    } catch (error) {
      console.error('Error loading invite:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load invite.';
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

  if (!invite) {
    return (
      <div className="alert alert-warning">
        <h4>Invite Not Found</h4>
        <Link to={`/campaigns/${campaignId}/invites`} className="btn btn-primary">Back to Invites</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <SEOHead
        title="Campaign Invite Details"
        description="View campaign invite details"
        url={`${window.location.origin}/campaigns/${campaignId}/invites/${inviteId}`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Invite Details</h1>
        <Link to={`/campaigns/${campaignId}/invites`} className="btn btn-outline-secondary">
          Back to Invites
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Invite #{invite.id}</h5>
          <p><strong>Status:</strong> {invite.status || 'N/A'}</p>
          {invite.message && <p><strong>Message:</strong> {invite.message}</p>}
          {invite.createdAt && (
            <p><strong>Received:</strong> {new Date(invite.createdAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
