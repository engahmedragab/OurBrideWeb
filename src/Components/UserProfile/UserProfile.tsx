import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function UserProfile() {
  return (
    <div className="container py-5">
      <h1>My Profile</h1>
      <nav className="nav nav-pills mb-4">
        <Link className="nav-link" to="/me/profile">Profile</Link>
        <Link className="nav-link" to="/me/my-bookings">Bookings</Link>
        <Link className="nav-link" to="/me/my-favorites">Favorites</Link>
        <Link className="nav-link" to="/me/my-coupons">Coupons</Link>
      </nav>
      <Outlet />
    </div>
  );
}

