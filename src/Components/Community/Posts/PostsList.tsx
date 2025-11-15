import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import communityService from '../../../services/communityService';
import ContentCard from '../Shared/ContentCard';
import Pagination from '../Shared/Pagination';

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
          <h1 className="display-4 mb-3">Posts</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Posts</li>
            </ol>
          </nav>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No posts found.
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

