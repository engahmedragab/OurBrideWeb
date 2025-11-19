import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import communityService from "@/services/communityService";
import LikeButton from "@/Components/Community/Shared/LikeButton";
import FavoriteButton from "@/Components/Community/Shared/FavoriteButton";
import SEOHead from "@/Components/SEO/SEOHead";
import { toast } from 'react-toastify';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      // Try to get by slug first, if it's a number, try by ID
      const blogId = parseInt(slug);
      const response = blogId
        ? await communityService.blogs.getById(blogId)
        : await communityService.blogs.getBySlug(slug);

      // Handle both ApiResult format and direct data format
      let blogData = null;
      if (response) {
        if (response.data && !response.success) {
          blogData = response.data;
        } else if (response.id) {
          blogData = response;
        } else if (response.data && response.data.id) {
          blogData = response.data;
        }
      }

      if (blogData) {
        setBlog(blogData);
        setLikeCount(blogData.likeCount || 0);
        // Increment view count
        await communityService.blogs.incrementView(blogData.id).catch(() => { });
        // Check like/favorite status if authenticated
        try {
          const [liked, favorited] = await Promise.all([
            communityService.blogs.isLiked(blogData.id),
            communityService.blogs.isFavorite(blogData.id),
          ]);
          // Handle response format
          setIsLiked(liked === true || (liked && liked.data === true) || false);
          setIsFavorite(favorited === true || (favorited && favorited.data === true) || false);
        } catch (e) {
          // Not authenticated or error
        }
      }
    } catch (error) {
      console.error('Error loading blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (blogId, newIsLiked) => {
    try {
      await communityService.blogs.toggleLike(blogId);
      setIsLiked(newIsLiked);
      setLikeCount(newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    }
  };

  const handleFavoriteToggle = async (blogId, newIsFavorite) => {
    try {
      await communityService.blogs.toggleFavorite(blogId);
      setIsFavorite(newIsFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite. Please try again.');
    }
  };

  if (loading) {
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

  if (!blog) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Blog Not Found</h4>
          <p>The blog you're looking for doesn't exist.</p>
          <Link to="/community/blogs" className="btn btn-primary">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <SEOHead
        title={blog.metaTitle || blog.title}
        description={blog.metaDescription || blog.summary || blog.excerpt}
        keywords={blog.keywords || ''}
        image={blog.image || blog.coverImage || ''}
        url={`${window.location.origin}/community/blogs/${blog.slug || blog.id}`}
        type="article"
      />
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
          <li className="breadcrumb-item"><Link to="/community/blogs">Blogs</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{blog.title}</li>
        </ol>
      </nav>

      <article>
        <header className="mb-4">
          <h1 className="display-4">{blog.title}</h1>
          {blog.summary && <p className="lead">{blog.summary}</p>}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              {blog.user && (
                <small className="text-muted">
                  By {blog.user.name || blog.user.email || 'Unknown'}
                </small>
              )}
              {blog.publishedAt && (
                <small className="text-muted ms-3">
                  Published {new Date(blog.publishedAt).toLocaleDateString()}
                </small>
              )}
            </div>
            <div className="d-flex gap-2">
              <LikeButton
                contentId={blog.id}
                contentType="blog"
                initialLikeCount={likeCount}
                initialIsLiked={isLiked}
                onLikeToggle={handleLikeToggle}
                showCount={true}
              />
              <FavoriteButton
                contentId={blog.id}
                contentType="blog"
                initialIsFavorite={isFavorite}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </div>
          </div>
          <div className="d-flex gap-3 mb-3">
            <small className="text-muted">
              <i className="fas fa-eye me-1"></i>{blog.viewCount || 0} views
            </small>
            {blog.commentCount !== undefined && (
              <small className="text-muted">
                <i className="fas fa-comment me-1"></i>{blog.commentCount || 0} comments
              </small>
            )}
            {blog.rate && (
              <small className="text-muted">
                <i className="fas fa-star me-1"></i>{blog.rate.toFixed(1)} rating
              </small>
            )}
          </div>
        </header>

        <div className="blog-content mb-4">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-4">
            <h5>Tags:</h5>
            <div className="d-flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/community/tags/${tag.slug || tag.id}`}
                  className="badge bg-secondary text-decoration-none"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {blog.categories && blog.categories.length > 0 && (
          <div className="mb-4">
            <h5>Categories:</h5>
            <div className="d-flex flex-wrap gap-2">
              {blog.categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/community/unified/category/${category.id}`}
                  className="badge bg-primary text-decoration-none"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

