import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';

export default function ProviderUGC() {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [ugcContent, setUgcContent] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (providerId) {
      loadProviderUGC();
    }
  }, [providerId]);

  const loadProviderUGC = async () => {
    try {
      setLoading(true);
      // TODO: Implement API calls
      // const [providerData, contentData, creatorsData] = await Promise.all([
      //   fetchProvider(providerId),
      //   fetchUGCByProvider(providerId),
      //   fetchTopCreatorsByProvider(providerId)
      // ]);
      // setProvider(providerData);
      // setUgcContent(contentData);
      // setTopCreators(creatorsData);
      setProvider(null);
      setUgcContent([]);
      setTopCreators([]);
    } catch (error) {
      console.error('Error loading provider UGC:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <SEOHead
        title={`${provider?.name || 'Provider'} - UGC Content - OurBride`}
        description={`Videos and content about ${provider?.name || 'this provider'} created by local guides`}
        keywords={`${provider?.name}, UGC, wedding guides, reviews`}
        url={`${window.location.origin}/providers/${providerId}/ugc`}
      />
      
      {provider && (
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-4 mb-3">{provider.name}</h1>
            <p className="lead">UGC Content & Reviews</p>
          </div>
        </div>
      )}

      {/* Top Creators */}
      {topCreators.length > 0 && (
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="mb-4">Top Creators Promoting This Provider</h2>
            <div className="row">
              {topCreators.map((creator) => (
                <div key={creator.id} className="col-md-3 mb-3">
                  <div className="card">
                    <div className="card-body text-center">
                      <img 
                        src={creator.avatar || '/default-avatar.png'} 
                        alt={creator.name}
                        className="rounded-circle mb-2"
                        style={{ width: '60px', height: '60px' }}
                      />
                      <h6 className="card-title mb-0">
                        <Link to={`/guides/${creator.handle}`}>{creator.name}</Link>
                      </h6>
                      <small className="text-muted">{creator.contentCount} videos</small>
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
          <h2 className="mb-4">Videos About This Provider</h2>
        </div>
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : ugcContent.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No UGC content available for this provider yet.</p>
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


