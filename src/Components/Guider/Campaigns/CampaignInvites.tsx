import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function CampaignInvites() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { campaignId } = useParams();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view invites');
      navigate('/');
      return;
    }
    loadInvites();
  }, [campaignId, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadInvites = async () => {
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
      
      const data = await guiderService.campaigns.getInvites(guideProfileId, parseInt(campaignId));
      setInvites(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading invites:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load invites.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async (inviteId) => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to accept invites');
      return;
    }

    try {
      const guideProfileId = getGuideProfileId();
      if (!guideProfileId) {
        throw new Error('No guide profile found.');
      }
      await guiderService.campaigns.acceptInvite(guideProfileId, parseInt(campaignId), inviteId);
      toast.success('Invite accepted!');
      loadInvites();
    } catch (error) {
      console.error('Error accepting invite:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to accept invite.';
      toast.error(errorMessage);
    }
  };

  const handleRejectInvite = async (inviteId) => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to reject invites');
      return;
    }

    try {
      const guideProfileId = getGuideProfileId();
      if (!guideProfileId) {
        throw new Error('No guide profile found.');
      }
      await guiderService.campaigns.rejectInvite(guideProfileId, parseInt(campaignId), inviteId);
      toast.success('Invite rejected.');
      loadInvites();
    } catch (error) {
      console.error('Error rejecting invite:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reject invite.';
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
    <div className="container">
      <SEOHead
        title="Campaign Invites"
        description="View and manage campaign invites"
        url={`${window.location.origin}/campaigns/${campaignId}/invites`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Campaign Invites</h1>
        <Link to={`/campaigns/${campaignId}`} className="btn btn-outline-secondary">
          Back to Campaign
        </Link>
      </div>

      {invites.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No invites found.
        </div>
      ) : (
        <div className="row">
          {invites.map((invite) => (
            <div key={invite.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Invite #{invite.id}</h5>
                  <p className="text-muted">
                    Status: <span className={`badge bg-${getStatusColor(invite.status)}`}>
                      {invite.status || 'N/A'}
                    </span>
                  </p>
                  {invite.message && <p>{invite.message}</p>}
                  <div className="d-flex gap-2">
                    {invite.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleAcceptInvite(invite.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRejectInvite(invite.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <Link
                      to={`/campaigns/${campaignId}/invites/${invite.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </Link>
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

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'secondary';
  }
}
