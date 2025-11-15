import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';
import guiderService from '../../services/guiderService';

export default function ContentViewer() {
  const { contentId } = useParams();
  const [content, setContent] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contentId) {
      loadContent();
      loadRelatedContent();
    }
  }, [contentId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to get public content
      // const data = await guiderService.public.getContent(contentId);
      // setContent(data);
      setContent(null);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedContent = async () => {
    try {
      // TODO: Implement API call to get related content
      // const data = await guiderService.public.getRelatedContent(contentId);
      // setRelatedContent(data);
      setRelatedContent([]);
    } catch (error) {
      console.error('Error loading related content:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Content not found</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <SEOHead
        title={content.title || 'Content - OurBride'}
        description={content.description || 'View this wedding guide content'}
        keywords={content.tags?.join(', ') || 'wedding, guide, content'}
        url={`${window.location.origin}/content/${contentId}`}
      />
      
      <div className="row">
        <div className="col-lg-8">
          {/* Video/Media Player */}
          <div className="mb-4">
            {content.type === 'video' ? (
              <video 
                src={content.videoUrl} 
                controls 
                className="w-100 rounded"
                style={{ maxHeight: '600px' }}
              />
            ) : (
              <img 
                src={content.imageUrl || content.thumbnail} 
                alt={content.title}
                className="w-100 rounded"
              />
            )}
          </div>

          {/* Content Info */}
          <div className="mb-4">
            <h1 className="display-5 mb-3">{content.title}</h1>
            
            {/* Guide Info */}
            {content.guide && (
              <div className="d-flex align-items-center mb-3">
                <img 
                  src={content.guide.avatar || '/default-avatar.png'} 
                  alt={content.guide.name}
                  className="rounded-circle me-3"
                  style={{ width: '50px', height: '50px' }}
                />
                <div>
                  <Link to={`/guides/${content.guide.handle}`} className="text-decoration-none">
                    <strong>{content.guide.name}</strong>
                  </Link>
                  <div className="text-muted small">{new Date(content.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="d-flex gap-4 mb-3 text-muted">
              <span><i className="fas fa-eye me-1"></i>{content.views || 0} views</span>
              <span><i className="fas fa-heart me-1"></i>{content.likes || 0} likes</span>
              <span><i className="fas fa-share me-1"></i>Share</span>
            </div>

            {/* Description */}
            <p className="lead">{content.description}</p>

            {/* Tagged Providers */}
            {content.taggedProviders && content.taggedProviders.length > 0 && (
              <div className="mb-3">
                <h5>Tagged Providers:</h5>
                {content.taggedProviders.map((provider) => (
                  <Link 
                    key={provider.id} 
                    to={`/providers/${provider.id}/ugc`}
                    className="badge bg-primary me-2 mb-2"
                  >
                    {provider.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Tagged Services */}
            {content.taggedServices && content.taggedServices.length > 0 && (
              <div className="mb-3">
                <h5>Tagged Services:</h5>
                {content.taggedServices.map((service) => (
                  <Link 
                    key={service.id} 
                    to={`/services/${service.id}/ugc`}
                    className="badge bg-secondary me-2 mb-2"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Offers */}
            {content.offers && content.offers.length > 0 && (
              <div className="mb-3">
                <h5>Related Offers:</h5>
                {content.offers.map((offer) => (
                  <Link 
                    key={offer.id} 
                    to={`/offers/${offer.id}`}
                    className="badge bg-success me-2 mb-2"
                  >
                    {offer.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Affiliate Link */}
            {content.affiliateLink && (
              <div className="mt-4">
                <a 
                  href={content.affiliateLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <i className="fas fa-external-link-alt me-1"></i>View Service
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          {/* More from Guide */}
          {content.guide && (
            <div className="mb-4">
              <h5>More from {content.guide.name}</h5>
              {relatedContent.length === 0 ? (
                <p className="text-muted small">No more content available</p>
              ) : (
                relatedContent.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/content/${item.id}`}
                    className="d-block mb-3 text-decoration-none"
                  >
                    <div className="card">
                      <img 
                        src={item.thumbnail || '/default-thumbnail.jpg'} 
                        alt={item.title}
                        className="card-img-top"
                        style={{ height: '120px', objectFit: 'cover' }}
                      />
                      <div className="card-body p-2">
                        <h6 className="card-title mb-0 small">{item.title}</h6>
                        <small className="text-muted">
                          <i className="fas fa-eye me-1"></i>{item.views || 0}
                        </small>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


