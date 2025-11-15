import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';

export default function ServiceUGC() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [ugcContent, setUgcContent] = useState([]);
  const [topGuides, setTopGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceId) {
      loadServiceUGC();
    }
  }, [serviceId]);

  const loadServiceUGC = async () => {
    try {
      setLoading(true);
      // TODO: Implement API calls
      // const [serviceData, contentData, guidesData] = await Promise.all([
      //   fetchService(serviceId),
      //   fetchUGCByService(serviceId),
      //   fetchTopGuidesByService(serviceId)
      // ]);
      // setService(serviceData);
      // setUgcContent(contentData);
      // setTopGuides(guidesData);
      setService(null);
      setUgcContent([]);
      setTopGuides([]);
    } catch (error) {
      console.error('Error loading service UGC:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <SEOHead
        title={`${service?.name || 'Service'} - UGC Content - OurBride`}
        description={`UGC content and guide recommendations for ${service?.name || 'this service'}`}
        keywords={`${service?.name}, UGC, wedding guides, tips`}
        url={`${window.location.origin}/services/${serviceId}/ugc`}
      />
      
      {service && (
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-4 mb-3">{service.name}</h1>
            <p className="lead">UGC Content & Guide Recommendations</p>
          </div>
        </div>
      )}

      {/* Top Guides */}
      {topGuides.length > 0 && (
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="mb-4">Top Guide Recommendations</h2>
            <div className="row">
              {topGuides.map((guide) => (
                <div key={guide.id} className="col-md-3 mb-3">
                  <div className="card">
                    <div className="card-body text-center">
                      <img 
                        src={guide.avatar || '/default-avatar.png'} 
                        alt={guide.name}
                        className="rounded-circle mb-2"
                        style={{ width: '60px', height: '60px' }}
                      />
                      <h6 className="card-title mb-0">
                        <Link to={`/guides/${guide.handle}`}>{guide.name}</Link>
                      </h6>
                      <small className="text-muted">{guide.contentCount} videos</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UGC Content Grid */}
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">UGC Content</h2>
        </div>
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : ugcContent.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No UGC content available for this service yet.</p>
          </div>
        ) : (
          ugcContent.map((item) => (
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
                  {item.guide && (
                    <p className="card-text small">
                      by <Link to={`/guides/${item.guide.handle}`}>{item.guide.name}</Link>
                    </p>
                  )}
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


