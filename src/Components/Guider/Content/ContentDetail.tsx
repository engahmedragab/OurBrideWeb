import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guiderService } from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function ContentDetail() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { contentId } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view content');
      navigate('/');
      return;
    }
    loadContent();
  }, [contentId, isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      const guideProfileId = getGuideProfileId();
      if (!guideProfileId) {
        const userId = user?.id || user?.userId;
        if (userId) {
          const profile = await guiderService.guides.getByUserId(userId);
          if (profile?.guideProfileId || profile?.id) {
            const id = profile.guideProfileId || profile.id;
            localStorage.setItem('guideProfileId', id.toString());
          }
        }
      }
      
      // Get content by ID
      const data = await guiderService.ugcContent.getById(parseInt(contentId));
      setContent(data);
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

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="alert alert-warning">
        <h4>Content Not Found</h4>
        <Link to="/content" className="btn btn-primary">Back to Content</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <SEOHead
        title={content.title}
        description={content.description}
        url={`${window.location.origin}/content/${contentId}`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{content.title}</h1>
        <div>
          {content.status === 'draft' && (
            <Link
              to={`/content/${contentId}/edit`}
              className="btn btn-primary me-2"
            >
              <i className="fas fa-edit me-1"></i>Edit
            </Link>
          )}
          <Link to="/content" className="btn btn-outline-secondary">
            Back to List
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <div className="mb-3">
                <span className={`badge bg-${getStatusColor(content.status)}`}>
                  {content.status}
                </span>
              </div>
              
              {content.description && (
                <p className="lead">{content.description}</p>
              )}

              {content.content && (
                <div dangerouslySetInnerHTML={{ __html: content.content }} />
              )}

              {content.media && content.media.length > 0 && (
                <div className="mt-4">
                  <h5>Media</h5>
                  <div className="row">
                    {content.media.map((media, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        {media.type?.startsWith('video') ? (
                          <video controls className="w-100" style={{ maxHeight: '400px' }}>
                            <source src={media.url} type={media.type} />
                          </video>
                        ) : (
                          <img
                            src={media.url}
                            alt={`${content.title} - ${index + 1}`}
                            className="img-fluid"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h6>Details</h6>
              <p><strong>Type:</strong> {content.type}</p>
              <p><strong>Created:</strong> {content.createdAt && new Date(content.createdAt).toLocaleDateString()}</p>
              <p><strong>Views:</strong> {content.viewCount || 0}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h6>Actions</h6>
              <Link
                to={`/content/${contentId}/insights`}
                className="btn btn-sm btn-outline-primary w-100 mb-2"
              >
                <i className="fas fa-chart-line me-1"></i>View Insights
              </Link>
              {content.status === 'draft' && (
                <Link
                  to={`/content/${contentId}/edit`}
                  className="btn btn-sm btn-primary w-100"
                >
                  <i className="fas fa-edit me-1"></i>Edit Content
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
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
