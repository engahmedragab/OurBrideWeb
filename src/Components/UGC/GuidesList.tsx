import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';
import guiderService from '../../services/guiderService';

export default function GuidesList() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    niche: '',
    sort: 'most-viewed'
  });

  useEffect(() => {
    loadGuides();
  }, [filters]);

  const loadGuides = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to get public guides list
      // const data = await guiderService.public.getGuides(filters);
      // setGuides(data);
      setGuides([]);
    } catch (error) {
      console.error('Error loading guides:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <SEOHead
        title="Local Guides - OurBride"
        description="Discover local wedding guides sharing tips, reviews, and content"
        keywords="wedding guides, local guides, wedding tips, wedding content"
        url={`${window.location.origin}/guides`}
      />
      
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 mb-3">Local Guides</h1>
          <p className="lead">Discover talented local guides sharing wedding tips and content</p>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
          >
            <option value="">All Cities</option>
            {/* TODO: Add city options */}
          </select>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={filters.niche}
            onChange={(e) => setFilters({...filters, niche: e.target.value})}
          >
            <option value="">All Niches</option>
            <option value="makeup">Makeup</option>
            <option value="hair">Hair</option>
            <option value="photography">Photography</option>
            <option value="venues">Venues</option>
          </select>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={filters.sort}
            onChange={(e) => setFilters({...filters, sort: e.target.value})}
          >
            <option value="most-viewed">Most Viewed</option>
            <option value="most-active">Most Active</option>
            <option value="highest-tier">Highest Tier</option>
            <option value="most-content">Most Content</option>
            <option value="most-liked">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Guides Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : guides.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No guides found. Check back soon!</p>
        </div>
      ) : (
        <div className="row">
          {guides.map((guide) => (
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
                  <div className="d-flex justify-content-between text-muted small">
                    <span><i className="fas fa-eye me-1"></i>{guide.totalViews || 0} views</span>
                    <span><i className="fas fa-heart me-1"></i>{guide.totalLikes || 0} likes</span>
                    <span><i className="fas fa-video me-1"></i>{guide.contentCount || 0} videos</span>
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


