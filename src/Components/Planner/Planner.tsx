import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function Planner() {
  return (
    <div className="container py-5">
      <h1>Wedding Planner</h1>
      <nav className="nav nav-pills mb-4">
        <Link className="nav-link" to="/planner/checklist">Checklist</Link>
        <Link className="nav-link" to="/planner/budget">Budget</Link>
        <Link className="nav-link" to="/planner/guest-list">Guest List</Link>
        <Link className="nav-link" to="/planner/timeline">Timeline</Link>
        <Link className="nav-link" to="/planner/calendar">Calendar</Link>
        <Link className="nav-link" to="/planner/favorites">Favorites</Link>
      </nav>
      <Outlet />
    </div>
  );
}

