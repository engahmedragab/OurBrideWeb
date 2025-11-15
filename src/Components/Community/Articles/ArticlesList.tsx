import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from '../../../services/communityService';

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    loadArticles();
  }, [page]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await communityService.articles.getPublished(page, pageSize);
      // Handle both ApiResult format and direct data format
      let articlesData = [];
      let paginationInfo = {};
      
      if (response) {
        if (response.data && Array.isArray(response.data)) {
          articlesData = response.data;
          paginationInfo = response;
        } else if (Array.isArray(response)) {
          articlesData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          articlesData = response.data.data;
          paginationInfo = response.data;
        }
      }
      
      setArticles(articlesData);
      setHasNextPage(paginationInfo.hasNextPage || false);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && articles.length === 0) {
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
          <h1 className="display-4 mb-3">Articles</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Articles</li>
            </ol>
          </nav>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No articles found.
        </div>
      ) : (
        <>
          <div className="row">
            {articles.map((article) => (
              <div key={article.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/community/articles/${article.slug || article.id}`} className="text-decoration-none">
                        {article.title}
                      </Link>
                    </h5>
                    <p className="card-text">{article.summary || article.excerpt}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="fas fa-eye me-1"></i>{article.viewCount || 0}
                        <i className="fas fa-heart ms-3 me-1"></i>{article.likeCount || 0}
                        <i className="fas fa-comment ms-3 me-1"></i>{article.commentCount || 0}
                      </small>
                      {article.publishedAt && (
                        <small className="text-muted">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="row mt-4">
              <div className="col-12 text-center">
                <button
                  className="btn btn-primary"
                  onClick={() => setPage(page + 1)}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

