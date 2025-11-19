import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from "@/services/communityService";
import ContentCard from "@/Components/Community/Shared/ContentCard";
import Pagination from "@/Components/Community/Shared/Pagination";
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import SEOHead from '@/Components/SEO/SEOHead';

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
      let paginationInfo: any = {};

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
    return <LoadingScreen />;
  }

  return (
    <>
      <SEOHead
        title="Community Reels"
        description="Watch and discover wedding reels from our community"
        keywords="wedding reels, community videos, wedding videos, short videos"
        image=""
        url={`${window.location.origin}/community/reels`}
      />
      <div className="reels-list-section">
        {/* Hero Section */}
        <HeroSection
          badge={{
            icon: "fas fa-video",
            text: "Community Reels"
          }}
          title={
            <>
              Wedding <span className="text-gradient">Reels</span>
            </>
          }
          description="Watch and discover short wedding videos from our community. Share your special moments and get inspired."
          stats={[
            { number: reels.length > 0 ? `${reels.length}+` : "500+", label: "Reels" },
            { number: totalPages > 1 ? `${totalPages}` : "1", label: "Pages" },
            { number: "4.9★", label: "Community Rating" },
          ]}
        />

        {/* View Mode Toggle */}
        <section className="view-mode-section" style={{ padding: "20px 0", background: "white" }}>
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-auto">
                <div className="btn-group shadow-sm" role="group">
                  <button
                    type="button"
                    className={`btn ${viewMode === 'grid' ? 'btn-main' : 'btn-outline-main'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <i className="fas fa-th me-2"></i> Grid
                  </button>
                  <button
                    type="button"
                    className={`btn ${viewMode === 'list' ? 'btn-main' : 'btn-outline-main'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="fas fa-list me-2"></i> List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reels Grid Section */}
        <section className="reels-grid-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <SectionHeader
                  badge={{ icon: "fas fa-video", text: "Latest" }}
                  title="Community Reels"
                  description="Browse through reels shared by our community members"
                />
              </div>
            </div>

            {reels.length === 0 ? (
              <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                  <div className="empty-state" style={{ padding: "60px 20px" }}>
                    <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                    <h3>No Reels Found</h3>
                    <p style={{ color: "#666" }}>Check back soon for new reels!</p>
                  </div>
                </div>
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
                  <div className="row justify-content-center mt-5">
                    <div className="col-auto">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        onPageChange={handlePageChange}
                        loading={loading}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

