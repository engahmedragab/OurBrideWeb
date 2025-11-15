import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';
import guiderService from '../../services/guiderService';

export default function GuidePublicProfile() {
  const { handle } = useParams();
  const [guide, setGuide] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (handle) {
      loadGuide();
      loadContent();
    }
  }, [handle]);

  const loadGuide = async () => {
    try {
      setLoading(true);
      const data = await guiderService.profile.getByHandle(handle);
      setGuide(data);
    } catch (error) {
      console.error('Error loading guide:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    try {
      // TODO: Implement API call to get guide's public content
      // const data = await guiderService.public.getContentByGuide(handle);
      // setContent(data);
      setContent([]);
    } catch (error) {
      console.error('Error loading content:', error);
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

  if (!guide) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Guide not found</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <SEOHead
        title={`${guide.name} - Local Guide - OurBride`}
        description={guide.bio || `View ${guide.name}'s wedding guides and content`}
        keywords={`${guide.name}, wedding guide, ${guide.niches?.join(', ')}`}
        url={`${window.location.origin}/guides/${handle}`}
      />
      
      {/* Profile Header */}
      <div className="row mb-4">
        <div className="col-md-3 text-center">
          <img 
            src={guide.avatar || '/default-avatar.png'} 
            alt={guide.name}
            className="rounded-circle mb-3"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          <div className="mb-2">
            <span className="badge bg-primary fs-6">{guide.tier || 'Bronze'}</span>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="display-5 mb-3">{guide.name}</h1>
          <p className="lead">{guide.bio}</p>
          
          {/* Niches */}
          {guide.niches && guide.niches.length > 0 && (
            <div className="mb-3">
              {guide.niches.map((niche, idx) => (
                <span key={idx} className="badge bg-secondary me-2">{niche}</span>
              ))}
            </div>
          )}

          {/* Metrics */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="text-center p-3 bg-light rounded">
                <div className="h4 mb-0">{guide.totalViews || 0}</div>
                <small className="text-muted">Total Views</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-3 bg-light rounded">
                <div className="h4 mb-0">{guide.totalLikes || 0}</div>
                <small className="text-muted">Total Likes</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-3 bg-light rounded">
                <div className="h4 mb-0">{guide.contentCount || 0}</div>
                <small className="text-muted">Videos</small>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {guide.socialLinks && (
            <div className="mb-3">
              {guide.socialLinks.instagram && (
                <a href={guide.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary me-2">
                  <i className="fab fa-instagram me-1"></i>Instagram
                </a>
              )}
              {guide.socialLinks.tiktok && (
                <a href={guide.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary me-2">
                  <i className="fab fa-tiktok me-1"></i>TikTok
                </a>
              )}
              {guide.socialLinks.youtube && (
                <a href={guide.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary me-2">
                  <i className="fab fa-youtube me-1"></i>YouTube
                </a>
              )}
            </div>
          )}

          {/* CTAs */}
          <div>
            <a href="mailto:contact@our-bride.com?subject=Hire Guide" className="btn btn-primary me-2">
              <i className="fas fa-envelope me-1"></i>Hire Me
            </a>
            <Link to="/become-a-guide" className="btn btn-outline-primary">
              Become a Guide
            </Link>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="row mt-5">
        <div className="col-12">
          <h2 className="mb-4">Content</h2>
        </div>
        {content.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No content available yet.</p>
          </div>
        ) : (
          content.map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card">
                <Link to={`/content/${item.id}`}>
                  <img 
                    src={item.thumbnail || '/default-thumbnail.jpg'} 
                    alt={item.title}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                </Link>
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/content/${item.id}`}>{item.title}</Link>
                  </h5>
                  <div className="d-flex justify-content-between text-muted small">
                    <span><i className="fas fa-eye me-1"></i>{item.views || 0}</span>
                    <span><i className="fas fa-heart me-1"></i>{item.likes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


