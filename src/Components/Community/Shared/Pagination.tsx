import React from 'react';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPreviousPage,
  onPageChange,
  loading = false 
}) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage || loading) return;
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(i)}
            disabled={loading}
          >
            {i}
          </button>
        </li>
      );
    }

    return pages;
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${!hasPreviousPage || loading ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage || loading}
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        
        {currentPage > 3 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => handlePageChange(1)} disabled={loading}>
                1
              </button>
            </li>
            {currentPage > 4 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {renderPageNumbers()}

        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => handlePageChange(totalPages)}
                disabled={loading}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}

        <li className={`page-item ${!hasNextPage || loading ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage || loading}
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

