import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import communityService from '@/services/communityService';
import ContentCard from '@/Components/Community/Shared/ContentCard';
import Pagination from '@/Components/Community/Shared/Pagination';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import SEOHead from '@/Components/SEO/SEOHead';

export default function PostsList() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await communityService.posts.getPublished(page, pageSize);
      
      // Handle both ApiResult format and direct data format
      let postsData = [];
      let paginationInfo = {};
      
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          postsData = response.data;
          paginationInfo = response;
        } else if (Array.isArray(response)) {
          postsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          postsData = response.data.data;
          paginationInfo = response.data;
        }
      }
      
      setPosts(postsData);
      setTotalPages(paginationInfo.totalPages || 1);
      setHasNextPage(paginationInfo.hasNextPage || false);
      setHasPreviousPage(paginationInfo.hasPreviousPage || false);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLikeToggle = async (postId, isLiked) => {
    try {
      await communityService.posts.toggleLike(postId);
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, isLiked, likeCount: isLiked ? (post.likeCount || 0) + 1 : Math.max(0, (post.likeCount || 1) - 1) }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavoriteToggle = async (postId, isFavorite) => {
    try {
      await communityService.posts.toggleFavorite(postId);
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, isFavorite } : post
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading && posts.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SEOHead
        title="Community Posts"
        description="Discover and engage with posts from our wedding community"
        keywords="community posts, wedding community, wedding discussions"
        image=""
        url={`${window.location.origin}/community/posts`}
      />
      <div className="posts-list-section">
        {/* Hero Section */}
        <HeroSection
          badge={{
            icon: "fas fa-comments",
            text: "Community Posts"
          }}
          title={
            <>
              Community <span className="text-gradient">Posts</span>
            </>
          }
          description="Discover and engage with posts shared by our vibrant wedding community. Share your thoughts, experiences, and connect with others."
          stats={[
            { number: posts.length > 0 ? `${posts.length}+` : "1000+", label: "Posts" },
            { number: totalPages > 1 ? `${totalPages}` : "1", label: "Pages" },
            { number: "4.9★", label: "Community Rating" },
          ]}
        />

        {/* Posts Grid Section */}
        <section className="posts-grid-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <SectionHeader
                  badge={{ icon: "fas fa-comments", text: "Latest" }}
                  title="Community Posts"
                  description="Browse through posts shared by our community members"
                />
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                  <div className="empty-state" style={{ padding: "60px 20px" }}>
                    <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                    <h3>No Posts Found</h3>
                    <p style={{ color: "#666" }}>Be the first to share a post with the community!</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  {posts.map((post) => (
                    <div key={post.id} className="col-md-6 col-lg-4 mb-4">
                      <ContentCard
                        content={post}
                        contentType="post"
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

