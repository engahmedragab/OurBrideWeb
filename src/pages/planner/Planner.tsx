import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { plannerService } from '@/services/plannerService';

export default function Planner() {
  const location = useLocation();
  const [defaultEventId, setDefaultEventId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Try to get default wedding event
    const loadDefaultEvent = async () => {
      try {
        const defaultEvent = await plannerService.weddingEvents.getDefault();
        if (defaultEvent && defaultEvent.id) {
          setDefaultEventId(defaultEvent.id);
        }
      } catch (err) {
        // If no default event exists, that's okay
        console.log('No default wedding event found');
      }
    };
    loadDefaultEvent();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1>Wedding Planner</h1>
        <p className="text-muted">Organize and manage your wedding planning</p>
      </div>

      <nav className="nav nav-pills mb-4" style={{ borderBottom: '1px solid #dee2e6' }}>
        <Link
          className={`nav-link ${isActive('/planner/checklist') ? 'active' : ''}`}
          to="/planner/checklist"
        >
          <i className="fas fa-check-square me-2"></i>Checklist
        </Link>
        <Link
          className={`nav-link ${isActive('/planner/budget') ? 'active' : ''}`}
          to="/planner/budget"
        >
          <i className="fas fa-dollar-sign me-2"></i>Budget
        </Link>
        <Link
          className={`nav-link ${isActive('/planner/guest-list') ? 'active' : ''}`}
          to="/planner/guest-list"
        >
          <i className="fas fa-users me-2"></i>Guest List
        </Link>
        <Link
          className={`nav-link ${isActive('/planner/timeline') ? 'active' : ''}`}
          to="/planner/timeline"
        >
          <i className="fas fa-clock me-2"></i>Timeline
        </Link>
        <Link
          className={`nav-link ${isActive('/planner/calendar') ? 'active' : ''}`}
          to="/planner/calendar"
        >
          <i className="fas fa-calendar me-2"></i>Calendar
        </Link>
        <Link
          className={`nav-link ${isActive('/planner/favorites') ? 'active' : ''}`}
          to="/planner/favorites"
        >
          <i className="fas fa-star me-2"></i>Favorites
        </Link>
      </nav>

      <Outlet context={{ defaultEventId }} />
    </div>
  );
}

