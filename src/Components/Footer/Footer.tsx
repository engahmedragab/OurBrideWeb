import React from "react";
import { Link } from "react-router-dom";
import appStore from "../../Assets/appstore.png";
import googleplay from "../../Assets/googleplay.png";
import logo from "../../Assets/logo.png";
import "./Footer.css";

type FooterLink = {
  label: string;
  icon: string;
  to?: string;
  href?: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const quickLinks: FooterLink[] = [
  { label: "Home", icon: "fas fa-home", to: "/" },
  { label: "About Us", icon: "fas fa-info-circle", to: "/about" },
  { label: "Explore", icon: "fas fa-compass", to: "/explore" },
  { label: "Providers", icon: "fas fa-users", to: "/providers" },
  { label: "Services", icon: "fas fa-concierge-bell", to: "/services" },
  { label: "Offers", icon: "fas fa-tags", to: "/offers" },
  { label: "Shop", icon: "fas fa-store", to: "/shop" },
  { label: "Contact", icon: "fas fa-envelope", to: "/contact" },
];

const plannerLinks: FooterLink[] = [
  { label: "Checklist", icon: "fas fa-tasks", to: "/planner" },
  { label: "Budget", icon: "fas fa-dollar-sign", to: "/planner/budget" },
  { label: "Guest List", icon: "fas fa-user-friends", to: "/planner/guest-list" },
  { label: "Timeline", icon: "fas fa-clock", to: "/planner/timeline" },
  { label: "Calendar", icon: "fas fa-calendar", to: "/planner/calendar" },
  { label: "Favorites", icon: "fas fa-heart", to: "/planner/favorites" },
];

const guidesLinks: FooterLink[] = [
  { label: "UGC Content", icon: "fas fa-video", to: "/explore/ugc" },
  { label: "Local Guides", icon: "fas fa-user-tie", to: "/guides" },
  { label: "Trending", icon: "fas fa-fire", to: "/trending" },
  { label: "Leaderboard", icon: "fas fa-trophy", to: "/leaderboard" },
  { label: "Become a Guide", icon: "fas fa-user-plus", to: "/become-a-guide" },
  { label: "Community", icon: "fas fa-users", to: "/community" },
];

const supportLinks: FooterLink[] = [
  { label: "Support", icon: "fas fa-headset", to: "/support" },
  { label: "Download App", icon: "fas fa-download", to: "/download-app" },
  { label: "Privacy Policy", icon: "fas fa-shield-alt", to: "/privacy" },
  { label: "Terms & Conditions", icon: "fas fa-file-contract", to: "/terms" },
  { label: "Become a Provider", icon: "fas fa-store", to: "/become-provider" },
  { label: "Delete Account", icon: "fas fa-user-times", to: "/delete-account" },
];

const footerSections: FooterSection[] = [
  { title: "Quick Links", links: quickLinks },
  { title: "Wedding Planner", links: plannerLinks },
  { title: "Guides & Content", links: guidesLinks },
  { title: "Support & Legal", links: supportLinks },
];

const socialLinks: FooterLink[] = [
  {
    label: "Facebook",
    icon: "fab fa-facebook-f",
    href: "https://www.facebook.com/OurBrideCom",
  },
  {
    label: "Instagram",
    icon: "fab fa-instagram",
    href: "https://www.instagram.com/ourbridecom",
  },
  {
    label: "Twitter",
    icon: "fab fa-twitter",
    href: "https://mobile.twitter.com/ourbridecom",
  },
  {
    label: "TikTok",
    icon: "fab fa-tiktok",
    href: "https://www.tiktok.com/@ourbridecom",
  },
];

const appDownloads = [
  {
    label: "Google Play",
    href: "https://play.google.com/store/apps/details?id=com.ourbride.app",
    image: googleplay,
  },
  {
    label: "App Store",
    href: "https://apps.apple.com/sa/app/ourbride/id6747453812",
    image: appStore,
  },
];

const renderFooterLink = (link: FooterLink): JSX.Element => {
  const content = (
    <>
      <i className={link.icon}></i>
      {link.label}
    </>
  );

  if (link.to) {
    return (
      <Link to={link.to} className="footer-link">
        {content}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="footer-link"
    >
      {content}
    </a>
  );
};

export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-modern">
      <div className="container">
        <div className="footer-main row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="footer-section footer-brand-card">
              <div className="footer-brand">
                <img src={logo} alt="OurBride" className="footer-logo" />
                <p className="footer-brand-text">OurBride</p>
              </div>
              <p className="footer-description">
                Your complete wedding planning companion. From planning to execution, we
                are here to make your special day perfect.
              </p>
              <div className="footer-social">
                <h5>Follow Us</h5>
                <div className="social-links">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label={social.label}
                    >
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
              <div className="footer-app-card mt-4">
                <h4 className="footer-title">Download App</h4>
                <p className="footer-app-description">
                  Get OurBride for the best wedding planning experience.
                </p>
                <div className="footer-app-buttons">
                  {appDownloads.map((download) => (
                    <a
                      key={download.label}
                      href={download.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-download-btn"
                    >
                      <img src={download.image} alt={download.label} />
                    </a>
                  ))}
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

          {footerSections.map((section) => (
            <div className="col-lg-2 col-md-6" key={section.title}>
              <div className="footer-section">
                <h4 className="footer-title">{section.title}</h4>
                <ul className="footer-links">
                  {section.links.map((link) => (
                    <li key={link.label}>{renderFooterLink(link)}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="footer-bottom text-center">
          <p className="footer-copyright">
            © {currentYear} <strong>OurBride</strong>. All Rights Reserved.
          </p>
          <div className="footer-bottom-links">
            <span>Made with</span>
            <i className="fas fa-heart text-main"></i>
            <span>for couples worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
