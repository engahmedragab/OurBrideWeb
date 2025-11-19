import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import communityService from "@/services/communityService";
import ContentCard from "@/Components/Community/Shared/ContentCard";
import LikeButton from "@/Components/Community/Shared/LikeButton";
import FavoriteButton from "@/Components/Community/Shared/FavoriteButton";
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const params = useParams();
  const location = useLocation();
  // Determine profile type and ID from route params
  // Routes: /profiles/user/:id, /profiles/provider/:id, /profiles/bazaar-event/:id
  // Also support legacy: /profiles/user/:userGuid, /profiles/provider/:providerId, /profiles/bazaar-event/:eventId
  const path = location.pathname;
  let profileType = 'user';
  let id = null;

  if (path.includes('/user/')) {
    profileType = 'user';
    id = params.id || params.userGuid;
  } else if (path.includes('/provider/')) {
    profileType = 'provider';
    id = params.id || params.providerId;
  } else if (path.includes('/bazaar-event/')) {
    profileType = 'bazaar-event';
    id = params.id || params.eventId;
  }

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles', 'posts', 'blogs', 'reels', 'polls', 'contests'
  const [content, setContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [profileType, id]);

  useEffect(() => {
    if (profile) {
      loadContent();
    }
  }, [profile, activeTab]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      let response;

      switch (profileType) {
        case 'user':
          response = await communityService.profiles.getUserProfile(id);
          break;
        case 'provider':
          response = await communityService.profiles.getProviderProfile(parseInt(id));
          break;
        case 'bazaar-event':
          response = await communityService.profiles.getBazaarEventProfile(parseInt(id));
          break;
        default:
          return;
      }

      // Handle both ApiResult format and direct data format
      let profileData = null;
      if (response) {
        if (response.data && !response.success) {
          profileData = response.data;
        } else if (response.profileId || response.id) {
          profileData = response;
        } else if (response.data && (response.data.profileId || response.data.id)) {
          profileData = response.data;
        }
      }

      if (profileData) {
        setProfile(profileData);
        // Check like/follow/favorite status if authenticated
        try {
          const profileTypeEnum = profileType === 'user' ? 'User' :
            profileType === 'provider' ? 'Provider' : 'BazaarEvent';
          const profileId = profileType === 'user' ? null : parseInt(id);
          const profileUserId = profileType === 'user' ? id : null;

          const [liked, following, favorited] = await Promise.all([
            communityService.profiles.isLiked(profileTypeEnum, profileId, profileUserId),
            communityService.profiles.isFollowing(profileTypeEnum, profileId, profileUserId),
            communityService.profiles.isFavorite(profileTypeEnum, profileId, profileUserId),
          ]);

          setIsLiked(liked === true || (liked && liked.data === true) || false);
          setIsFollowing(following === true || (following && following.data === true) || false);
          setIsFavorite(favorited === true || (favorited && favorited.data === true) || false);
        } catch (e) {
          // Not authenticated or error
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    if (!profile) return;

    try {
      setLoadingContent(true);
      let response;

      switch (activeTab) {
        case 'articles':
          response = await communityService.articles.getByUserId(profile.profileIdGuid || profile.profileId || id);
          break;
        case 'posts':
          response = await communityService.posts.getByUserId(profile.profileIdGuid || profile.profileId || id);
          break;
        case 'blogs':
          response = await communityService.blogs.getByUserId(profile.profileIdGuid || profile.profileId || id);
          break;
        case 'reels':
          response = await communityService.reels.getByUserId(profile.profileIdGuid || profile.profileId || id);
          break;
        case 'polls':
          response = await communityService.decisionGroups.getByUserId(profile.profileIdGuid || profile.profileId || id);
          break;
        case 'contests':
          response = await communityService.contests.getByUserId(profile.profileIdGuid || profile.profileId || id);
          break;
        default:
          return;
      }

      // Handle both ApiResult format and direct data format
      let contentData = [];
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          contentData = response.data;
        } else if (Array.isArray(response)) {
          contentData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          contentData = response.data.data;
        }
      }

      setContent(contentData);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!profile) return;

    try {
      const profileTypeEnum = profileType === 'user' ? 'User' :
        profileType === 'provider' ? 'Provider' : 'BazaarEvent';
      const profileId = profileType === 'user' ? null : parseInt(id);
      const profileUserId = profileType === 'user' ? id : null;

      await communityService.profiles.toggleLike(profileTypeEnum, profileId, profileUserId);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    }
  };

  const handleFollowToggle = async () => {
    if (!profile) return;

    try {
      const profileTypeEnum = profileType === 'user' ? 'User' :
        profileType === 'provider' ? 'Provider' : 'BazaarEvent';
      const profileId = profileType === 'user' ? null : parseInt(id);
      const profileUserId = profileType === 'user' ? id : null;

      await communityService.profiles.toggleFollow(profileTypeEnum, profileId, profileUserId);
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Unfollowed' : 'Following');
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status. Please try again.');
    }
  };

  const handleFavoriteToggle = async () => {
    if (!profile) return;

    try {
      const profileTypeEnum = profileType === 'user' ? 'User' :
        profileType === 'provider' ? 'Provider' : 'BazaarEvent';
      const profileId = profileType === 'user' ? null : parseInt(id);
      const profileUserId = profileType === 'user' ? id : null;

      await communityService.profiles.toggleFavorite(profileTypeEnum, profileId, profileUserId);
      setIsFavorite(!isFavorite);
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

  if (!profile) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Profile Not Found</h4>
          <p>The profile you're looking for doesn't exist.</p>
          <Link to="/community" className="btn btn-primary">
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  const getProfileTypeLabel = () => {
    switch (profileType) {
      case 'user':
        return 'User Profile';
      case 'provider':
        return 'Provider Profile';
      case 'bazaar-event':
        return 'Event Profile';
      default:
        return 'Profile';
    }
  };

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{getProfileTypeLabel()}</li>
        </ol>
      </nav>

      {/* Profile Header */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 text-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3 mx-auto"
                  style={{ width: '150px', height: '150px' }}
                >
                  <i className="fas fa-user fa-4x text-white"></i>
                </div>
              )}
            </div>
            <div className="col-md-9">
              <h1 className="display-5">{profile.displayName || 'Unknown'}</h1>
              {profile.bio && <p className="lead">{profile.bio}</p>}

              <div className="d-flex gap-2 mb-3">
                <button
                  className={`btn btn-sm ${isFollowing ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={handleFollowToggle}
                >
                  <i className={`fas fa-${isFollowing ? 'user-check' : 'user-plus'} me-1`}></i>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <LikeButton
                  contentId={id}
                  contentType="profile"
                  initialLikeCount={profile.likeCount || 0}
                  initialIsLiked={isLiked}
                  onLikeToggle={handleLikeToggle}
                  showCount={true}
                />
                <FavoriteButton
                  contentId={id}
                  contentType="profile"
                  initialIsFavorite={isFavorite}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex flex-wrap gap-4">
                    <div>
                      <strong>{profile.totalArticles || 0}</strong>
                      <div className="text-muted small">Articles</div>
                    </div>
                    <div>
                      <strong>{profile.totalPosts || 0}</strong>
                      <div className="text-muted small">Posts</div>
                    </div>
                    <div>
                      <strong>{profile.totalBlogs || 0}</strong>
                      <div className="text-muted small">Blogs</div>
                    </div>
                    <div>
                      <strong>{profile.totalReels || 0}</strong>
                      <div className="text-muted small">Reels</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-wrap gap-4">
                    <div>
                      <strong>{profile.followerCount || 0}</strong>
                      <div className="text-muted small">Followers</div>
                    </div>
                    <div>
                      <strong>{profile.followingCount || 0}</strong>
                      <div className="text-muted small">Following</div>
                    </div>
                    <div>
                      <strong>{profile.totalViews || 0}</strong>
                      <div className="text-muted small">Total Views</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => setActiveTab('articles')}
            >
              Articles ({profile.totalArticles || 0})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts ({profile.totalPosts || 0})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              Blogs ({profile.totalBlogs || 0})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'reels' ? 'active' : ''}`}
              onClick={() => setActiveTab('reels')}
            >
              Reels ({profile.totalReels || 0})
            </button>
          </li>
          {(profile.totalDecisionGroups > 0 || profile.totalContests > 0) && (
            <>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'polls' ? 'active' : ''}`}
                  onClick={() => setActiveTab('polls')}
                >
                  Polls ({profile.totalDecisionGroups || 0})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'contests' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contests')}
                >
                  Contests ({profile.totalContests || 0})
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Content Display */}
      {loadingContent ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : content.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No {activeTab} found.
        </div>
      ) : (
        <div className="row">
          {content.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4 mb-4">
              <ContentCard
                content={item}
                contentType={activeTab.slice(0, -1)} // Remove 's' from 'articles', 'posts', etc.
                showActions={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

