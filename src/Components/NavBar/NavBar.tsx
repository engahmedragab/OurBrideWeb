import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../../Hooks/useAuth';
import logo from "../../Assets/logo.png";

export default function NavBar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [downloadBarVisible, setDownloadBarVisible] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, removeSession } = useAuth();

  // Check if download bar is dismissed
  useEffect(() => {
    const checkBarVisibility = () => {
      const dismissed = localStorage.getItem('appDownloadBarDismissed');
      setDownloadBarVisible(dismissed !== 'true');
    };
    
    checkBarVisibility();
    
    // Listen for custom event when bar is dismissed
    const handleBarDismissed = () => {
      setDownloadBarVisible(false);
    };
    
    window.addEventListener('appDownloadBarDismissed', handleBarDismissed);
    window.addEventListener('storage', checkBarVisibility);
    
    return () => {
      window.removeEventListener('appDownloadBarDismissed', handleBarDismissed);
      window.removeEventListener('storage', checkBarVisibility);
    };
  }, []);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest('#userProfileDropdown') && !target.closest('.dropdown-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Close menus when route changes
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async (): void => {
    await removeSession();
    navigate('/');
    setIsUserMenuOpen(false);
    closeMobileMenu();
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`} style={{ top: downloadBarVisible ? '48px' : '0', transition: 'top 0.3s ease' }}>
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/" onClick={closeMobileMenu}>
            <img src={logo} alt="OurBride" className="navbar-logo" />
          </Link>

          {/* Mobile Toggle Button */}
          <button
            className={`navbar-toggler ${isMobileMenuOpen ? 'collapsed' : ''}`}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-controls="navbarSupportedContent"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Menu */}
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Explore Dropdown */}
              <li className="nav-item dropdown">
                <Link
                  className={`nav-link dropdown-toggle ${location.pathname.startsWith('/explore') ? 'active' : ''}`}
                  to="#"
                  id="exploreDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fas fa-compass nav-icon"></i>
                  <span>Explore</span>
                </Link>
                <ul className="dropdown-menu" aria-labelledby="exploreDropdown">
                  <li>
                    <Link className="dropdown-item" to="/explore" onClick={closeMobileMenu}>
                      <i className="fas fa-search me-2"></i>Explore All
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/explore/ugc" onClick={closeMobileMenu}>
                      <i className="fas fa-video me-2"></i>UGC Content
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/guides" onClick={closeMobileMenu}>
                      <i className="fas fa-user-tie me-2"></i>Local Guides
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/trending" onClick={closeMobileMenu}>
                      <i className="fas fa-fire me-2"></i>Trending
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/leaderboard" onClick={closeMobileMenu}>
                      <i className="fas fa-trophy me-2"></i>Leaderboard
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Services Dropdown */}
              <li className="nav-item dropdown">
                <Link
                  className={`nav-link dropdown-toggle ${location.pathname.startsWith('/services') ? 'active' : ''}`}
                  to="#"
                  id="servicesDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fas fa-concierge-bell nav-icon"></i>
                  <span>Services</span>
                </Link>
                <ul className="dropdown-menu" aria-labelledby="servicesDropdown">
                  <li>
                    <Link className="dropdown-item" to="/services" onClick={closeMobileMenu}>
                      <i className="fas fa-list me-2"></i>All Services
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/services/categories" onClick={closeMobileMenu}>
                      <i className="fas fa-th-large me-2"></i>Categories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/providers" onClick={closeMobileMenu}>
                      <i className="fas fa-users me-2"></i>Providers
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Guiders Dropdown */}
              <li className="nav-item dropdown">
                <Link
                  className={`nav-link dropdown-toggle ${location.pathname.startsWith('/guider') || location.pathname.startsWith('/guides') ? 'active' : ''}`}
                  to="#"
                  id="guidersDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fas fa-user-tie nav-icon"></i>
                  <span>Guiders</span>
                </Link>
                <ul className="dropdown-menu" aria-labelledby="guidersDropdown">
                  <li>
                    <h6 className="dropdown-header">
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Dashboard
                    </h6>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-home me-2"></i>Dashboard
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <h6 className="dropdown-header">
                      <i className="fas fa-file-alt me-2"></i>
                      Content
                    </h6>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/content" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-list me-2"></i>Content List
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/content/new" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-plus me-2"></i>Create Content
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <h6 className="dropdown-header">
                      <i className="fas fa-bullhorn me-2"></i>
                      Campaigns
                    </h6>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/campaigns" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-list me-2"></i>All Campaigns
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <h6 className="dropdown-header">
                      <i className="fas fa-link me-2"></i>
                      Affiliate
                    </h6>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/affiliate" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-chart-line me-2"></i>Affiliate Overview
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/affiliate/links" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-link me-2"></i>Affiliate Links
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/affiliate/offers" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-tags me-2"></i>Affiliate Offers
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/affiliate/events" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-calendar-alt me-2"></i>Affiliate Events
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <h6 className="dropdown-header">
                      <i className="fas fa-wallet me-2"></i>
                      Wallet
                    </h6>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/wallet" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-wallet me-2"></i>Wallet Overview
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/wallet/transactions" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-exchange-alt me-2"></i>Transactions
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/wallet/payouts" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-money-check-alt me-2"></i>Payouts
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/wallet/invoices" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-file-invoice me-2"></i>Tax Invoices
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <h6 className="dropdown-header">
                      <i className="fas fa-chart-bar me-2"></i>
                      Analytics
                    </h6>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/analytics" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-chart-pie me-2"></i>Analytics Overview
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/analytics/content" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-file-alt me-2"></i>Content Analytics
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/analytics/affiliate" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-link me-2"></i>Affiliate Analytics
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/analytics/campaigns" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-bullhorn me-2"></i>Campaign Analytics
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <h6 className="dropdown-header">
                      <i className="fas fa-trophy me-2"></i>
                      Rank & Badges
                    </h6>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/rank" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-star me-2"></i>My Rank
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/rank/badges" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-medal me-2"></i>Badges
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/rank/leaderboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-trophy me-2"></i>Leaderboard
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <h6 className="dropdown-header">
                      <i className="fas fa-user me-2"></i>
                      Profile
                    </h6>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/profile" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-user me-2"></i>My Profile
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/profile/public" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-eye me-2"></i>Public Profile
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/profile/settings" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-cog me-2"></i>Settings
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/profile/links" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-link me-2"></i>Profile Links
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <h6 className="dropdown-header">
                      <i className="fas fa-tools me-2"></i>
                      Tools & Help
                    </h6>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/status" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-info-circle me-2"></i>Status
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/help" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-question-circle me-2"></i>Help
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="https://guider.our-bride.com/help/support" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-headset me-2"></i>Support
                    </a>
                  </li>
                </ul>
              </li>

              {/* Providers */}
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/providers') || location.pathname.startsWith('/providers/') ? 'active' : ''}`}
                  to="/providers"
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-users nav-icon"></i>
                  <span>Providers</span>
                </Link>
              </li>

              {/* Community */}
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/community') || location.pathname.startsWith('/community') ? 'active' : ''}`}
                  to="community"
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-users nav-icon"></i>
                  <span>Community</span>
                </Link>
              </li>

              {/* About */}
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                  to="about"
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-info-circle nav-icon"></i>
                  <span>About</span>
                </Link>
              </li>

              {/* Contact */}
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                  to="contact"
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-envelope nav-icon"></i>
                  <span>Contact</span>
                </Link>
              </li>
            </ul>

            {/* Action Buttons */}
            <div className="navbar-actions">
              <div className="navbar-buttons">
                <a
                  href="https://www.our-bride.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-main navbar-store-btn"
                >
                  <i className="fas fa-store me-2"></i>
                  <span className="d-none d-md-inline">Visit Store</span>
                  <span className="d-md-none">Store</span>
                </a>
                
                {/* User Profile Dropdown - Only show when logged in */}
                {isAuthenticated ? (
                  <div className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      id="userProfileDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }}
                      style={{ padding: '10px 15px !important' }}
                    >
                      <i className="fas fa-user-circle nav-icon" style={{ fontSize: '20px' }}></i>
                      <span className="d-none d-md-inline">{user?.userName || 'Profile'}</span>
                    </Link>
                    <ul 
                      className={`dropdown-menu dropdown-menu-end ${isUserMenuOpen ? 'show' : ''}`}
                      aria-labelledby="userProfileDropdown"
                      style={{ minWidth: '220px', marginTop: '10px' }}
                    >
                      <li>
                        <h6 className="dropdown-header">
                          <i className="fas fa-user me-2"></i>
                          {user?.userName || 'User'}
                        </h6>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/me/profile" onClick={() => { setIsUserMenuOpen(false); closeMobileMenu(); }}>
                          <i className="fas fa-user me-2"></i>My Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/me/my-bookings" onClick={() => { setIsUserMenuOpen(false); closeMobileMenu(); }}>
                          <i className="fas fa-calendar-check me-2"></i>My Bookings
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/me/my-favorites" onClick={() => { setIsUserMenuOpen(false); closeMobileMenu(); }}>
                          <i className="fas fa-heart me-2"></i>My Favorites
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/me/my-coupons" onClick={() => { setIsUserMenuOpen(false); closeMobileMenu(); }}>
                          <i className="fas fa-ticket-alt me-2"></i>My Coupons
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      {/* Planner Section */}
                      <li>
                        <h6 className="dropdown-header">
                          <i className="fas fa-calendar-check me-2"></i>
                          Planner
                        </h6>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/planner" onClick={() => { setIsUserMenuOpen(false); closeMobileMenu(); }}>
                          <i className="fas fa-tasks me-2"></i>Checklist
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/planner/budget" onClick={() => { setIsUserMenuOpen(false); closeMobileMenu(); }}>
                          <i className="fas fa-dollar-sign me-2"></i>Budget
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/planner/guest-list" onClick={() => { setIsUserMenuOpen(false); closeMobileMenu(); }}>
                          <i className="fas fa-user-friends me-2"></i>Guest List
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/planner/timeline" onClick={() => { setIsUserMenuOpen(false); closeMobileMenu(); }}>
                          <i className="fas fa-clock me-2"></i>Timeline
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/planner/calendar" onClick={() => { setIsUserMenuOpen(false); closeMobileMenu(); }}>
                          <i className="fas fa-calendar me-2"></i>Calendar
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/planner/favorites" onClick={() => { setIsUserMenuOpen(false); closeMobileMenu(); }}>
                          <i className="fas fa-heart me-2"></i>Planner Favorites
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt me-2"></i>Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="btn btn-outline-main navbar-login-btn"
                    style={{ padding: '12px 20px', textDecoration: 'none' }}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    <span className="d-none d-md-inline">Login</span>
                    <span className="d-md-none">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
