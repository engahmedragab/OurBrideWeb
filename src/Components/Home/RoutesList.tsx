import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Route {
  path: string;
  label: string;
  category: string;
  requiresAuth?: boolean;
  note?: string;
}

const allRoutes: Route[] = [
  // Core Routes
  { path: '/', label: 'Home', category: 'Core' },
  { path: '/home', label: 'Home (Alt)', category: 'Core' },
  { path: '/about', label: 'About', category: 'Core' },
  { path: '/contact', label: 'Contact', category: 'Core' },
  { path: '/explore', label: 'Explore', category: 'Core' },
  { path: '/download-app', label: 'Download App', category: 'Core' },
  
  // Auth Routes
  { path: '/login', label: 'Login', category: 'Auth' },
  { path: '/register', label: 'Register', category: 'Auth' },
  { path: '/delete-account', label: 'Delete Account', category: 'Auth' },
  
  // Marketplace - Home Pages
  { path: '/services-home', label: 'Services Home', category: 'Marketplace' },
  { path: '/products-home', label: 'Products Home', category: 'Marketplace' },
  { path: '/gift-cards-home', label: 'Gift Cards Home', category: 'Marketplace' },
  { path: '/memberships-home', label: 'Memberships Home', category: 'Marketplace' },
  
  // Marketplace - Services
  { path: '/services', label: 'Services List', category: 'Marketplace' },
  { path: '/services/categories', label: 'Services Categories', category: 'Marketplace' },
  { path: '/services/:id', label: 'Service Details (ID)', category: 'Marketplace', note: 'Replace :id with actual ID' },
  
  // Marketplace - Providers
  { path: '/providers', label: 'Providers List', category: 'Marketplace' },
  { path: '/providers/:providerId', label: 'Provider Profile (ID)', category: 'Marketplace', note: 'Replace :providerId with actual ID' },
  { path: '/marketplace/providers/:id', label: 'Provider Profile (Marketplace)', category: 'Marketplace', note: 'Replace :id with actual ID' },
  { path: '/marketplace/providers/code/:code', label: 'Provider Profile (Code)', category: 'Marketplace', note: 'Replace :code with actual code' },
  { path: '/marketplace/providers/slug/:slug', label: 'Provider Profile (Slug)', category: 'Marketplace', note: 'Replace :slug with actual slug' },
  { path: '/marketplace/providers/:providerId/store', label: 'Provider Store', category: 'Marketplace', note: 'Replace :providerId with actual ID' },
  { path: '/marketplace/providers/:id/links', label: 'Provider Links (ID)', category: 'Marketplace', note: 'Replace :id with actual ID' },
  { path: '/marketplace/providers/code/:code/links', label: 'Provider Links (Code)', category: 'Marketplace', note: 'Replace :code with actual code' },
  { path: '/marketplace/providers/slug/:slug/links', label: 'Provider Links (Slug)', category: 'Marketplace', note: 'Replace :slug with actual slug' },
  
  // Marketplace - Products
  { path: '/products/:productId', label: 'Product Details', category: 'Marketplace', note: 'Replace :productId with actual ID' },
  { path: '/shop', label: 'Shop Redirect', category: 'Marketplace' },
  
  // Marketplace - Offers
  { path: '/offers', label: 'Offers List', category: 'Marketplace' },
  { path: '/offers/:offerId', label: 'Offer Detail', category: 'Marketplace', note: 'Replace :offerId with actual ID' },
  
  // Planner Routes
  { path: '/planner', label: 'Planner Dashboard', category: 'Planner' },
  { path: '/planner/checklist', label: 'Planner Checklist', category: 'Planner' },
  { path: '/planner/budget', label: 'Planner Budget', category: 'Planner' },
  { path: '/planner/guest-list', label: 'Planner Guest List', category: 'Planner' },
  { path: '/planner/guests', label: 'Planner Guests', category: 'Planner' },
  { path: '/planner/timeline', label: 'Planner Timeline', category: 'Planner' },
  { path: '/planner/calendar', label: 'Planner Calendar', category: 'Planner' },
  { path: '/planner/favorites', label: 'Planner Favorites', category: 'Planner' },
  
  // User Profile Routes
  { path: '/me', label: 'My Profile', category: 'User', requiresAuth: true },
  { path: '/me/profile', label: 'Profile View', category: 'User', requiresAuth: true },
  { path: '/my-bookings', label: 'My Bookings', category: 'User', requiresAuth: true },
  { path: '/my-favorites', label: 'My Favorites', category: 'User', requiresAuth: true },
  { path: '/my-coupons', label: 'My Coupons', category: 'User', requiresAuth: true },
  
  // Orders Routes
  { path: '/cart', label: 'Cart', category: 'Orders' },
  { path: '/user-carts', label: 'User Carts', category: 'Orders' },
  { path: '/checkout', label: 'Checkout', category: 'Orders' },
  { path: '/order/create', label: 'Create Order', category: 'Orders' },
  { path: '/order/success', label: 'Order Success', category: 'Orders' },
  { path: '/my-orders', label: 'My Orders', category: 'Orders' },
  { path: '/order/:id', label: 'Order Details', category: 'Orders', note: 'Replace :id with actual order ID' },
  
  // Invitations Routes
  { path: '/invitation', label: 'Invitation', category: 'Invitations', note: 'Requires slug parameter' },
  { path: '/createInvitation', label: 'Create Invitation', category: 'Invitations' },
  { path: '/invitationCard', label: 'Invitation Card 1', category: 'Invitations' },
  { path: '/invitationCard2', label: 'Invitation Card 2', category: 'Invitations' },
  { path: '/invitationCard3', label: 'Invitation Card 3', category: 'Invitations' },
  { path: '/invitationCard4', label: 'Invitation Card 4', category: 'Invitations' },
  
  // Community Routes
  { path: '/community', label: 'Community Hub', category: 'Community' },
  { path: '/community/articles', label: 'Articles List', category: 'Community' },
  { path: '/community/articles/:slug', label: 'Article Detail', category: 'Community', note: 'Replace :slug with actual slug' },
  { path: '/community/posts', label: 'Posts List', category: 'Community' },
  { path: '/community/posts/:id', label: 'Post Detail', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/blogs', label: 'Blogs List', category: 'Community' },
  { path: '/community/blogs/:slug', label: 'Blog Detail', category: 'Community', note: 'Replace :slug with actual slug' },
  { path: '/community/reels', label: 'Reels List', category: 'Community' },
  { path: '/community/reels/:id', label: 'Reel Detail', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/decision-groups', label: 'Decision Groups (Polls)', category: 'Community' },
  { path: '/community/decision-groups/:id', label: 'Decision Group Detail', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/contests', label: 'Contests List', category: 'Community' },
  { path: '/community/contests/:id', label: 'Contest Detail', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/tags', label: 'Tags List', category: 'Community' },
  { path: '/community/tags/:slug', label: 'Tag Detail', category: 'Community', note: 'Replace :slug with actual slug' },
  { path: '/community/unified/category/:id', label: 'Unified Category', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/unified/item/:id', label: 'Unified Item', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/unified/preparation/:id', label: 'Unified Preparation', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/unified/provider/:id', label: 'Unified Provider', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/unified/bazaar-event/:id', label: 'Unified Bazaar Event', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/profiles/user/:id', label: 'User Profile', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/profiles/provider/:id', label: 'Provider Profile', category: 'Community', note: 'Replace :id with actual ID' },
  { path: '/community/profiles/bazaar-event/:id', label: 'Bazaar Event Profile', category: 'Community', note: 'Replace :id with actual ID' },
  
  // Become Routes
  { path: '/become-guide', label: 'Become Guide', category: 'Become' },
  { path: '/become-a-guide', label: 'Become A Guide', category: 'Become' },
  { path: '/become-provider', label: 'Become Provider', category: 'Become' },
  
  // Legacy Routes
  { path: '/items', label: 'Items', category: 'Legacy' },
  { path: '/preparations', label: 'Preparations', category: 'Legacy' },
  { path: '/preparations/:preparationId', label: 'Preparation Details', category: 'Legacy', note: 'Replace :preparationId with actual ID' },
  
  // Help/Support Routes
  { path: '/support', label: 'Support', category: 'Help' },
  { path: '/privacy', label: 'Privacy Policy', category: 'Help' },
  { path: '/privacy-policy', label: 'Privacy Policy (Alt)', category: 'Help' },
  { path: '/terms', label: 'Terms & Conditions', category: 'Help' },
  { path: '/terms-conditions', label: 'Terms & Conditions (Alt)', category: 'Help' },
  
  // Deep Link Routes
  { path: '/dl/:shortCode', label: 'Deep Link Handler', category: 'Deep Links', note: 'Replace :shortCode with actual code' },
  { path: '/app/coupon', label: 'Coupon Deep Link', category: 'Deep Links' },
  { path: '/go/:affiliateCode', label: 'Affiliate Redirect', category: 'Deep Links', note: 'Replace :affiliateCode with actual code' },
  { path: '/qr/:type/:id', label: 'QR Redirect (Type/ID)', category: 'Deep Links', note: 'Replace :type and :id' },
  { path: '/qr/:qrCode', label: 'QR Redirect (Code)', category: 'Deep Links', note: 'Replace :qrCode with actual code' },
  { path: '/o/:offerCode', label: 'Offer Redirect', category: 'Deep Links', note: 'Replace :offerCode with actual code' },
];

const categoryColors: Record<string, string> = {
  'Core': 'primary',
  'Auth': 'danger',
  'Marketplace': 'success',
  'Planner': 'info',
  'User': 'warning',
  'Orders': 'secondary',
  'Invitations': 'purple',
  'Community': 'teal',
  'Become': 'orange',
  'Legacy': 'dark',
  'Help': 'blue',
  'Deep Links': 'pink',
};

export default function RoutesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const categories = ['All', ...Array.from(new Set(allRoutes.map(r => r.category)))];

  const filteredRoutes = allRoutes.filter(route => {
    const matchesSearch = route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || route.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedRoutes = filteredRoutes.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, Route[]>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">
            <i className="fas fa-route me-2"></i>
            All Routes - Testing Panel
          </h2>
          <p className="mb-0 mt-2 small">Click on any route to navigate. Use search and filters to find specific routes.</p>
        </div>
        <div className="card-body">
          {/* Search and Filter */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search routes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Routes List */}
          <div className="accordion" id="routesAccordion">
            {Object.entries(groupedRoutes).map(([category, routes]) => {
              const isExpanded = expandedCategories.has(category) || expandedCategories.size === 0;
              const colorClass = categoryColors[category] || 'secondary';
              
              return (
                <div key={category} className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${!isExpanded ? 'collapsed' : ''}`}
                      type="button"
                      onClick={() => toggleCategory(category)}
                    >
                      <span className={`badge bg-${colorClass} me-2`}>{routes.length}</span>
                      {category}
                    </button>
                  </h2>
                  <div className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}>
                    <div className="accordion-body">
                      <div className="row g-3">
                        {routes.map((route) => {
                          const hasParams = route.path.includes(':');
                          const displayPath = hasParams ? route.path : route.path;
                          
                          return (
                            <div key={route.path} className="col-md-6 col-lg-4">
                              <div className="card h-100 border">
                                <div className="card-body">
                                  <h6 className="card-title">
                                    {route.label}
                                    {route.requiresAuth && (
                                      <span className="badge bg-warning text-dark ms-2" title="Requires Authentication">
                                        <i className="fas fa-lock"></i>
                                      </span>
                                    )}
                                  </h6>
                                  <p className="card-text small text-muted font-monospace mb-2">
                                    {displayPath}
                                  </p>
                                  {route.note && (
                                    <p className="card-text small text-info mb-2">
                                      <i className="fas fa-info-circle me-1"></i>
                                      {route.note}
                                    </p>
                                  )}
                                  {!hasParams ? (
                                    <Link
                                      to={route.path}
                                      className="btn btn-sm btn-outline-primary w-100"
                                    >
                                      <i className="fas fa-external-link-alt me-1"></i>
                                      Navigate
                                    </Link>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-outline-secondary w-100"
                                      disabled
                                      title="This route requires parameters"
                                    >
                                      <i className="fas fa-code me-1"></i>
                                      Requires Params
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-4 p-3 bg-light rounded">
            <div className="row text-center">
              <div className="col-md-3">
                <h4 className="text-primary">{allRoutes.length}</h4>
                <small className="text-muted">Total Routes</small>
              </div>
              <div className="col-md-3">
                <h4 className="text-success">{allRoutes.filter(r => !r.path.includes(':')).length}</h4>
                <small className="text-muted">Direct Routes</small>
              </div>
              <div className="col-md-3">
                <h4 className="text-warning">{allRoutes.filter(r => r.path.includes(':')).length}</h4>
                <small className="text-muted">Parameter Routes</small>
              </div>
              <div className="col-md-3">
                <h4 className="text-danger">{allRoutes.filter(r => r.requiresAuth).length}</h4>
                <small className="text-muted">Auth Required</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

