import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function FavoriteButton({ 
  contentId, 
  contentType, 
  initialIsFavorite = false,
  onFavoriteToggle,
  className = '',
  showText = false 
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);
      const newIsFavorite = !isFavorite;
      
      // Optimistic update
      setIsFavorite(newIsFavorite);

      // Call the provided toggle function
      if (onFavoriteToggle) {
        await onFavoriteToggle(contentId, newIsFavorite);
      }

      toast.success(newIsFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      // Revert on error
      setIsFavorite(!isFavorite);
      toast.error('Failed to update favorite. Please try again.');
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${isFavorite ? 'btn-warning' : 'btn-outline-warning'} ${className}`}
      onClick={handleFavorite}
      disabled={loading}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={`fas fa-star ${isFavorite ? 'fas' : 'far'}`}></i>
      {showText && (
        <span className="ms-1">{isFavorite ? 'Favorited' : 'Favorite'}</span>
      )}
    </button>
  );
}

