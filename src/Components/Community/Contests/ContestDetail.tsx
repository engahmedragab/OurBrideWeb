import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import communityService from '../../../services/communityService';
import LikeButton from '../Shared/LikeButton';
import { toast } from 'react-toastify';

export default function ContestDetail() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    displayName: '',
    bio: '',
  });

  useEffect(() => {
    loadContest();
    loadLeaderboard();
  }, [id]);

  const loadContest = async () => {
    try {
      setLoading(true);
      const response = await communityService.contests.getWithLeaderboard(parseInt(id));
      
      // Handle both ApiResult format and direct data format
      let contestData = null;
      if (response) {
        if (response.data && !response.success) {
          contestData = response.data;
        } else if (response.id) {
          contestData = response;
        } else if (response.data && response.data.id) {
          contestData = response.data;
        }
      }
      
      if (contestData) {
        setContest(contestData);
        setLikeCount(contestData.likeCount || 0);
        // Increment view count
        await communityService.contests.incrementView(contestData.id).catch(() => {});
        // Check like status if authenticated
        try {
          const liked = await communityService.contests.isLiked(contestData.id);
          setIsLiked(liked === true || (liked && liked.data === true) || false);
        } catch (e) {
          // Not authenticated or error
        }
      }
    } catch (error) {
      console.error('Error loading contest:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      const response = await communityService.contests.getLeaderboardStandings(parseInt(id));
      
      // Handle both ApiResult format and direct data format
      let leaderboardData = [];
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          leaderboardData = response.data;
        } else if (Array.isArray(response)) {
          leaderboardData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          leaderboardData = response.data.data;
        }
      }
      
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleRegister = async () => {
    if (!registrationData.displayName.trim()) {
      toast.error('Please enter a display name');
      return;
    }

    try {
      setRegistering(true);
      await communityService.contests.register(
        contest.id,
        registrationData.displayName,
        registrationData.bio
      );
      setIsRegistered(true);
      setShowRegistrationForm(false);
      toast.success('Successfully registered for the contest!');
    } catch (error) {
      console.error('Error registering for contest:', error);
      toast.error('Failed to register. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handleLikeToggle = async (contestId, newIsLiked) => {
    try {
      await communityService.contests.toggleLike(contestId);
      setIsLiked(newIsLiked);
      setLikeCount(newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    }
  };

  const isContestActive = () => {
    if (!contest || !contest.isActive) return false;
    const now = new Date();
    const startDate = contest.startDate ? new Date(contest.startDate) : null;
    const endDate = contest.endDate ? new Date(contest.endDate) : null;
    
    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    return true;
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

  if (!contest) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Contest Not Found</h4>
          <p>The contest you're looking for doesn't exist.</p>
          <Link to="/community/contests" className="btn btn-primary">
            Back to Contests
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
          <li className="breadcrumb-item"><Link to="/community/contests">Contests</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{contest.title}</li>
        </ol>
      </nav>

      <article>
        <header className="mb-4">
          <h1 className="display-4">{contest.title}</h1>
          {contest.description && <p className="lead">{contest.description}</p>}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              {contest.user && (
                <small className="text-muted">
                  By {contest.user.name || contest.user.email || 'Unknown'}
                </small>
              )}
              {contest.publishedAt && (
                <small className="text-muted ms-3">
                  Published {new Date(contest.publishedAt).toLocaleDateString()}
                </small>
              )}
            </div>
            <LikeButton
              contentId={contest.id}
              contentType="contest"
              initialLikeCount={likeCount}
              initialIsLiked={isLiked}
              onLikeToggle={handleLikeToggle}
              showCount={true}
            />
          </div>
          <div className="d-flex gap-3 mb-3 flex-wrap">
            <small className="text-muted">
              <i className="fas fa-eye me-1"></i>{contest.viewCount || 0} views
            </small>
            {isContestActive() && (
              <span className="badge bg-success">Active</span>
            )}
            {contest.startDate && (
              <small className="text-muted">
                Starts: {new Date(contest.startDate).toLocaleDateString()}
              </small>
            )}
            {contest.endDate && (
              <small className="text-muted">
                Ends: {new Date(contest.endDate).toLocaleDateString()}
              </small>
            )}
          </div>
        </header>

        {/* Contest Details */}
        <div className="mb-4">
          {contest.rules && (
            <div className="mb-3">
              <h3>Rules</h3>
              <div dangerouslySetInnerHTML={{ __html: contest.rules }} />
            </div>
          )}
          {contest.prizes && (
            <div className="mb-3">
              <h3>Prizes</h3>
              <div dangerouslySetInnerHTML={{ __html: contest.prizes }} />
            </div>
          )}
        </div>

        {/* Registration */}
        {isContestActive() && (
          <div className="mb-4">
            {!isRegistered ? (
              <div>
                {!showRegistrationForm ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowRegistrationForm(true)}
                  >
                    Register for Contest
                  </button>
                ) : (
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Register for Contest</h5>
                      <div className="mb-3">
                        <label htmlFor="displayName" className="form-label">
                          Display Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="displayName"
                          value={registrationData.displayName}
                          onChange={(e) =>
                            setRegistrationData({ ...registrationData, displayName: e.target.value })
                          }
                          placeholder="Enter your display name"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="bio" className="form-label">Bio</label>
                        <textarea
                          className="form-control"
                          id="bio"
                          rows="3"
                          value={registrationData.bio}
                          onChange={(e) =>
                            setRegistrationData({ ...registrationData, bio: e.target.value })
                          }
                          placeholder="Tell us about yourself (optional)"
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={handleRegister}
                          disabled={registering || !registrationData.displayName.trim()}
                        >
                          {registering ? 'Registering...' : 'Submit Registration'}
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowRegistrationForm(false);
                            setRegistrationData({ displayName: '', bio: '' });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-success">
                <i className="fas fa-check-circle me-2"></i>You are registered for this contest!
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className="mb-4">
          <h3>Leaderboard</h3>
          {loadingLeaderboard ? (
            <div className="text-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>No leaderboard data available yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Participant</th>
                    <th>Score</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id || index}>
                      <td>
                        <strong>
                          {index === 0 && <i className="fas fa-trophy text-warning me-1"></i>}
                          {index === 1 && <i className="fas fa-medal text-secondary me-1"></i>}
                          {index === 2 && <i className="fas fa-medal text-warning me-1"></i>}
                          {index + 1}
                        </strong>
                      </td>
                      <td>{entry.displayName || entry.participantName || 'Anonymous'}</td>
                      <td>{entry.score || 0}</td>
                      <td>{entry.points || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

