import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function CampaignsList() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    providerId: searchParams.get('providerId') || '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view campaigns');
      navigate('/');
      return;
    }
    loadCampaigns();
  }, [page, filters, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadCampaigns = async () => {
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
        page,
        pageSize: 20,
      };
      const data = await guiderService.campaigns.getByGuide(guideProfileId, params);
      setCampaigns(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading campaigns:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load campaigns.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1);
  };

  if (loading && campaigns.length === 0) {
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
        title="Campaigns"
        description="Manage your campaigns"
        url={`${window.location.origin}/campaigns`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Campaigns</h1>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Provider ID</label>
              <input
                type="number"
                className="form-control"
                placeholder="Provider ID"
                value={filters.providerId}
                onChange={(e) => handleFilterChange('providerId', e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setFilters({ status: '', providerId: '' });
                  setPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No campaigns found.
        </div>
      ) : (
        <div className="row">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{campaign.title || campaign.name}</h5>
                  <p className="card-text text-muted">
                    {campaign.description || 'No description available'}
                  </p>
                  <div className="mb-2">
                    <span className={`badge bg-${getStatusColor(campaign.status)}`}>
                      {campaign.status || 'N/A'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {campaign.startDate && new Date(campaign.startDate).toLocaleDateString()}
                    </small>
                    <Link
                      to={`/campaigns/${campaign.id}`}
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
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'completed':
      return 'info';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
}
