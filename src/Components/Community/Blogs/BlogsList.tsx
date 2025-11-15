import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from '../../../services/communityService';
import ContentCard from '../Shared/ContentCard';
import Pagination from '../Shared/Pagination';

export default function BlogsList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    loadBlogs();
  }, [page]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await communityService.blogs.getPublished(page, pageSize);
      
      // Handle both ApiResult format and direct data format
      let blogsData = [];
      let paginationInfo = {};
      
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          blogsData = response.data;
          paginationInfo = response;
        } else if (Array.isArray(response)) {
          blogsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          blogsData = response.data.data;
          paginationInfo = response.data;
        }
      }
      
      setBlogs(blogsData);
      setTotalPages(paginationInfo.totalPages || 1);
      setHasNextPage(paginationInfo.hasNextPage || false);
      setHasPreviousPage(paginationInfo.hasPreviousPage || false);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLikeToggle = async (blogId, isLiked) => {
    try {
      await communityService.blogs.toggleLike(blogId);
      setBlogs(blogs.map(blog => 
        blog.id === blogId 
          ? { ...blog, isLiked, likeCount: isLiked ? (blog.likeCount || 0) + 1 : Math.max(0, (blog.likeCount || 1) - 1) }
          : blog
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavoriteToggle = async (blogId, isFavorite) => {
    try {
      await communityService.blogs.toggleFavorite(blogId);
      setBlogs(blogs.map(blog => 
        blog.id === blogId ? { ...blog, isFavorite } : blog
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading && blogs.length === 0) {
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
          <h1 className="display-4 mb-3">Blogs</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Blogs</li>
            </ol>
          </nav>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No blogs found.
        </div>
      ) : (
        <>
          <div className="row">
            {blogs.map((blog) => (
              <div key={blog.id} className="col-md-6 col-lg-4 mb-4">
                <ContentCard
                  content={blog}
                  contentType="blog"
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

