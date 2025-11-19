import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import communityService from '@/services/communityService';
import LikeButton from '@/Components/Community/Shared/LikeButton';
import FavoriteButton from '@/Components/Community/Shared/FavoriteButton';
import SEOHead from '@/Components/SEO/SEOHead';
import { toast } from 'react-toastify';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await communityService.posts.getById(parseInt(id));

      // Handle both ApiResult format and direct data format
      let postData = null;
      if (response) {
        if (response.data && !response.success) {
          postData = response.data;
        } else if (response.id) {
          postData = response;
        } else if (response.data && response.data.id) {
          postData = response.data;
        }
      }

      if (postData) {
        setPost(postData);
        setLikeCount(postData.likeCount || 0);
        // Increment view count
        await communityService.posts.incrementView(postData.id).catch(() => { });
        // Check like/favorite status if authenticated
        try {
          const [liked, favorited] = await Promise.all([
            communityService.posts.isLiked(postData.id),
            communityService.posts.isFavorite(postData.id),
          ]);
          // Handle response format
          setIsLiked(liked === true || (liked && liked.data === true) || false);
          setIsFavorite(favorited === true || (favorited && favorited.data === true) || false);
        } catch (e) {
          // Not authenticated or error
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (postId, newIsLiked) => {
    try {
      await communityService.posts.toggleLike(postId);
      setIsLiked(newIsLiked);
      setLikeCount(newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    }
  };

  const handleFavoriteToggle = async (postId, newIsFavorite) => {
    try {
      await communityService.posts.toggleFavorite(postId);
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

  if (!post) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Post Not Found</h4>
          <p>The post you're looking for doesn't exist.</p>
          <Link to="/community/posts" className="btn btn-primary">
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <SEOHead
        title={post.title}
        description={post.summary || ''}
        keywords={post.tags?.map(tag => tag.name).join(', ') || ''}
        image={post.image || ''}
        url={`${window.location.origin}/community/posts/${post.id}`}
        type="article"
      />
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
          <li className="breadcrumb-item"><Link to="/community/posts">Posts</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{post.title}</li>
        </ol>
      </nav>

      <article>
        <header className="mb-4">
          <h1 className="display-4">{post.title}</h1>
          {post.summary && <p className="lead">{post.summary}</p>}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              {post.user && (
                <small className="text-muted">
                  By {post.user.name || post.user.email || 'Unknown'}
                </small>
              )}
              {post.publishedAt && (
                <small className="text-muted ms-3">
                  Published {new Date(post.publishedAt).toLocaleDateString()}
                </small>
              )}
            </div>
            <div className="d-flex gap-2">
              <LikeButton
                contentId={post.id}
                contentType="post"
                initialLikeCount={likeCount}
                initialIsLiked={isLiked}
                onLikeToggle={handleLikeToggle}
                showCount={true}
              />
              <FavoriteButton
                contentId={post.id}
                contentType="post"
                initialIsFavorite={isFavorite}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </div>
          </div>
          <div className="d-flex gap-3 mb-3">
            <small className="text-muted">
              <i className="fas fa-eye me-1"></i>{post.viewCount || 0} views
            </small>
            {post.commentCount !== undefined && (
              <small className="text-muted">
                <i className="fas fa-comment me-1"></i>{post.commentCount || 0} comments
              </small>
            )}
          </div>
        </header>

        <div className="post-content mb-4">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <h5>Tags:</h5>
            <div className="d-flex flex-wrap gap-2">
              {post.tags.map((tag) => (
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

        {post.categories && post.categories.length > 0 && (
          <div className="mb-4">
            <h5>Categories:</h5>
            <div className="d-flex flex-wrap gap-2">
              {post.categories.map((category) => (
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

