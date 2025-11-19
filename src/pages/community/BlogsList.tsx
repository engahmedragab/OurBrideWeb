import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from '@/services/communityService';
import ContentCard from '@/Components/Community/Shared/ContentCard';
import Pagination from '@/Components/Community/Shared/Pagination';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';
import SEOHead from '@/Components/SEO/SEOHead';

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
      let paginationInfo: any = {};

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
    return <LoadingScreen />;
  }

  return (
    <>
      <SEOHead
        title="Community Blogs"
        description="Read insightful blogs from our wedding community"
        keywords="wedding blogs, community blogs, wedding tips, wedding advice"
        image=""
        url={`${window.location.origin}/community/blogs`}
      />
      <div className="blogs-list-section">
        {/* Hero Section */}
        <HeroSection
          badge={{
            icon: "fas fa-blog",
            text: "Community Blogs"
          }}
          title={
            <>
              Wedding <span className="text-gradient">Blogs</span>
            </>
          }
          description="Discover insightful blogs, tips, and stories from our wedding community. Learn from experts and share your experiences."
          stats={[
            { number: blogs.length > 0 ? `${blogs.length}+` : "100+", label: "Blogs" },
            { number: totalPages > 1 ? `${totalPages}` : "1", label: "Pages" },
            { number: "4.9★", label: "Average Rating" },
          ]}
        />

        {/* Blogs Grid Section */}
        <section className="blogs-grid-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <SectionHeader
                  badge={{ icon: "fas fa-blog", text: "Latest" }}
                  title="Community Blogs"
                  description="Explore blogs written by our community members and experts"
                />
              </div>
            </div>

            {blogs.length === 0 ? (
              <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                  <div className="empty-state" style={{ padding: "60px 20px" }}>
                    <i className="fas fa-inbox" style={{ fontSize: "4rem", color: "#ccc", marginBottom: "20px" }}></i>
                    <h3>No Blogs Found</h3>
                    <p style={{ color: "#666" }}>Check back soon for new blog posts!</p>
                  </div>
                </div>
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

