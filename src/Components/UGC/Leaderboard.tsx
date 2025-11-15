import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    period: 'weekly',
    city: '',
    niche: ''
  });

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to get leaderboard
      // const data = await fetchLeaderboard(filter);
      // setLeaders(data);
      setLeaders([]);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <SEOHead
        title="Leaderboard - Top Guides - OurBride"
        description="Discover the top performing local guides on OurBride"
        keywords="leaderboard, top guides, wedding guides, rankings"
        url={`${window.location.origin}/leaderboard`}
      />
      
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 mb-3">Leaderboard</h1>
          <p className="lead">Top performing local guides</p>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={filter.period}
            onChange={(e) => setFilter({...filter, period: e.target.value})}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="all-time">All Time</option>
          </select>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={filter.city}
            onChange={(e) => setFilter({...filter, city: e.target.value})}
          >
            <option value="">All Cities</option>
            {/* TODO: Add city options */}
          </select>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={filter.niche}
            onChange={(e) => setFilter({...filter, niche: e.target.value})}
          >
            <option value="">All Niches</option>
            <option value="makeup">Makeup</option>
            <option value="hair">Hair</option>
            <option value="photography">Photography</option>
            <option value="venues">Venues</option>
          </select>
        </div>
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No leaders found. Check back soon!</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Guide</th>
                <th>Tier</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Content</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <tr key={leader.id}>
                  <td>
                    {index === 0 && <i className="fas fa-trophy text-warning"></i>}
                    {index === 1 && <i className="fas fa-trophy text-secondary"></i>}
                    {index === 2 && <i className="fas fa-trophy text-danger"></i>}
                    {index > 2 && <strong>#{index + 1}</strong>}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img 
                        src={leader.avatar || '/default-avatar.png'} 
                        alt={leader.name}
                        className="rounded-circle me-2"
                        style={{ width: '40px', height: '40px' }}
                      />
                      <Link to={`/guides/${leader.handle}`} className="text-decoration-none">
                        <strong>{leader.name}</strong>
                      </Link>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-primary">{leader.tier || 'Bronze'}</span>
                  </td>
                  <td>{leader.totalViews || 0}</td>
                  <td>{leader.totalLikes || 0}</td>
                  <td>{leader.contentCount || 0}</td>
                  <td>
                    <strong>{leader.score || 0}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


