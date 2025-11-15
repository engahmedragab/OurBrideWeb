import React from "react";
import { Link } from "react-router-dom";
import appStore from "../../Assets/appstore.png";
import googleplay from "../../Assets/googleplay.png";
import logo from "../../Assets/logo.png";

export default function Footer(): JSX.Element {
  return (
    <>
      <footer className="footer">
        <div className="container">
          {/* Main Footer Content */}
          <div className="footer-main">
            <div className="row">
              {/* Company Info */}
              <div className="col-lg-4 col-md-6 mb-5">
                <div className="footer-section">
                  <div className="footer-brand">
                    <img src={logo} alt="OurBride" className="footer-logo" />
                  </div>
                  <p className="footer-description">
                    Your complete wedding planning companion. From planning to execution,
                    we're here to make your special day perfect.
                  </p>
                  <div className="footer-social">
                    <h5>Follow Us</h5>
                    <div className="social-links">
                      <a
                        href="https://www.facebook.com/OurBrideCom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a
                        href="https://www.instagram.com/ourbridecom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a
                        href="https://mobile.twitter.com/ourbridecom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a
                        href="https://www.tiktok.com/@ourbridecom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        <i className="fab fa-tiktok"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-lg-2 col-md-6 mb-5">
                <div className="footer-section">
                  <h4 className="footer-title">Quick Links</h4>
                  <ul className="footer-links">
                    <li>
                      <Link to="/" className="footer-link">
                        <i className="fas fa-home"></i>
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/about" className="footer-link">
                        <i className="fas fa-info-circle"></i>
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link to="/explore" className="footer-link">
                        <i className="fas fa-compass"></i>
                        Explore
                      </Link>
                    </li>
                    <li>
                      <Link to="/providers" className="footer-link">
                        <i className="fas fa-users"></i>
                        Providers
                      </Link>
                    </li>
                    <li>
                      <Link to="/services" className="footer-link">
                        <i className="fas fa-concierge-bell"></i>
                        Services
                      </Link>
                    </li>
                    <li>
                      <Link to="/offers" className="footer-link">
                        <i className="fas fa-tags"></i>
                        Offers
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop" className="footer-link">
                        <i className="fas fa-store"></i>
                        Shop
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="footer-link">
                        <i className="fas fa-envelope"></i>
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Wedding Planner */}
              <div className="col-lg-2 col-md-6 mb-5">
                <div className="footer-section">
                  <h4 className="footer-title">Wedding Planner</h4>
                  <ul className="footer-links">
                    <li>
                      <Link to="/planner" className="footer-link">
                        <i className="fas fa-tasks"></i>
                        Checklist
                      </Link>
                    </li>
                    <li>
                      <Link to="/planner/budget" className="footer-link">
                        <i className="fas fa-dollar-sign"></i>
                        Budget
                      </Link>
                    </li>
                    <li>
                      <Link to="/planner/guest-list" className="footer-link">
                        <i className="fas fa-user-friends"></i>
                        Guest List
                      </Link>
                    </li>
                    <li>
                      <Link to="/planner/timeline" className="footer-link">
                        <i className="fas fa-clock"></i>
                        Timeline
                      </Link>
                    </li>
                    <li>
                      <Link to="/planner/calendar" className="footer-link">
                        <i className="fas fa-calendar"></i>
                        Calendar
                      </Link>
                    </li>
                    <li>
                      <Link to="/planner/favorites" className="footer-link">
                        <i className="fas fa-heart"></i>
                        Favorites
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* UGC & Guides */}
              <div className="col-lg-2 col-md-6 mb-5">
                <div className="footer-section">
                  <h4 className="footer-title">Guides & Content</h4>
                  <ul className="footer-links">
                    <li>
                      <Link to="/explore/ugc" className="footer-link">
                        <i className="fas fa-video"></i>
                        UGC Content
                      </Link>
                    </li>
                    <li>
                      <Link to="/guides" className="footer-link">
                        <i className="fas fa-user-tie"></i>
                        Local Guides
                      </Link>
                    </li>
                    <li>
                      <Link to="/trending" className="footer-link">
                        <i className="fas fa-fire"></i>
                        Trending
                      </Link>
                    </li>
                    <li>
                      <Link to="/leaderboard" className="footer-link">
                        <i className="fas fa-trophy"></i>
                        Leaderboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/become-a-guide" className="footer-link">
                        <i className="fas fa-user-plus"></i>
                        Become a Guide
                      </Link>
                    </li>
                    <li>
                      <Link to="/community" className="footer-link">
                        <i className="fas fa-users"></i>
                        Community
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Support & Legal */}
              <div className="col-lg-2 col-md-6 mb-5">
                <div className="footer-section">
                  <h4 className="footer-title">Support & Legal</h4>
                  <ul className="footer-links">
                    <li>
                      <Link to="/support" className="footer-link">
                        <i className="fas fa-headset"></i>
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link to="/download-app" className="footer-link">
                        <i className="fas fa-download"></i>
                        Download App
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacy" className="footer-link">
                        <i className="fas fa-shield-alt"></i>
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/terms" className="footer-link">
                        <i className="fas fa-file-contract"></i>
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link to="/become-provider" className="footer-link">
                        <i className="fas fa-store"></i>
                        Become a Provider
                      </Link>
                    </li>
                    <li>
                      <Link to="/delete-account" className="footer-link">
                        <i className="fas fa-user-times"></i>
                        Delete Account
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Download App */}
              <div className="col-lg-2 col-md-6 mb-5">
                <div className="footer-section">
                  <h4 className="footer-title">Download App</h4>
                  <p className="footer-app-description">
                    Get OurBride app for the best wedding planning experience
                  </p>
                  <div className="footer-app-buttons">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.ourbride.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-download-btn"
                    >
                      <img src={googleplay} alt="Google Play" />
                    </a>
                    <a
                      href="https://apps.apple.com/sa/app/ourbride/id6747453812"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-download-btn"
                    >
                      <img src={appStore} alt="App Store" />
                    </a>
                  </div>
                  <div className="footer-store-link">
                    <a
                      href="https://www.our-bride.store"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-link"
                    >
                      <i className="fas fa-store"></i>
                      Visit Our Store
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="footer-copyright">
                  © 2024 <strong>OurBride</strong>. All Rights Reserved.
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="footer-bottom-links">
                  <span>Made with</span>
                  <i className="fas fa-heart text-main"></i>
                  <span>for couples worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
