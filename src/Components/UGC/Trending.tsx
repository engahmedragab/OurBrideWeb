import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';

export default function Trending() {
  const { type } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrending();
  }, [type]);

  const loadTrending = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to get trending items
      // const data = await fetchTrending(type || 'content');
      // setItems(data);
      setItems([]);
    } catch (error) {
      console.error('Error loading trending:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'guides':
        return 'Trending Guides';
      case 'offers':
        return 'Trending Offers';
      default:
        return 'Trending Content';
    }
  };

  return (
    <div className="container py-5">
      <SEOHead
        title={`${getTitle()} - OurBride`}
        description={`Discover trending ${type || 'content'} on OurBride`}
        keywords={`trending, ${type}, wedding, guides`}
        url={`${window.location.origin}/trending/${type || 'content'}`}
      />
      
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 mb-3">{getTitle()}</h1>
          <p className="lead">Discover what's trending this week</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-4">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link 
              className={`nav-link ${!type || type === 'content' ? 'active' : ''}`} 
              to="/trending/content"
            >
              Content
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${type === 'guides' ? 'active' : ''}`} 
              to="/trending/guides"
            >
              Guides
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${type === 'offers' ? 'active' : ''}`} 
              to="/trending/offers"
            >
              Offers
            </Link>
          </li>
        </ul>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No trending items found. Check back soon!</p>
        </div>
      ) : (
        <div className="row">
          {items.map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card h-100">
                {item.thumbnail && (
                  <Link to={item.type === 'guide' ? `/guides/${item.handle}` : `/content/${item.id}`}>
                    <img 
                      src={item.thumbnail} 
                      alt={item.title || item.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </Link>
                )}
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={item.type === 'guide' ? `/guides/${item.handle}` : `/content/${item.id}`}>
                      {item.title || item.name}
                    </Link>
                  </h5>
                  {item.description && <p className="card-text">{item.description}</p>}
                  <div className="d-flex justify-content-between text-muted small">
                    {item.views !== undefined && <span><i className="fas fa-eye me-1"></i>{item.views}</span>}
                    {item.likes !== undefined && <span><i className="fas fa-heart me-1"></i>{item.likes}</span>}
                    {item.trendingScore && <span><i className="fas fa-fire me-1"></i>{item.trendingScore}</span>}
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


