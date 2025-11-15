import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useLocation } from 'react-router-dom';
import communityService from '../../../services/communityService';
import ContentCard from '../Shared/ContentCard';
import Pagination from '../Shared/Pagination';

export default function UnifiedContentPage() {
  const params = useParams();
  const location = useLocation();
  // Determine content type from route path
  // Routes: /unified/category/:id, /unified/item/:id, etc.
  const path = location.pathname;
  const type = path.includes('/category/') ? 'category' :
              path.includes('/item/') ? 'item' :
              path.includes('/preparation/') ? 'preparation' :
              path.includes('/provider/') ? 'provider' :
              path.includes('/bazaar-event/') ? 'bazaar-event' :
              'category';
  const id = params.id;
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [contentTypes, setContentTypes] = useState(['articles', 'posts', 'blogs', 'reels']);
  const [activeFilter, setActiveFilter] = useState('all');
  const pageSize = 20;

  useEffect(() => {
    loadContent();
  }, [type, id, page, activeFilter]);

  const loadContent = async () => {
    try {
      setLoading(true);
      let response;
      const contentTypeParam = activeFilter === 'all' ? undefined : activeFilter;

      switch (type) {
        case 'category':
          response = await communityService.unified.getByCategory(parseInt(id), page, pageSize);
          break;
        case 'item':
          response = await communityService.unified.getByItem(parseInt(id), page, pageSize);
          break;
        case 'preparation':
          response = await communityService.unified.getByPreparation(parseInt(id), page, pageSize);
          break;
        case 'provider':
          response = await communityService.unified.getByProvider(parseInt(id), page, pageSize);
          break;
        case 'bazaar-event':
          response = await communityService.unified.getByBazaarEvent(parseInt(id), page, pageSize);
          break;
        default:
          return;
      }

      // Handle both ApiResult format and direct data format
      let contentData = [];
      let paginationInfo = {};

      if (response) {
        if (response.data && Array.isArray(response.data)) {
          contentData = response.data;
          paginationInfo = response;
        } else if (Array.isArray(response)) {
          contentData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          contentData = response.data.data;
          paginationInfo = response.data;
        }
      }

      // Filter by content type if needed
      if (activeFilter !== 'all' && contentTypeParam) {
        contentData = contentData.filter(item => 
          item.contentType?.toLowerCase() === contentTypeParam.toLowerCase()
        );
      }

      setContent(contentData);
      setTotalPages(paginationInfo.totalPages || 1);
      setHasNextPage(paginationInfo.hasNextPage || false);
      setHasPreviousPage(paginationInfo.hasPreviousPage || false);
    } catch (error) {
      console.error('Error loading unified content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTitle = () => {
    switch (type) {
      case 'category':
        return 'Category Content';
      case 'item':
        return 'Item Content';
      case 'preparation':
        return 'Preparation Content';
      case 'provider':
        return 'Provider Content';
      case 'bazaar-event':
        return 'Event Content';
      default:
        return 'Content';
    }
  };

  const getBreadcrumbLabel = () => {
    switch (type) {
      case 'category':
        return 'Category';
      case 'item':
        return 'Item';
      case 'preparation':
        return 'Preparation';
      case 'provider':
        return 'Provider';
      case 'bazaar-event':
        return 'Event';
      default:
        return 'Content';
    }
  };

  if (loading && content.length === 0) {
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
          <h1 className="display-4 mb-3">{getTitle()}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/community">Community</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{getBreadcrumbLabel()} #{id}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Content Type Filter */}
      <div className="mb-4">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <button
              className={`nav-link ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => { setActiveFilter('all'); setPage(1); }}
            >
              All Content
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeFilter === 'articles' ? 'active' : ''}`}
              onClick={() => { setActiveFilter('articles'); setPage(1); }}
            >
              Articles
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeFilter === 'posts' ? 'active' : ''}`}
              onClick={() => { setActiveFilter('posts'); setPage(1); }}
            >
              Posts
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeFilter === 'blogs' ? 'active' : ''}`}
              onClick={() => { setActiveFilter('blogs'); setPage(1); }}
            >
              Blogs
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeFilter === 'reels' ? 'active' : ''}`}
              onClick={() => { setActiveFilter('reels'); setPage(1); }}
            >
              Reels
            </button>
          </li>
        </ul>
      </div>

      {content.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>No content found.
        </div>
      ) : (
        <>
          <div className="row">
            {content.map((item) => (
              <div key={`${item.contentType}-${item.contentId}`} className="col-md-6 col-lg-4 mb-4">
                <ContentCard
                  content={item}
                  contentType={item.contentType || 'post'}
                  showActions={false}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </>
      )}
    </div>
  );
}

