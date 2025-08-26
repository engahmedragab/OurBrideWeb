import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import MainButton from "../../SimpleComponent/MainButton/MainButton.jsx";
import logo from "../../Assets/logo.png";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
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
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  to="/"
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-home nav-icon"></i>
                  <span>Home</span>
                </Link>
              </li>
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
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/providers') ? 'active' : ''}`}
                  to="providers"
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-users nav-icon"></i>
                  <span>Providers</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/items') ? 'active' : ''}`}
                  to="items"
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-shopping-bag nav-icon"></i>
                  <span>Items</span>
                </Link>
              </li>
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
                <MainButton
                  title="Download App"
                  classes="btn-main navbar-download-btn"
                  icon="download"
                  onClick={() => {
                    // Add download app functionality
                    window.open("https://play.google.com/store/apps/details?id=com.ourbride.app", "_blank");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
