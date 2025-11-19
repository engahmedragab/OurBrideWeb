import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAnalyticsConfig } from '../../config/analytics';
import { initializeAnalytics } from '../../utils/AnalyticsManager';
import { initializeAutoAnalytics } from '../../utils/autoAnalytics';

// Community Components
import CommunityHub from '../../pages/community/CommunityHub';
import ArticlesList from '../../pages/community/ArticlesList';
import ArticleDetail from '../../pages/community/ArticleDetail';
import PostsList from '../../pages/community/PostsList';
import PostDetail from '../../pages/community/PostDetail';
import BlogsList from '../../pages/community/BlogsList';
import BlogDetail from '../../pages/community/BlogDetail';
import ReelsList from '../../pages/community/ReelsList';
import ReelDetail from '../../pages/community/ReelDetail';
import PollsList from '../../pages/community/PollsList';
import PollDetail from '../../pages/community/PollDetail';
import ContestsList from '../../pages/community/ContestsList';
import ContestDetail from '../../pages/community/ContestDetail';
import TagsList from '../../pages/community/TagsList';
import TagDetail from '../../pages/community/TagDetail';
import UnifiedContentPage from '../../pages/community/UnifiedContentPage';
import ProfilePage from '../../pages/community/ProfilePage';

// Layout component for community pages
function CommunityLayout({ children }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}

export default function CommunityApp() {
  // Initialize analytics for community subdomain
  useEffect(() => {
    const initAnalytics = () => {
      try {
        const analyticsConfig = getAnalyticsConfig();
        initializeAnalytics(analyticsConfig);
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          setTimeout(() => {
            try {
              initializeAutoAnalytics();
            } catch (error) {
              // AutoAnalytics initialization failed silently
            }
          }, 100);
        } else {
          window.addEventListener('load', () => {
            setTimeout(() => {
              try {
                initializeAutoAnalytics();
              } catch (error) {
                // AutoAnalytics initialization failed silently
              }
            }, 100);
          }, { once: true });
        }
      } catch (error) {
        // Analytics initialization failed silently
      }
    };
    initAnalytics();
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <CommunityLayout><CommunityHub /></CommunityLayout>,
    },
    {
      path: '/articles',
      element: <CommunityLayout><ArticlesList /></CommunityLayout>,
    },
    {
      path: '/articles/:slug',
      element: <CommunityLayout><ArticleDetail /></CommunityLayout>,
    },
    {
      path: '/posts',
      element: <CommunityLayout><PostsList /></CommunityLayout>,
    },
    {
      path: '/posts/:id',
      element: <CommunityLayout><PostDetail /></CommunityLayout>,
    },
    {
      path: '/blogs',
      element: <CommunityLayout><BlogsList /></CommunityLayout>,
    },
    {
      path: '/blogs/:slug',
      element: <CommunityLayout><BlogDetail /></CommunityLayout>,
    },
    {
      path: '/reels',
      element: <CommunityLayout><ReelsList /></CommunityLayout>,
    },
    {
      path: '/reels/:id',
      element: <CommunityLayout><ReelDetail /></CommunityLayout>,
    },
    {
      path: '/decision-groups',
      element: <CommunityLayout><PollsList /></CommunityLayout>,
    },
    {
      path: '/decision-groups/:id',
      element: <CommunityLayout><PollDetail /></CommunityLayout>,
    },
    {
      path: '/contests',
      element: <CommunityLayout><ContestsList /></CommunityLayout>,
    },
    {
      path: '/contests/:id',
      element: <CommunityLayout><ContestDetail /></CommunityLayout>,
    },
    {
      path: '/tags',
      element: <CommunityLayout><TagsList /></CommunityLayout>,
    },
    {
      path: '/tags/:slug',
      element: <CommunityLayout><TagDetail /></CommunityLayout>,
    },
    {
      path: '/unified/category/:id',
      element: <CommunityLayout><UnifiedContentPage /></CommunityLayout>,
    },
    {
      path: '/unified/item/:id',
      element: <CommunityLayout><UnifiedContentPage /></CommunityLayout>,
    },
    {
      path: '/unified/preparation/:id',
      element: <CommunityLayout><UnifiedContentPage /></CommunityLayout>,
    },
    {
      path: '/unified/provider/:id',
      element: <CommunityLayout><UnifiedContentPage /></CommunityLayout>,
    },
    {
      path: '/unified/bazaar-event/:id',
      element: <CommunityLayout><UnifiedContentPage /></CommunityLayout>,
    },
    {
      path: '/profiles/user/:id',
      element: <CommunityLayout><ProfilePage /></CommunityLayout>,
    },
    {
      path: '/profiles/provider/:id',
      element: <CommunityLayout><ProfilePage /></CommunityLayout>,
    },
    {
      path: '/profiles/bazaar-event/:id',
      element: <CommunityLayout><ProfilePage /></CommunityLayout>,
    },
    // Legacy route support
    {
      path: '/profiles/user/:userGuid',
      element: <CommunityLayout><ProfilePage /></CommunityLayout>,
    },
    {
      path: '/profiles/provider/:providerId',
      element: <CommunityLayout><ProfilePage /></CommunityLayout>,
    },
    {
      path: '/profiles/bazaar-event/:eventId',
      element: <CommunityLayout><ProfilePage /></CommunityLayout>,
    },
  ]);

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

