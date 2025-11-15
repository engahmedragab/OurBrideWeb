import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAnalyticsConfig } from '../../config/analytics';
import { initializeAnalytics } from '../../utils/AnalyticsManager';
import { initializeAutoAnalytics } from '../../utils/autoAnalytics';

// Community Components
import CommunityHub from './CommunityHub';
import ArticlesList from './Articles/ArticlesList';
import ArticleDetail from './Articles/ArticleDetail';
import PostsList from './Posts/PostsList';
import PostDetail from './Posts/PostDetail';
import BlogsList from './Blogs/BlogsList';
import BlogDetail from './Blogs/BlogDetail';
import ReelsList from './Reels/ReelsList';
import ReelDetail from './Reels/ReelDetail';
import PollsList from './Polls/PollsList';
import PollDetail from './Polls/PollDetail';
import ContestsList from './Contests/ContestsList';
import ContestDetail from './Contests/ContestDetail';
import TagsList from './Tags/TagsList';
import TagDetail from './Tags/TagDetail';
import UnifiedContentPage from './Unified/UnifiedContentPage';
import ProfilePage from './Profiles/ProfilePage';

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

