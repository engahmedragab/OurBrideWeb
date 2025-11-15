import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from '../../../services/communityService';
import Pagination from '../Shared/Pagination';

export default function PollsList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [filter, setFilter] = useState('active'); // 'active', 'published', 'all'
  const pageSize = 20;

  useEffect(() => {
    loadPolls();
  }, [page, filter]);

  const loadPolls = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'active') {
        response = await communityService.decisionGroups.getActive(page, pageSize);
      } else if (filter === 'published') {
        response = await communityService.decisionGroups.getPublished(page, pageSize);
      } else {
        response = await communityService.decisionGroups.getAll(page, pageSize);
      }
      
      // Handle both ApiResult format and direct data format
      let pollsData = [];
      let paginationInfo = {};
      
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          pollsData = response.data;
          paginationInfo = response;
        } else if (Array.isArray(response)) {
          pollsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          pollsData = response.data.data;
          paginationInfo = response.data;
        }
      }
      
      setPolls(pollsData);
      setTotalPages(paginationInfo.totalPages || 1);
      setHasNextPage(paginationInfo.hasNextPage || false);
      setHasPreviousPage(paginationInfo.hasPreviousPage || false);
    } catch (error) {
      console.error('Error loading polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && polls.length === 0) {
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
          <h1 className="display-4 mb-3">Polls</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Polls</li>
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
              Active Polls
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
              All Polls
            </button>
          </li>
        </ul>
      </div>

      {polls.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No polls found.
        </div>
      ) : (
        <>
          <div className="row">
            {polls.map((poll) => (
              <div key={poll.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/community/decision-groups/${poll.id}`} className="text-decoration-none">
                        {poll.title}
                      </Link>
                    </h5>
                    <p className="card-text">{poll.description || poll.question}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="fas fa-eye me-1"></i>{poll.viewCount || 0}
                        <i className="fas fa-heart ms-3 me-1"></i>{poll.likeCount || 0}
                      </small>
                      {poll.isActive && (
                        <span className="badge bg-success">Active</span>
                      )}
                    </div>
                    {poll.endDate && (
                      <small className="text-muted d-block mt-2">
                        Ends: {new Date(poll.endDate).toLocaleDateString()}
                      </small>
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

