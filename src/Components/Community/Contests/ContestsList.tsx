import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from '../../../services/communityService';
import Pagination from '../Shared/Pagination';

export default function ContestsList() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [filter, setFilter] = useState('active'); // 'active', 'published', 'all'
  const pageSize = 20;

  useEffect(() => {
    loadContests();
  }, [page, filter]);

  const loadContests = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'active') {
        response = await communityService.contests.getActive(page, pageSize);
      } else if (filter === 'published') {
        response = await communityService.contests.getPublished(page, pageSize);
      } else {
        response = await communityService.contests.getAll(page, pageSize);
      }
      
      // Handle both ApiResult format and direct data format
      let contestsData = [];
      let paginationInfo = {};
      
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          contestsData = response.data;
          paginationInfo = response;
        } else if (Array.isArray(response)) {
          contestsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          contestsData = response.data.data;
          paginationInfo = response.data;
        }
      }
      
      setContests(contestsData);
      setTotalPages(paginationInfo.totalPages || 1);
      setHasNextPage(paginationInfo.hasNextPage || false);
      setHasPreviousPage(paginationInfo.hasPreviousPage || false);
    } catch (error) {
      console.error('Error loading contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isContestActive = (contest) => {
    if (!contest.isActive) return false;
    const now = new Date();
    const startDate = contest.startDate ? new Date(contest.startDate) : null;
    const endDate = contest.endDate ? new Date(contest.endDate) : null;
    
    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    return true;
  };

  if (loading && contests.length === 0) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 mb-3">Contests</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Contests</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${filter === 'active' ? 'active' : ''}`}
              onClick={() => { setFilter('active'); setPage(1); }}
            >
              Active Contests
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filter === 'published' ? 'active' : ''}`}
              onClick={() => { setFilter('published'); setPage(1); }}
            >
              Published
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filter === 'all' ? 'active' : ''}`}
              onClick={() => { setFilter('all'); setPage(1); }}
            >
              All Contests
            </button>
          </li>
        </ul>
      </div>

      {contests.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No contests found.
        </div>
      ) : (
        <>
          <div className="row">
            {contests.map((contest) => (
              <div key={contest.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/community/contests/${contest.id}`} className="text-decoration-none">
                        {contest.title}
                      </Link>
                    </h5>
                    <p className="card-text">{contest.description}</p>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        <i className="fas fa-eye me-1"></i>{contest.viewCount || 0}
                        <i className="fas fa-heart ms-3 me-1"></i>{contest.likeCount || 0}
                      </small>
                      {isContestActive(contest) && (
                        <span className="badge bg-success">Active</span>
                      )}
                    </div>
                    {contest.startDate && (
                      <small className="text-muted d-block">
                        Starts: {new Date(contest.startDate).toLocaleDateString()}
                      </small>
                    )}
                    {contest.endDate && (
                      <small className="text-muted d-block">
                        Ends: {new Date(contest.endDate).toLocaleDateString()}
                      </small>
                    )}
                    {contest.prizes && (
                      <div className="mt-2">
                        <small className="text-primary">
                          <i className="fas fa-trophy me-1"></i>Prizes Available
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </>
      )}
    </div>
  );
}

