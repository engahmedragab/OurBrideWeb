import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import communityService from '../../../services/communityService';
import LikeButton from '../Shared/LikeButton';
import FavoriteButton from '../Shared/FavoriteButton';
import { toast } from 'react-toastify';

export default function ReelDetail() {
  const { id } = useParams();
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    loadReel();
  }, [id]);

  const loadReel = async () => {
    try {
      setLoading(true);
      const response = await communityService.reels.getById(parseInt(id));
      
      // Handle both ApiResult format and direct data format
      let reelData = null;
      if (response) {
        if (response.data && !response.success) {
          reelData = response.data;
        } else if (response.id) {
          reelData = response;
        } else if (response.data && response.data.id) {
          reelData = response.data;
        }
      }
      
      if (reelData) {
        setReel(reelData);
        setLikeCount(reelData.likeCount || 0);
        // Increment view count
        await communityService.reels.incrementView(reelData.id).catch(() => {});
        // Check like/favorite status if authenticated
        try {
          const [liked, favorited] = await Promise.all([
            communityService.reels.isLiked(reelData.id),
            communityService.reels.isFavorite(reelData.id),
          ]);
          // Handle response format
          setIsLiked(liked === true || (liked && liked.data === true) || false);
          setIsFavorite(favorited === true || (favorited && favorited.data === true) || false);
        } catch (e) {
          // Not authenticated or error
        }
      }
    } catch (error) {
      console.error('Error loading reel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (reelId, newIsLiked) => {
    try {
      await communityService.reels.toggleLike(reelId);
      setIsLiked(newIsLiked);
      setLikeCount(newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    }
  };

  const handleFavoriteToggle = async (reelId, newIsFavorite) => {
    try {
      await communityService.reels.toggleFavorite(reelId);
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

  if (!reel) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Reel Not Found</h4>
          <p>The reel you're looking for doesn't exist.</p>
          <Link to="/community/reels" className="btn btn-primary">
            Back to Reels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
          <li className="breadcrumb-item"><Link to="/community/reels">Reels</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{reel.title}</li>
        </ol>
      </nav>

      <article>
        <div className="row">
          <div className="col-lg-8">
            <div className="reel-video-container mb-4">
              {reel.videoUrl ? (
                <video
                  controls
                  className="w-100"
                  style={{ maxHeight: '600px', backgroundColor: '#000' }}
                  poster={reel.thumbnailUrl}
                >
                  <source src={reel.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : reel.thumbnailUrl ? (
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="w-100"
                  style={{ maxHeight: '600px', objectFit: 'contain' }}
                />
              ) : (
                <div className="bg-secondary d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                  <i className="fas fa-video fa-3x text-white"></i>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-4">
            <header className="mb-4">
              <h1 className="h3">{reel.title}</h1>
              {reel.description && <p className="lead">{reel.description}</p>}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  {reel.user && (
                    <small className="text-muted">
                      By {reel.user.name || reel.user.email || 'Unknown'}
                    </small>
                  )}
                  {reel.publishedAt && (
                    <small className="text-muted ms-3">
                      {new Date(reel.publishedAt).toLocaleDateString()}
                    </small>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2 mb-3">
                <LikeButton
                  contentId={reel.id}
                  contentType="reel"
                  initialLikeCount={likeCount}
                  initialIsLiked={isLiked}
                  onLikeToggle={handleLikeToggle}
                  showCount={true}
                />
                <FavoriteButton
                  contentId={reel.id}
                  contentType="reel"
                  initialIsFavorite={isFavorite}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
              <div className="d-flex gap-3 mb-3">
                <small className="text-muted">
                  <i className="fas fa-eye me-1"></i>{reel.viewCount || 0} views
                </small>
                {reel.duration && (
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>{Math.floor(reel.duration / 60)}:{(reel.duration % 60).toString().padStart(2, '0')}
                  </small>
                )}
              </div>
            </header>

            {reel.tags && reel.tags.length > 0 && (
              <div className="mb-4">
                <h5>Tags:</h5>
                <div className="d-flex flex-wrap gap-2">
                  {reel.tags.map((tag) => (
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
          </div>
        </div>
      </article>
    </div>
  );
}

