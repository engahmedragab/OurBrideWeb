import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth";
import logo from "../../Assets/logo.png";
import "./NavBar.css";

type MenuItem = {
  label: string;
  icon: string;
  to?: string;
  href?: string;
};

type DropdownSection = {
  header?: {
    icon: string;
    text: string;
  };
  items: MenuItem[];
  dividerAfter?: boolean;
};

type NavDropdown = {
  id: string;
  label: string;
  icon: string;
  isActive: (path: string) => boolean;
  sections: DropdownSection[];
};

type PrimaryNavLink = {
  label: string;
  icon: string;
  to: string;
  isActive: (path: string) => boolean;
};

const pathStartsWith = (pathname: string, prefixes: string[]): boolean =>
  prefixes.some((prefix) => pathname.startsWith(prefix));

const navDropdowns: NavDropdown[] = [
  {
    id: "exploreDropdown",
    label: "Explore",
    icon: "fas fa-compass",
    isActive: (path) =>
      pathStartsWith(path, ["/explore", "/guides", "/trending", "/leaderboard"]),
    sections: [
      {
        items: [
          { label: "Explore All", icon: "fas fa-search", to: "/explore" },
        ],
        dividerAfter: true,
      },
      {
        items: [
          { label: "UGC Content", icon: "fas fa-video", to: "/explore/ugc" },
          { label: "Local Guides", icon: "fas fa-user-tie", to: "/guides" },
          { label: "Trending", icon: "fas fa-fire", to: "/trending" },
          { label: "Leaderboard", icon: "fas fa-trophy", to: "/leaderboard" },
        ],
      },
    ],
  },
  {
    id: "servicesDropdown",
    label: "Services",
    icon: "fas fa-concierge-bell",
    isActive: (path) => pathStartsWith(path, ["/services"]),
    sections: [
      {
        items: [
          { label: "All Services", icon: "fas fa-list", to: "/services" },
          {
            label: "Categories",
            icon: "fas fa-th-large",
            to: "/services/categories",
          },
          { label: "Providers", icon: "fas fa-users", to: "/providers" },
        ],
      },
    ],
  },
  {
    id: "guidersDropdown",
    label: "Guiders",
    icon: "fas fa-user-tie",
    isActive: (path) => pathStartsWith(path, ["/guider", "/guides"]),
    sections: [
      {
        header: { icon: "fas fa-tachometer-alt", text: "Dashboard" },
        items: [
          {
            label: "Dashboard",
            icon: "fas fa-home",
            href: "https://guider.our-bride.com",
          },
        ],
        dividerAfter: true,
      },
      {
        header: { icon: "fas fa-file-alt", text: "Content" },
        items: [
          {
            label: "Content List",
            icon: "fas fa-list",
            href: "https://guider.our-bride.com/content",
          },
          {
            label: "Create Content",
            icon: "fas fa-plus",
            href: "https://guider.our-bride.com/content/new",
          },
        ],
        dividerAfter: true,
      },
      {
        header: { icon: "fas fa-bullhorn", text: "Campaigns" },
        items: [
          {
            label: "All Campaigns",
            icon: "fas fa-list",
            href: "https://guider.our-bride.com/campaigns",
          },
        ],
        dividerAfter: true,
      },
      {
        header: { icon: "fas fa-link", text: "Affiliate" },
        items: [
          {
            label: "Affiliate Overview",
            icon: "fas fa-chart-line",
            href: "https://guider.our-bride.com/affiliate",
          },
          {
            label: "Affiliate Links",
            icon: "fas fa-link",
            href: "https://guider.our-bride.com/affiliate/links",
          },
          {
            label: "Affiliate Offers",
            icon: "fas fa-tags",
            href: "https://guider.our-bride.com/affiliate/offers",
          },
          {
            label: "Affiliate Events",
            icon: "fas fa-calendar-alt",
            href: "https://guider.our-bride.com/affiliate/events",
          },
        ],
        dividerAfter: true,
      },
      {
        header: { icon: "fas fa-wallet", text: "Wallet" },
        items: [
          {
            label: "Wallet Overview",
            icon: "fas fa-wallet",
            href: "https://guider.our-bride.com/wallet",
          },
          {
            label: "Transactions",
            icon: "fas fa-exchange-alt",
            href: "https://guider.our-bride.com/wallet/transactions",
          },
          {
            label: "Payouts",
            icon: "fas fa-money-check-alt",
            href: "https://guider.our-bride.com/wallet/payouts",
          },
          {
            label: "Tax Invoices",
            icon: "fas fa-file-invoice",
            href: "https://guider.our-bride.com/wallet/invoices",
          },
        ],
        dividerAfter: true,
      },
      {
        header: { icon: "fas fa-chart-bar", text: "Analytics" },
        items: [
          {
            label: "Analytics Overview",
            icon: "fas fa-chart-pie",
            href: "https://guider.our-bride.com/analytics",
          },
          {
            label: "Content Analytics",
            icon: "fas fa-file-alt",
            href: "https://guider.our-bride.com/analytics/content",
          },
          {
            label: "Affiliate Analytics",
            icon: "fas fa-link",
            href: "https://guider.our-bride.com/analytics/affiliate",
          },
          {
            label: "Campaign Analytics",
            icon: "fas fa-bullhorn",
            href: "https://guider.our-bride.com/analytics/campaigns",
          },
        ],
        dividerAfter: true,
      },
      {
        header: { icon: "fas fa-trophy", text: "Rank & Badges" },
        items: [
          {
            label: "My Rank",
            icon: "fas fa-star",
            href: "https://guider.our-bride.com/rank",
          },
          {
            label: "Badges",
            icon: "fas fa-medal",
            href: "https://guider.our-bride.com/rank/badges",
          },
          {
            label: "Leaderboard",
            icon: "fas fa-trophy",
            href: "https://guider.our-bride.com/rank/leaderboard",
          },
        ],
        dividerAfter: true,
      },
      {
        header: { icon: "fas fa-user", text: "Profile" },
        items: [
          {
            label: "My Profile",
            icon: "fas fa-user",
            href: "https://guider.our-bride.com/profile",
          },
          {
            label: "Public Profile",
            icon: "fas fa-eye",
            href: "https://guider.our-bride.com/profile/public",
          },
          {
            label: "Settings",
            icon: "fas fa-cog",
            href: "https://guider.our-bride.com/profile/settings",
          },
          {
            label: "Profile Links",
            icon: "fas fa-link",
            href: "https://guider.our-bride.com/profile/links",
          },
        ],
        dividerAfter: true,
      },
      {
        header: { icon: "fas fa-tools", text: "Tools & Help" },
        items: [
          {
            label: "Status",
            icon: "fas fa-info-circle",
            href: "https://guider.our-bride.com/status",
          },
          {
            label: "Help",
            icon: "fas fa-question-circle",
            href: "https://guider.our-bride.com/help",
          },
          {
            label: "Support",
            icon: "fas fa-headset",
            href: "https://guider.our-bride.com/help/support",
          },
        ],
      },
    ],
  },
];

