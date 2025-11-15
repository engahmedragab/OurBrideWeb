import React from 'react';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import FavoriteButton from './FavoriteButton';

export default function ContentCard({ 
  content, 
  contentType, 
  onLikeToggle, 
  onFavoriteToggle,
  showActions = true 
}) {
  const getDetailUrl = () => {
    const slug = content.slug || content.id;
    switch (contentType) {
      case 'article':
        return `/community/articles/${slug}`;
      case 'post':
        return `/community/posts/${content.id}`;
      case 'blog':
        return `/community/blogs/${slug}`;
      case 'reel':
        return `/community/reels/${content.id}`;
      case 'poll':
      case 'decisionGroup':
        return `/community/decision-groups/${content.id}`;
      case 'contest':
        return `/community/contests/${content.id}`;
      default:
        return '#';
    }
  };

  const getThumbnail = () => {
    if (content.media && content.media.length > 0) {
      return content.media[0].url || content.media[0].thumbnailUrl;
    }
    if (content.thumbnailUrl) return content.thumbnailUrl;
    if (content.imageUrl) return content.imageUrl;
    return null;
  };

  return (
    <div className="card h-100">
      {getThumbnail() && (
        <img
          src={getThumbnail()}
          className="card-img-top"
          alt={content.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          <Link to={getDetailUrl()} className="text-decoration-none">
            {content.title}
          </Link>
        </h5>
        <p className="card-text flex-grow-1">
          {content.summary || content.excerpt || content.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="d-flex gap-3">
            <small className="text-muted">
              <i className="fas fa-eye me-1"></i>{content.viewCount || 0}
            </small>
            <small className="text-muted">
              <i className="fas fa-heart me-1"></i>{content.likeCount || 0}
            </small>
            {content.commentCount !== undefined && (
              <small className="text-muted">
                <i className="fas fa-comment me-1"></i>{content.commentCount || 0}
              </small>
            )}
          </div>
          {content.publishedAt && (
            <small className="text-muted">
              {new Date(content.publishedAt).toLocaleDateString()}
            </small>
          )}
        </div>
        {showActions && (onLikeToggle || onFavoriteToggle) && (
          <div className="d-flex gap-2 mt-2">
            {onLikeToggle && (
              <LikeButton
                contentId={content.id}
                contentType={contentType}
                initialLikeCount={content.likeCount || 0}
                initialIsLiked={content.isLiked || false}
                onLikeToggle={onLikeToggle}
                showCount={true}
              />
            )}
            {onFavoriteToggle && (
              <FavoriteButton
                contentId={content.id}
                contentType={contentType}
                initialIsFavorite={content.isFavorite || false}
                onFavoriteToggle={onFavoriteToggle}
              />
            )}
          </div>
        )}
        {content.tags && content.tags.length > 0 && (
          <div className="mt-2">
            {content.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                to={`/community/tags/${tag.slug || tag.id}`}
                className="badge bg-secondary text-decoration-none me-1"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

