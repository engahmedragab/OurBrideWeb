import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function ContentList({ filter }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    status: filter || searchParams.get('status') || '',
    providerId: searchParams.get('providerId') || '',
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view your content');
      navigate('/');
      return;
    }
    loadContent();
  }, [page, filters, filter, isAuthenticated]);

  const getGuideProfileId = () => {
    // Try from user object first
    if (user?.guideProfileId) {
      return parseInt(user.guideProfileId);
    }
    // Try from localStorage
    const stored = localStorage.getItem('guideProfileId');
    if (stored) {
      return parseInt(stored);
    }
    return null;
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      const guideProfileId = getGuideProfileId();
      
      if (!guideProfileId) {
        // Try to get from user object
        const userId = user?.id || user?.userId;
        if (userId) {
          const profile = await guiderService.guides.getByUserId(userId);
          if (profile?.guideProfileId || profile?.id) {
            const id = profile.guideProfileId || profile.id;
            localStorage.setItem('guideProfileId', id.toString());
            await loadContentWithId(id);
            return;
          }
        }
        throw new Error('No guide profile found. Please complete onboarding.');
      }
      
      await loadContentWithId(guideProfileId);
    } catch (error) {
      console.error('Error loading content:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load content.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadContentWithId = async (guideProfileId) => {
      
    const params = {
      GuideProfileId: guideProfileId,
      PublicOnly: false,
      ...filters,
      page,
      pageSize: 20,
    };

    const data = await guiderService.ugcContent.getByGuide(guideProfileId, params);
    
    // Handle response format
    let contentData = [];
    if (data) {
      if (Array.isArray(data)) {
        contentData = data;
      } else if (data.data && Array.isArray(data.data)) {
        contentData = data.data;
      } else if (data.items && Array.isArray(data.items)) {
        contentData = data.items;
      }
    }
    
    setContent(contentData);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1);
  };

  const getFilterTitle = () => {
    switch (filter) {
      case 'drafts':
        return 'Drafts';
      case 'submitted':
        return 'Submitted';
      case 'published':
        return 'Published';
      case 'rejected':
        return 'Rejected';
      default:
        return 'All Content';
    }
  };

  if (loading && content.length === 0) {
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
        title={`Content - ${getFilterTitle()}`}
        description="Manage your content"
        url={`${window.location.origin}/content${filter ? `/${filter}` : ''}`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{getFilterTitle()}</h1>
        <Link to="/content/new" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Create Content
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="video">Video</option>
                <option value="photo">Photo</option>
                <option value="article">Article</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                value={filters.from}
                onChange={(e) => handleFilterChange('from', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                value={filters.to}
                onChange={(e) => handleFilterChange('to', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Provider ID</label>
              <input
                type="number"
                className="form-control"
                placeholder="Provider ID"
                value={filters.providerId}
                onChange={(e) => handleFilterChange('providerId', e.target.value)}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setFilters({
                    type: '',
                    status: filter || '',
                    providerId: '',
                    from: '',
                    to: '',
                  });
                  setPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <Link
            className={`nav-link ${!filter ? 'active' : ''}`}
            to="/content"
          >
            All
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${filter === 'drafts' ? 'active' : ''}`}
            to="/content/drafts"
          >
            Drafts
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${filter === 'submitted' ? 'active' : ''}`}
            to="/content/submitted"
          >
            Submitted
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${filter === 'published' ? 'active' : ''}`}
            to="/content/published"
          >
            Published
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${filter === 'rejected' ? 'active' : ''}`}
            to="/content/rejected"
          >
            Rejected
          </Link>
        </li>
      </ul>

      {/* Content List */}
      {content.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No content found.
        </div>
      ) : (
        <div className="row">
          {content.map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card h-100">
                {item.thumbnailUrl && (
                  <img
                    src={item.thumbnailUrl}
                    className="card-img-top"
                    alt={item.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/content/${item.id}`}>
                      {item.title || 'Untitled'}
                    </Link>
                  </h5>
                  <p className="card-text text-muted small">
                    {item.summary || item.description || 'No description'}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {item.status && (
                        <span className={`badge bg-${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      )}
                    </small>
                    <small className="text-muted">
                      {item.createdAt && new Date(item.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div className="card-footer">
                  <Link
                    to={`/content/${item.id}`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    View
                  </Link>
                  {item.status === 'draft' && (
                    <Link
                      to={`/content/${item.id}/edit`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Edit
                    </Link>
                  )}
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
    case 'published':
      return 'success';
    case 'submitted':
      return 'info';
    case 'rejected':
      return 'danger';
    case 'draft':
      return 'secondary';
    default:
      return 'secondary';
  }
}
