import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function Leaderboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view leaderboard');
      navigate('/');
      return;
    }
    loadLeaderboard();
  }, [isAuthenticated]);

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      let guideProfileId = getGuideProfileId();
      
      if (!guideProfileId) {
        const status = await guiderService.status.get();
        if (status?.guideProfileId) {
          guideProfileId = status.guideProfileId;
          localStorage.setItem('guideProfileId', guideProfileId.toString());
        } else {
          throw new Error('No guide profile found.');
        }
      }
      
      const data = await guiderService.rank.getLeaderboard(guideProfileId);
      const leaderboardData = Array.isArray(data) ? data : (data?.data || []);
      setLeaderboard(leaderboardData);
      // Find current user's rank
      const userEntry = leaderboardData.find(entry => entry.guideProfileId === guideProfileId);
      if (userEntry) {
        setCurrentUserRank(userEntry.rank);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load leaderboard.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <SEOHead
        title="Leaderboard"
        description="View the top guides leaderboard"
        url={`${window.location.origin}/rank/leaderboard`}
      />

      <h1 className="mb-4">Leaderboard</h1>

      {currentUserRank && (
        <div className="alert alert-info mb-4">
          <i className="fas fa-info-circle me-2"></i>
          Your current rank: <strong>#{currentUserRank}</strong>
        </div>
      )}

      {leaderboard.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No leaderboard data available.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Guide Name</th>
                <th>Points</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.guideProfileId || index}>
                  <td>
                    {index === 0 && <i className="fas fa-trophy text-warning me-1"></i>}
                    {index === 1 && <i className="fas fa-medal text-secondary me-1"></i>}
                    {index === 2 && <i className="fas fa-award text-warning me-1"></i>}
                    #{entry.rank || index + 1}
                  </td>
                  <td>{entry.guideName || 'N/A'}</td>
                  <td>{entry.points || 0}</td>
                  <td>{entry.tier || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
