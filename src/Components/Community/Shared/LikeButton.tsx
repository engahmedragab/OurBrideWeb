import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function LikeButton({ 
  contentId, 
  contentType, 
  initialLikeCount = 0, 
  initialIsLiked = false,
  onLikeToggle,
  className = '',
  showCount = true 
}) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);
      const newIsLiked = !isLiked;
      
      // Optimistic update
      setIsLiked(newIsLiked);
      setLikeCount(newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1));

      // Call the provided toggle function
      if (onLikeToggle) {
        await onLikeToggle(contentId, newIsLiked);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(initialLikeCount);
      toast.error('Failed to update like. Please try again.');
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${isLiked ? 'btn-danger' : 'btn-outline-danger'} ${className}`}
      onClick={handleLike}
      disabled={loading}
      title={isLiked ? 'Unlike' : 'Like'}
    >
      <i className={`fas fa-heart ${isLiked ? 'fas' : 'far'}`}></i>
      {showCount && <span className="ms-1">{likeCount}</span>}
    </button>
  );
}

