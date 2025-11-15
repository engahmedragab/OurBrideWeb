import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from '../../../services/communityService';

export default function TagsList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await communityService.tags.getAll();
      
      // Handle both ApiResult format and direct data format
      let tagsData = [];
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          tagsData = response.data;
        } else if (Array.isArray(response)) {
          tagsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          tagsData = response.data.data;
        }
      }
      
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadTags();
      return;
    }

    try {
      setLoading(true);
      const response = await communityService.tags.search(searchTerm);
      
      // Handle both ApiResult format and direct data format
      let tagsData = [];
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          tagsData = response.data;
        } else if (Array.isArray(response)) {
          tagsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          tagsData = response.data.data;
        }
      }
      
      setTags(tagsData);
    } catch (error) {
      console.error('Error searching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && tags.length === 0) {
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

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 mb-3">Tags</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Tags</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Search */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleSearch}
            >
              <i className="fas fa-search"></i> Search
            </button>
          </div>
        </div>
      </div>

      {filteredTags.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No tags found.
        </div>
      ) : (
        <div className="row">
          {filteredTags.map((tag) => (
            <div key={tag.id} className="col-md-6 col-lg-4 mb-3">
              <Link
                to={`/community/tags/${tag.slug || tag.id}`}
                className="text-decoration-none"
              >
                <div className="card h-100 hover-shadow">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      {tag.icon && (
                        <i className={`${tag.icon} me-2`} style={{ fontSize: '1.5rem' }}></i>
                      )}
                      <h5 className="card-title mb-0">
                        {tag.color ? (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: tag.color,
                              color: '#fff',
                              fontSize: '1rem',
                              padding: '0.5rem 1rem',
                            }}
                          >
                            {tag.name}
                          </span>
                        ) : (
                          tag.name
                        )}
                      </h5>
                    </div>
                    {tag.description && (
                      <p className="card-text text-muted small">{tag.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

