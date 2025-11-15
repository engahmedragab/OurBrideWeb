import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ placeholder = 'Search community...', onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        // Default: navigate to tags search or show results
        navigate(`/community/tags?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="btn btn-outline-secondary" type="submit">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </form>
  );
}