const primaryNavLinks: PrimaryNavLink[] = [
  {
    label: "Providers",
    icon: "fas fa-users",
    to: "/providers",
    isActive: (path) =>
      path === "/providers" || path.startsWith("/providers/"),
  },
  {
    label: "Community",
    icon: "fas fa-comments",
    to: "/community",
    isActive: (path) => path === "/community" || path.startsWith("/community"),
  },
];

const profileMenuItems: MenuItem[] = [
  { label: "My Profile", icon: "fas fa-user", to: "/me/profile" },
  { label: "My Bookings", icon: "fas fa-calendar-check", to: "/me/my-bookings" },
  { label: "My Favorites", icon: "fas fa-heart", to: "/me/my-favorites" },
  { label: "My Coupons", icon: "fas fa-ticket-alt", to: "/me/my-coupons" },
];

const plannerMenuItems: MenuItem[] = [
  { label: "Checklist", icon: "fas fa-tasks", to: "/planner" },
  { label: "Budget", icon: "fas fa-dollar-sign", to: "/planner/budget" },
  { label: "Guest List", icon: "fas fa-user-friends", to: "/planner/guest-list" },
  { label: "Timeline", icon: "fas fa-clock", to: "/planner/timeline" },
  { label: "Calendar", icon: "fas fa-calendar", to: "/planner/calendar" },
  { label: "Planner Favorites", icon: "fas fa-heart", to: "/planner/favorites" },
];

