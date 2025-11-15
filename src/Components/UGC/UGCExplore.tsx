import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function UGCExplore() {
  return (
    <div className="container py-5">
      <h1>Explore UGC Content</h1>
      <nav className="nav nav-pills mb-4">
        <Link className="nav-link" to="/explore/ugc/videos">Videos</Link>
        <Link className="nav-link" to="/explore/ugc/top-guides">Top Guides</Link>
        <Link className="nav-link" to="/explore/ugc/top-content">Top Content</Link>
      </nav>
      <Outlet />
    </div>
  );
}

