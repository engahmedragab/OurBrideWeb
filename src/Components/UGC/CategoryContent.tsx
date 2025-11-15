import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';

export default function CategoryContent() {
  const { niche } = useParams();
  const [guides, setGuides] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (niche) {
      loadCategoryData();
    }
  }, [niche]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      // TODO: Implement API calls to get guides and content by niche
      // const [guidesData, contentData] = await Promise.all([
      //   fetchGuidesByNiche(niche),
      //   fetchContentByNiche(niche)
      // ]);
      // setGuides(guidesData);
      // setContent(contentData);
      setGuides([]);
      setContent([]);
    } catch (error) {
      console.error('Error loading category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (niche) => {
    const names = {
      makeup: 'Makeup',
      hair: 'Hair',
      photography: 'Photography',
      venues: 'Venues',
      catering: 'Catering',
      decoration: 'Decoration'
    };
    return names[niche] || niche;
  };

  return (
    <div className="container py-5">
      <SEOHead
        title={`${getCategoryName(niche)} Guides & Content - OurBride`}
        description={`Discover ${getCategoryName(niche)} guides and content on OurBride`}
        keywords={`${niche}, wedding, guides, content`}
        url={`${window.location.origin}/category/${niche}`}
      />
      
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 mb-3">{getCategoryName(niche)}</h1>
          <p className="lead">Guides and content specialized in {getCategoryName(niche)}</p>
        </div>
      </div>

      {/* Guides Section */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="mb-4">Specialized Guides</h2>
        </div>
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : guides.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No guides found in this category.</p>
          </div>
        ) : (
          guides.map((guide) => (
            <div key={guide.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={guide.avatar || '/default-avatar.png'} 
                      alt={guide.name}
                      className="rounded-circle me-3"
                      style={{ width: '60px', height: '60px' }}
                    />
                    <div>
                      <h5 className="card-title mb-0">
                        <Link to={`/guides/${guide.handle}`}>{guide.name}</Link>
                      </h5>
                      <span className="badge bg-primary">{guide.tier}</span>
                    </div>
                  </div>
                  <p className="card-text">{guide.bio}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Content Section */}
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Category Content</h2>
        </div>
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : content.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No content found in this category.</p>
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