export default function NavBar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [downloadBarVisible, setDownloadBarVisible] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, removeSession } = useAuth();

  useEffect(() => {
    const checkBarVisibility = () => {
      const dismissed = localStorage.getItem("appDownloadBarDismissed");
      setDownloadBarVisible(dismissed !== "true");
    };

    checkBarVisibility();

    const handleBarDismissed = () => {
      setDownloadBarVisible(false);
    };

    window.addEventListener("appDownloadBarDismissed", handleBarDismissed);
    window.addEventListener("storage", checkBarVisibility);

    return () => {
      window.removeEventListener("appDownloadBarDismissed", handleBarDismissed);
      window.removeEventListener("storage", checkBarVisibility);
    };
  }, []);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (
        isUserMenuOpen &&
        !target.closest("#userProfileDropdown") &&
        !target.closest(".dropdown-menu")
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  const closeAllMenus = (): void => {
    setIsUserMenuOpen(false);
    closeMobileMenu();
  };

  const handleLogout = async (): Promise<void> => {
    await removeSession();
    navigate("/");
    closeAllMenus();
  };

  const renderMenuLink = (
    item: MenuItem,
    onSelect: () => void,
    className = "dropdown-item"
  ): JSX.Element => {
    const content = (
      <>
        <i className={`${item.icon} me-2`}></i>
        {item.label}
      </>
    );

    if (item.to) {
      return (
        <Link className={className} to={item.to} onClick={onSelect}>
          {content}
        </Link>
      );
    }

    if (item.href) {
      return (
        <a
          className={className}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onSelect}
        >
          {content}
        </a>
      );
    }

    return <span className={className}>{content}</span>;
  };

  const renderDropdownSections = (sections: DropdownSection[]): JSX.Element[] =>
    sections.map((section, index) => (
      <Fragment key={`${section.header?.text ?? "section"}-${index}`}>
        {section.header && (
          <li>
            <h6 className="dropdown-header">
              <i className={`${section.header.icon} me-2`}></i>
              {section.header.text}
            </h6>
          </li>
        )}
        {section.items.map((item) => (
          <li key={`${item.label}-${item.to ?? item.href}`}>
            {renderMenuLink(item, closeMobileMenu)}
          </li>
        ))}
        {section.dividerAfter && (
          <li>
            <hr className="dropdown-divider" />
          </li>
        )}
      </Fragment>
    ));

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top navbar-modern ${
        isScrolled ? "navbar-scrolled" : "navbar-transparent"
      }`}
      style={{ top: downloadBarVisible ? "48px" : "0" }}
    >
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeMobileMenu}>
          <img src={logo} alt="OurBride" className="navbar-logo" />
        </Link>

        <button
          className={`navbar-toggler ${!isMobileMenuOpen ? "collapsed" : ""}`}
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-controls="navbarSupportedContent"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navDropdowns.map((dropdown) => (
              <li className="nav-item dropdown" key={dropdown.id}>
                <Link
                  className={`nav-link dropdown-toggle ${
                    dropdown.isActive(location.pathname) ? "active" : ""
                  }`}
                  to="#"
                  id={dropdown.id}
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(event) => event.preventDefault()}
                >
                  <i className={`${dropdown.icon} nav-icon`}></i>
                  <span>{dropdown.label}</span>
                </Link>
                <ul className="dropdown-menu" aria-labelledby={dropdown.id}>
                  {renderDropdownSections(dropdown.sections)}
                </ul>
              </li>
            ))}

            {primaryNavLinks.map((link) => (
              <li className="nav-item" key={link.to}>
                <Link
                  className={`nav-link ${
                    link.isActive(location.pathname) ? "active" : ""
                  }`}
                  to={link.to}
                  onClick={closeMobileMenu}
                >
                  <i className={`${link.icon} nav-icon`}></i>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

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

              {isAuthenticated ? (
                <div className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle user-menu-toggle"
                    to="#"
                    id="userProfileDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded={isUserMenuOpen}
                    onClick={(event) => {
                      event.preventDefault();
                      setIsUserMenuOpen((prev) => !prev);
                    }}
                  >
                    <i className="fas fa-user-circle nav-icon"></i>
                    <span className="d-none d-md-inline">
                      {user?.userName || "Profile"}
                    </span>
                  </Link>
                  <ul
                    className={`dropdown-menu dropdown-menu-end ${
                      isUserMenuOpen ? "show" : ""
                    }`}
                    aria-labelledby="userProfileDropdown"
                    style={{ minWidth: "220px" }}
                  >
                    <li>
                      <h6 className="dropdown-header">
                        <i className="fas fa-user me-2"></i>
                        {user?.userName || "User"}
                      </h6>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    {profileMenuItems.map((item) => (
                      <li key={item.to}>
                        {renderMenuLink(item, closeAllMenus)}
                      </li>
                    ))}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <h6 className="dropdown-header">
                        <i className="fas fa-calendar-check me-2"></i>
                        Planner
                      </h6>
                    </li>
                    {plannerMenuItems.map((item) => (
                      <li key={item.to}>
                        {renderMenuLink(item, closeAllMenus)}
                      </li>
                    ))}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn btn-outline-main navbar-login-btn" onClick={closeMobileMenu}>
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
  );
}
