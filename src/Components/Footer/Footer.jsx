import React from "react";
import { Link } from "react-router-dom";
import appStore from "../../Assets/appstore.png";
import googleplay from "../../Assets/googleplay.png";
import logo from "../../Assets/logo.png";

export default function Footer() {
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
                      <Link to="/providers" className="footer-link">
                        <i className="fas fa-users"></i>
                        Providers
                      </Link>
                    </li>
                    <li>
                      <Link to="/items" className="footer-link">
                        <i className="fas fa-shopping-bag"></i>
                        Items
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

              {/* Services */}
              <div className="col-lg-2 col-md-6 mb-5">
                <div className="footer-section">
                  <h4 className="footer-title">Services</h4>
                  <ul className="footer-links">
                    <li>
                      <a href="#" className="footer-link">
                        <i className="fas fa-calendar-check"></i>
                        Wedding Planning
                      </a>
                    </li>
                    <li>
                      <a href="#" className="footer-link">
                        <i className="fas fa-store"></i>
                        Vendor Directory
                      </a>
                    </li>
                    <li>
                      <a href="#" className="footer-link">
                        <i className="fas fa-shopping-cart"></i>
                        Wedding Shop
                      </a>
                    </li>
                    <li>
                      <a href="#" className="footer-link">
                        <i className="fas fa-tasks"></i>
                        Task Management
                      </a>
                    </li>
                    <li>
                      <a href="#" className="footer-link">
                        <i className="fas fa-budget"></i>
                        Budget Tracker
                      </a>
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
                      <Link to="/privacy-policy" className="footer-link">
                        <i className="fas fa-shield-alt"></i>
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/terms-conditions" className="footer-link">
                        <i className="fas fa-file-contract"></i>
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link to="/delete-account" className="footer-link">
                        <i className="fas fa-user-times"></i>
                        Delete Account
                      </Link>
                    </li>
                    <li>
                      <Link to="/support" className="footer-link">
                        <i className="fas fa-headset"></i>
                        Support
                      </Link>
                    </li>
                    <li>
                      <a href="tel:+1234567890" className="footer-link">
                        <i className="fas fa-phone"></i>
                        Contact Us
                      </a>
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
                      href="#"
                      className="app-download-btn disabled"
                      title="Coming Soon"
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
