import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function GuiderLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [guideStatus, setGuideStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to access the guide workspace');
      navigate('/');
      return;
    }
    checkGuideStatus();
  }, [isAuthenticated]);

  const checkGuideStatus = async () => {
    try {
      const status = await guiderService.status.get();
      setGuideStatus(status);
      
      // Store guideProfileId if available
      if (status?.guideProfileId) {
        localStorage.setItem('guideProfileId', status.guideProfileId.toString());
      }
      
      // Redirect if pending
      if (status?.status === 'Pending' && !location.pathname.includes('/status')) {
        navigate('/status');
      }
    } catch (error) {
      console.error('Error checking guide status:', error);
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const menuItems = [
    { path: '/', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/content', icon: 'fas fa-file-alt', label: 'Content' },
    { path: '/affiliate', icon: 'fas fa-link', label: 'Affiliate' },
    { path: '/campaigns', icon: 'fas fa-bullhorn', label: 'Campaigns' },
    { path: '/rank', icon: 'fas fa-trophy', label: 'Rank & Badges' },
    { path: '/wallet', icon: 'fas fa-wallet', label: 'Wallet' },
    { path: '/analytics', icon: 'fas fa-chart-line', label: 'Analytics' },
    { path: '/reports', icon: 'fas fa-flag', label: 'Reports & Policies' },
    { path: '/help', icon: 'fas fa-question-circle', label: 'Help' },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        className={`bg-dark text-white ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}
        style={{
          width: sidebarOpen ? '250px' : '70px',
          transition: 'width 0.3s',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000,
        }}
      >
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            {sidebarOpen && <h5 className="mb-0">Guide Workspace</h5>}
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className={`fas fa-${sidebarOpen ? 'chevron-left' : 'chevron-right'}`}></i>
            </button>
          </div>

          <nav className="nav flex-column">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link text-white ${isActive(item.path) ? 'bg-primary' : ''}`}
                style={{
                  borderRadius: '4px',
                  marginBottom: '4px',
                  padding: '10px 15px',
                }}
              >
                <i className={`${item.icon} me-2`}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          <hr className="text-white my-4" />

          {/* Profile Section */}
          {sidebarOpen && (
            <div>
              <Link to="/profile" className="nav-link text-white">
                <i className="fas fa-user me-2"></i>
                Profile
              </Link>
              <Link to="/profile/settings" className="nav-link text-white">
                <i className="fas fa-cog me-2"></i>
                Settings
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: sidebarOpen ? '250px' : '70px',
          width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 70px)',
          transition: 'all 0.3s',
          padding: '20px',
        }}
      >
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            {location.pathname !== '/' && (
              <li className="breadcrumb-item active" aria-current="page">
                {location.pathname.split('/').pop()}
              </li>
            )}
          </ol>
        </nav>

        {children}
      </main>
    </div>
  );
}

