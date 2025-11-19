import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import communityService from "@/services/communityService";
import LikeButton from "@/Components/Community/Shared/LikeButton";
import { toast } from 'react-toastify';

export default function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    loadPoll();
  }, [id]);

  const loadPoll = async () => {
    try {
      setLoading(true);
      const response = await communityService.decisionGroups.getWithOptions(parseInt(id));

      // Handle both ApiResult format and direct data format
      let pollData = null;
      if (response) {
        if (response.data && !response.success) {
          pollData = response.data;
        } else if (response.id) {
          pollData = response;
        } else if (response.data && response.data.id) {
          pollData = response.data;
        }
      }

      if (pollData) {
        setPoll(pollData);
        setLikeCount(pollData.likeCount || 0);
        // Increment view count
        await communityService.decisionGroups.incrementView(pollData.id).catch(() => { });
        // Check like status if authenticated
        try {
          const liked = await communityService.decisionGroups.isLiked(pollData.id);
          setIsLiked(liked === true || (liked && liked.data === true) || false);
        } catch (e) {
          // Not authenticated or error
        }
      }
    } catch (error) {
      console.error('Error loading poll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption || voting) return;

    try {
      setVoting(true);
      await communityService.decisionGroups.castVote(poll.id, selectedOption.id, '');
      setHasVoted(true);
      toast.success('Vote submitted successfully!');
      // Reload poll to get updated vote counts
      await loadPoll();
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('Failed to submit vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  const handleLikeToggle = async (pollId, newIsLiked) => {
    try {
      await communityService.decisionGroups.toggleLike(pollId);
      setIsLiked(newIsLiked);
      setLikeCount(newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    }
  };

  const getTotalVotes = () => {
    if (!poll || !poll.options) return 0;
    return poll.options.reduce((sum, option) => sum + (option.voteCount || 0), 0);
  };

  const getPercentage = (votes) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
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

  if (!poll) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Poll Not Found</h4>
          <p>The poll you're looking for doesn't exist.</p>
          <Link to="/community/decision-groups" className="btn btn-primary">
            Back to Polls
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
          <li className="breadcrumb-item"><Link to="/community/decision-groups">Polls</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{poll.title}</li>
        </ol>
      </nav>

      <article>
        <header className="mb-4">
          <h1 className="display-4">{poll.title}</h1>
          {poll.description && <p className="lead">{poll.description}</p>}
          {poll.question && <p className="h5">{poll.question}</p>}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              {poll.user && (
                <small className="text-muted">
                  By {poll.user.name || poll.user.email || 'Unknown'}
                </small>
              )}
              {poll.publishedAt && (
                <small className="text-muted ms-3">
                  Published {new Date(poll.publishedAt).toLocaleDateString()}
                </small>
              )}
            </div>
            <LikeButton
              contentId={poll.id}
              contentType="poll"
              initialLikeCount={likeCount}
              initialIsLiked={isLiked}
              onLikeToggle={handleLikeToggle}
              showCount={true}
            />
          </div>
          <div className="d-flex gap-3 mb-3">
            <small className="text-muted">
              <i className="fas fa-eye me-1"></i>{poll.viewCount || 0} views
            </small>
            {poll.isActive && (
              <span className="badge bg-success">Active</span>
            )}
            {poll.endDate && (
              <small className="text-muted">
                Ends: {new Date(poll.endDate).toLocaleDateString()}
              </small>
            )}
          </div>
        </header>

        {poll.options && poll.options.length > 0 && (
          <div className="poll-options mb-4">
            <h3>Options</h3>
            {!hasVoted && poll.isActive ? (
              <div className="mb-3">
                {poll.options.map((option) => (
                  <div key={option.id} className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type={poll.allowMultipleVotes ? 'checkbox' : 'radio'}
                        name="pollOption"
                        id={`option-${option.id}`}
                        checked={selectedOption?.id === option.id}
                        onChange={() => setSelectedOption(option)}
                      />
                      <label className="form-check-label w-100" htmlFor={`option-${option.id}`}>
                        <div className="d-flex align-items-center">
                          {option.imageUrl && (
                            <img
                              src={option.imageUrl}
                              alt={option.text}
                              className="me-3"
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          )}
                          <div className="flex-grow-1">
                            <strong>{option.text}</strong>
                            {option.description && (
                              <p className="mb-0 text-muted small">{option.description}</p>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-primary"
                  onClick={handleVote}
                  disabled={!selectedOption || voting}
                >
                  {voting ? 'Submitting...' : 'Vote'}
                </button>
              </div>
            ) : (
              <div>
                {poll.options.map((option) => {
                  const votes = option.voteCount || 0;
                  const percentage = getPercentage(votes);
                  return (
                    <div key={option.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          {option.imageUrl && (
                            <img
                              src={option.imageUrl}
                              alt={option.text}
                              className="me-3"
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          )}
                          <div>
                            <strong>{option.text}</strong>
                            {option.description && (
                              <p className="mb-0 text-muted small">{option.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-end">
                          <strong>{votes} votes</strong>
                          <div className="text-muted small">{percentage}%</div>
                        </div>
                      </div>
                      <div className="progress" style={{ height: '30px' }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${percentage}%` }}
                          aria-valuenow={percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-3">
                  <strong>Total Votes: {getTotalVotes()}</strong>
                </div>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

