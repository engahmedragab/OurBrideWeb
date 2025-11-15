import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from '../../../services/communityService';
import ContentCard from '../Shared/ContentCard';
import Pagination from '../Shared/Pagination';

export default function ReelsList() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const pageSize = 20;

  useEffect(() => {
    loadReels();
  }, [page]);

  const loadReels = async () => {
    try {
      setLoading(true);
      const response = await communityService.reels.getPublished(page, pageSize);
      
      // Handle both ApiResult format and direct data format
      let reelsData = [];
      let paginationInfo = {};
      
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          reelsData = response.data;
          paginationInfo = response;
        } else if (Array.isArray(response)) {
          reelsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          reelsData = response.data.data;
          paginationInfo = response.data;
        }
      }
      
      setReels(reelsData);
      setTotalPages(paginationInfo.totalPages || 1);
      setHasNextPage(paginationInfo.hasNextPage || false);
      setHasPreviousPage(paginationInfo.hasPreviousPage || false);
    } catch (error) {
      console.error('Error loading reels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLikeToggle = async (reelId, isLiked) => {
    try {
      await communityService.reels.toggleLike(reelId);
      setReels(reels.map(reel => 
        reel.id === reelId 
          ? { ...reel, isLiked, likeCount: isLiked ? (reel.likeCount || 0) + 1 : Math.max(0, (reel.likeCount || 1) - 1) }
          : reel
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavoriteToggle = async (reelId, isFavorite) => {
    try {
      await communityService.reels.toggleFavorite(reelId);
      setReels(reels.map(reel => 
        reel.id === reelId ? { ...reel, isFavorite } : reel
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading && reels.length === 0) {
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
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="display-4 mb-3">Reels</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Reels</li>
              </ol>
            </nav>
          </div>
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th"></i> Grid
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i> List
            </button>
          </div>
        </div>
      </div>

      {reels.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No reels found.
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' ? 'row' : ''}>
            {reels.map((reel) => (
              <div key={reel.id} className={viewMode === 'grid' ? 'col-md-6 col-lg-4 mb-4' : 'col-12 mb-4'}>
                <ContentCard
                  content={reel}
                  contentType="reel"
                  onLikeToggle={handleLikeToggle}
                  onFavoriteToggle={handleFavoriteToggle}
                  showActions={true}
                />
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

