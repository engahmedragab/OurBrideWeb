import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import communityService from '@/services/communityService';
import SEOHead from '@/Components/SEO/SEOHead';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      // Try to get by slug first, if it's a number, try by ID
      const articleId = parseInt(slug);
      const response = articleId 
        ? await communityService.articles.getById(articleId)
        : await communityService.articles.getBySlug(slug);
      
      // Handle both ApiResult format and direct data format
      let articleData = null;
      if (response) {
        if (response.data && !response.success) {
          articleData = response.data;
        } else if (response.id) {
          articleData = response;
        } else if (response.data && response.data.id) {
          articleData = response.data;
        }
      }
      
      if (articleData) {
        setArticle(articleData);
        // Increment view count
        await communityService.articles.incrementView(articleData.id).catch(() => {});
        // Check like/favorite status if authenticated
        try {
          const [liked, favorited] = await Promise.all([
            communityService.articles.isLiked(articleData.id),
            communityService.articles.isFavorite(articleData.id),
          ]);
          // Handle response format
          setIsLiked(liked === true || (liked && liked.data === true) || false);
          setIsFavorite(favorited === true || (favorited && favorited.data === true) || false);
        } catch (e) {
          // Not authenticated or error
        }
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!article) return;
    try {
      await communityService.articles.toggleLike(article.id);
      setIsLiked(!isLiked);
      if (article) {
        setArticle({
          ...article,
          likeCount: isLiked ? (article.likeCount || 1) - 1 : (article.likeCount || 0) + 1,
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavorite = async () => {
    if (!article) return;
    try {
      await communityService.articles.toggleFavorite(article.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
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

  if (!article) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Article Not Found</h4>
          <p>The article you're looking for doesn't exist.</p>
          <Link to="/community/articles" className="btn btn-primary">
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

    return (
        <div className="container my-5">
            <SEOHead
                title={article.metaTitle || article.title}
                description={article.metaDescription || article.summary || article.excerpt}
                keywords={article.keywords}
                image={article.media && article.media.length > 0 ? article.media[0].url : null}
                url={`${window.location.origin}/community/articles/${article.slug || article.id}`}
                type="article"
            />
            <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
          <li className="breadcrumb-item"><Link to="/community/articles">Articles</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{article.title}</li>
        </ol>
      </nav>

      <article>
        <header className="mb-4">
          <h1 className="display-4">{article.title}</h1>
          {article.summary && <p className="lead">{article.summary}</p>}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              {article.user && (
                <small className="text-muted">
                  By {article.user.name || article.user.email || 'Unknown'}
                </small>
              )}
              {article.publishedAt && (
                <small className="text-muted ms-3">
                  Published {new Date(article.publishedAt).toLocaleDateString()}
                </small>
              )}
            </div>
            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={handleLike}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <i className={`fas fa-heart ${isLiked ? 'fas' : 'far'}`}></i>
                <span className="ms-1">{article.likeCount || 0}</span>
              </button>
              <button
                className={`btn btn-sm ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={handleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <i className={`fas fa-star ${isFavorite ? 'fas' : 'far'}`}></i>
              </button>
            </div>
          </div>
          <div className="d-flex gap-3 mb-3">
            <small className="text-muted">
              <i className="fas fa-eye me-1"></i>{article.viewCount || 0} views
            </small>
            <small className="text-muted">
              <i className="fas fa-comment me-1"></i>{article.commentCount || 0} comments
            </small>
            {article.rate && (
              <small className="text-muted">
                <i className="fas fa-star me-1"></i>{article.rate.toFixed(1)} rating
              </small>
            )}
          </div>
        </header>

        <div className="article-content mb-4">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mb-4">
            <h5>Tags:</h5>
            <div className="d-flex flex-wrap gap-2">
              {article.tags.map((tag) => (
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

        {article.categories && article.categories.length > 0 && (
          <div className="mb-4">
            <h5>Categories:</h5>
            <div className="d-flex flex-wrap gap-2">
              {article.categories.map((category) => (
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

