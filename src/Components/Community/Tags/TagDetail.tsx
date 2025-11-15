import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import communityService from '../../../services/communityService';
import ContentCard from '../Shared/ContentCard';

export default function TagDetail() {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'articles', 'posts', 'blogs', 'reels'

  useEffect(() => {
    loadTag();
  }, [slug]);

  const loadTag = async () => {
    try {
      setLoading(true);
      // Try to get by slug first, if it's a number, try by ID
      const tagId = parseInt(slug);
      const response = tagId 
        ? await communityService.tags.getById(tagId)
        : await communityService.tags.getBySlug(slug);
      
      // Handle both ApiResult format and direct data format
      let tagData = null;
      if (response) {
        if (response.data && !response.success) {
          tagData = response.data;
        } else if (response.id) {
          tagData = response;
        } else if (response.data && response.data.id) {
          tagData = response.data;
        }
      }
      
      if (tagData) {
        setTag(tagData);
        // Load content by tag - using posts API as example
        // Note: You may need to implement tag-specific endpoints or use unified content
        try {
          const postsResponse = await communityService.posts.getByTag(tagData.id, 1, 10);
          if (postsResponse && postsResponse.data) {
            setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : []);
          }
        } catch (e) {
          console.error('Error loading posts by tag:', e);
        }
      }
    } catch (error) {
      console.error('Error loading tag:', error);
    } finally {
      setLoading(false);
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

  if (!tag) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Tag Not Found</h4>
          <p>The tag you're looking for doesn't exist.</p>
          <Link to="/community/tags" className="btn btn-primary">
            Back to Tags
          </Link>
        </div>
      </div>
    );
  }

  const allContent = [...articles, ...posts, ...blogs, ...reels];

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
          <li className="breadcrumb-item"><Link to="/community/tags">Tags</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{tag.name}</li>
        </ol>
      </nav>

      <header className="mb-4">
        <div className="d-flex align-items-center mb-3">
          {tag.icon && (
            <i className={`${tag.icon} me-3`} style={{ fontSize: '3rem' }}></i>
          )}
          <div>
            <h1 className="display-4">
              {tag.color ? (
                <span
                  className="badge"
                  style={{
                    backgroundColor: tag.color,
                    color: '#fff',
                    fontSize: '2rem',
                    padding: '1rem 2rem',
                  }}
                >
                  {tag.name}
                </span>
              ) : (
                tag.name
              )}
            </h1>
          </div>
        </div>
        {tag.description && <p className="lead">{tag.description}</p>}
      </header>

      {/* Content Tabs */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Content
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => setActiveTab('articles')}
            >
              Articles ({articles.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts ({posts.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              Blogs ({blogs.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'reels' ? 'active' : ''}`}
              onClick={() => setActiveTab('reels')}
            >
              Reels ({reels.length})
            </button>
          </li>
        </ul>
      </div>

      {/* Content Display */}
      {activeTab === 'all' && allContent.length === 0 && (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No content found with this tag.
        </div>
      )}

      {activeTab === 'all' && allContent.length > 0 && (
        <div className="row">
          {allContent.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4 mb-4">
              <ContentCard
                content={item}
                contentType={item.contentType || 'post'}
                showActions={false}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'posts' && posts.length === 0 && (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No posts found with this tag.
        </div>
      )}

      {activeTab === 'posts' && posts.length > 0 && (
        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-md-6 col-lg-4 mb-4">
              <ContentCard
                content={post}
                contentType="post"
                showActions={false}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'articles' && articles.length === 0 && (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No articles found with this tag.
        </div>
      )}

      {activeTab === 'blogs' && blogs.length === 0 && (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No blogs found with this tag.
        </div>
      )}

      {activeTab === 'reels' && reels.length === 0 && (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No reels found with this tag.
        </div>
      )}
    </div>
  );
}

