import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/Hooks/useAuth";
import logo from "@/Assets/logo.png";

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

// Products dropdown configuration
const productsDropdown: NavDropdown = {
  id: "productsDropdown",
  label: "Products",
  icon: "fas fa-store",
  isActive: (path) =>
    pathStartsWith(path, [
      "/products",
      "/shop",
      "/products-home",
      "/gift-cards-home",
      "/memberships-home",
    ]),
  sections: [
    {
      header: { icon: "fas fa-box", text: "Products" },
      items: [
        { label: "Shop", icon: "fas fa-shopping-bag", to: "/shop" },
        { label: "Products Home", icon: "fas fa-home", to: "/products-home" },
        { label: "Gift Cards", icon: "fas fa-gift", to: "/gift-cards-home" },
        { label: "Memberships", icon: "fas fa-crown", to: "/memberships-home" },
      ],
    },
  ],
};

// Services dropdown configuration
const servicesDropdown: NavDropdown = {
  id: "servicesDropdown",
  label: "Services",
  icon: "fas fa-concierge-bell",
  isActive: (path) =>
    pathStartsWith(path, [
      "/services",
      "/providers",
      "/offers",
      "/services-home",
    ]),
  sections: [
    {
      header: { icon: "fas fa-concierge-bell", text: "Services" },
      items: [
        { label: "All Services", icon: "fas fa-list", to: "/services" },
        { label: "Service Categories", icon: "fas fa-th-large", to: "/services/categories" },
        { label: "Services Home", icon: "fas fa-home", to: "/services-home" },
      ],
      dividerAfter: true,
    },
    {
      header: { icon: "fas fa-users", text: "Providers" },
      items: [
        { label: "All Providers", icon: "fas fa-users", to: "/providers" },
      ],
      dividerAfter: true,
    },
    {
      header: { icon: "fas fa-tags", text: "Offers & Deals" },
      items: [
        { label: "All Offers", icon: "fas fa-tags", to: "/offers" },
      ],
    },
  ],
};

const navDropdowns: NavDropdown[] = [productsDropdown, servicesDropdown];

const primaryNavLinks: PrimaryNavLink[] = [
  {
    label: "Home",
    icon: "fas fa-home",
    to: "/",
    isActive: (path) => path === "/" || path === "/home",
  },
  {
    label: "Community",
    icon: "fas fa-globe",
    to: "/community",
    isActive: (path) => path === "/community" || path.startsWith("/community"),
  },
];

const profileMenuItems: MenuItem[] = [
  { label: "My Profile", icon: "fas fa-user", to: "/me/profile" },
  { label: "My Bookings", icon: "fas fa-calendar-check", to: "/my-bookings" },
  { label: "My Favorites", icon: "fas fa-heart", to: "/my-favorites" },
  { label: "My Coupons", icon: "fas fa-ticket-alt", to: "/my-coupons" },
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, removeSession } = useAuth();

  // Check if we're on a dashboard/planner route to show the top bar
  const showDashboardBar = location.pathname.startsWith("/planner") ||
    location.pathname.startsWith("/me") ||
    location.pathname.startsWith("/my-");

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

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
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

  const renderDropdownSections = (
    sections: DropdownSection[],
    onItemClick?: () => void
  ): JSX.Element[] =>
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
            {renderMenuLink(item, onItemClick || closeMobileMenu)}
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
    <>
      {/* Top Dashboard Bar */}
      {showDashboardBar && (
        <div className="navbar-top-bar">
          <div className="container">
            <span className="navbar-top-bar-text">Dashboard</span>
          </div>
        </div>
      )}

      <nav
        className={`navbar navbar-expand-lg fixed-top navbar-modern ${isScrolled ? "navbar-scrolled" : "navbar-transparent"
          }`}
        style={{ top: downloadBarVisible ? (showDashboardBar ? "88px" : "48px") : (showDashboardBar ? "40px" : "0") }}
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
            {/* Navigation Links Container */}
            <div className="navbar-nav-container">
              <ul className="navbar-nav">
                {primaryNavLinks.map((link) => (
                  <li className="nav-item" key={link.to}>
                    <Link
                      className={`nav-link ${link.isActive(location.pathname) ? "active" : ""
                        }`}
                      to={link.to}
                      onClick={closeMobileMenu}
                    >
                      <i className={`${link.icon} nav-icon`}></i>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}

                {navDropdowns.map((dropdown) => (
                  <li className="nav-item dropdown" key={dropdown.id}>
                    <Link
                      className={`nav-link dropdown-toggle ${dropdown.isActive(location.pathname) ? "active" : ""
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
                      <i className="fas fa-chevron-down ms-1 nav-chevron"></i>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-lg" aria-labelledby={dropdown.id}>
                      {renderDropdownSections(dropdown.sections, closeMobileMenu)}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            {/* Search Bar */}
            <form className="navbar-search" onSubmit={handleSearch}>
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Search ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="navbar-search-btn">
                <i className="fas fa-search"></i>
              </button>
            </form>

            {/* Action Icons */}
            <div className="navbar-actions">
              <div className="navbar-action-icons">
                <Link to="/my-favorites" className="navbar-action-icon" onClick={closeMobileMenu}>
                  <i className="fas fa-heart"></i>
                </Link>
                <Link to="/cart" className="navbar-action-icon" onClick={closeMobileMenu}>
                  <i className="fas fa-shopping-cart"></i>
                </Link>
              </div>

              {isAuthenticated ? (
                <div className="nav-item dropdown">
                  <button
                    className="navbar-user-btn"
                    id="userProfileDropdown"
                    onClick={(event) => {
                      event.preventDefault();
                      setIsUserMenuOpen((prev) => !prev);
                    }}
                    aria-expanded={isUserMenuOpen}
                  >
                    <i className="fas fa-user"></i>
                  </button>
                  <ul
                    className={`dropdown-menu dropdown-menu-end ${isUserMenuOpen ? "show" : ""
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
      </nav>
    </>
  );
}
