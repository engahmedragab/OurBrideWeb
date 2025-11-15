import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAnalyticsConfig } from '../../config/analytics';
import { initializeAnalytics } from '../../utils/AnalyticsManager';
import { initializeAutoAnalytics } from '../../utils/autoAnalytics';
import { AuthProvider } from '../../Hooks/useAuth';

// Layout
import GuiderLayout from './Layout/GuiderLayout';

// Dashboard
import Dashboard from './Dashboard/Dashboard';

// Onboarding
import OnboardingProfile from './Onboarding/OnboardingProfile';
import OnboardingPortfolio from './Onboarding/OnboardingPortfolio';
import OnboardingVerification from './Onboarding/OnboardingVerification';
import OnboardingReview from './Onboarding/OnboardingReview';

// Status & Profile
import Status from './Status/Status';
import Profile from './Profile/Profile';
import ProfilePublic from './Profile/ProfilePublic';
import ProfileSettings from './Profile/ProfileSettings';
import ProfileLinks from './Profile/ProfileLinks';

// Content
import ContentList from './Content/ContentList';
import ContentCreate from './Content/ContentCreate';
import ContentEdit from './Content/ContentEdit';
import ContentDetail from './Content/ContentDetail';
import ContentInsights from './Content/ContentInsights';

// Affiliate
import AffiliateOverview from './Affiliate/AffiliateOverview';
import AffiliateLinks from './Affiliate/AffiliateLinks';
import AffiliateLinkDetail from './Affiliate/AffiliateLinkDetail';
import AffiliateOffers from './Affiliate/AffiliateOffers';
import AffiliateOfferDetail from './Affiliate/AffiliateOfferDetail';
import AffiliateEvents from './Affiliate/AffiliateEvents';

// Campaigns
import CampaignsList from './Campaigns/CampaignsList';
import CampaignDetail from './Campaigns/CampaignDetail';
import CampaignInvites from './Campaigns/CampaignInvites';
import CampaignInviteDetail from './Campaigns/CampaignInviteDetail';
import CampaignMilestones from './Campaigns/CampaignMilestones';
import CampaignDeliverables from './Campaigns/CampaignDeliverables';
import CampaignChat from './Campaigns/CampaignChat';
import CampaignInsights from './Campaigns/CampaignInsights';

// Rank & Badges
import Rank from './Rank/Rank';
import Badges from './Rank/Badges';
import Leaderboard from './Rank/Leaderboard';

// Wallet
import Wallet from './Wallet/Wallet';
import WalletTransactions from './Wallet/WalletTransactions';
import PayoutsList from './Wallet/PayoutsList';
import PayoutCreate from './Wallet/PayoutCreate';
import PayoutDetail from './Wallet/PayoutDetail';
import TaxInvoices from './Wallet/TaxInvoices';

// Analytics
import AnalyticsOverview from './Analytics/AnalyticsOverview';
import AnalyticsContent from './Analytics/AnalyticsContent';
import AnalyticsAffiliate from './Analytics/AnalyticsAffiliate';
import AnalyticsCampaigns from './Analytics/AnalyticsCampaigns';

// Reports & Policies
import Reports from './Reports/Reports';
import Policies from './Reports/Policies';

// Help & Support
import Help from './Help/Help';
import Support from './Help/Support';
import Announcements from './Help/Announcements';

// Tools
import QRGenerator from './Tools/QRGenerator';
import ShareTool from './Tools/ShareTool';
import PreviewTool from './Tools/PreviewTool';

export default function GuiderApp() {
  // Initialize analytics for guider subdomain
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
    // Dashboard
    {
      path: '/',
      element: <GuiderLayout><Dashboard /></GuiderLayout>,
    },

    // Onboarding
    {
      path: '/onboarding',
      element: <GuiderLayout><OnboardingProfile /></GuiderLayout>,
    },
    {
      path: '/onboarding/profile',
      element: <GuiderLayout><OnboardingProfile /></GuiderLayout>,
    },
    {
      path: '/onboarding/portfolio',
      element: <GuiderLayout><OnboardingPortfolio /></GuiderLayout>,
    },
    {
      path: '/onboarding/verification',
      element: <GuiderLayout><OnboardingVerification /></GuiderLayout>,
    },
    {
      path: '/onboarding/review',
      element: <GuiderLayout><OnboardingReview /></GuiderLayout>,
    },

    // Status
    {
      path: '/status',
      element: <GuiderLayout><Status /></GuiderLayout>,
    },

    // Profile
    {
      path: '/profile',
      element: <GuiderLayout><Profile /></GuiderLayout>,
    },
    {
      path: '/profile/public',
      element: <GuiderLayout><ProfilePublic /></GuiderLayout>,
    },
    {
      path: '/profile/settings',
      element: <GuiderLayout><ProfileSettings /></GuiderLayout>,
    },
    {
      path: '/profile/links',
      element: <GuiderLayout><ProfileLinks /></GuiderLayout>,
    },

    // Content
    {
      path: '/content',
      element: <GuiderLayout><ContentList /></GuiderLayout>,
    },
    {
      path: '/content/new',
      element: <GuiderLayout><ContentCreate /></GuiderLayout>,
    },
    {
      path: '/content/drafts',
      element: <GuiderLayout><ContentList filter="drafts" /></GuiderLayout>,
    },
    {
      path: '/content/submitted',
      element: <GuiderLayout><ContentList filter="submitted" /></GuiderLayout>,
    },
    {
      path: '/content/published',
      element: <GuiderLayout><ContentList filter="published" /></GuiderLayout>,
    },
    {
      path: '/content/rejected',
      element: <GuiderLayout><ContentList filter="rejected" /></GuiderLayout>,
    },
    {
      path: '/content/:contentId',
      element: <GuiderLayout><ContentDetail /></GuiderLayout>,
    },
    {
      path: '/content/:contentId/edit',
      element: <GuiderLayout><ContentEdit /></GuiderLayout>,
    },
    {
      path: '/content/:contentId/insights',
      element: <GuiderLayout><ContentInsights /></GuiderLayout>,
    },

    // Affiliate
    {
      path: '/affiliate',
      element: <GuiderLayout><AffiliateOverview /></GuiderLayout>,
    },
    {
      path: '/affiliate/links',
      element: <GuiderLayout><AffiliateLinks /></GuiderLayout>,
    },
    {
      path: '/affiliate/links/new',
      element: <GuiderLayout><AffiliateLinkDetail isNew /></GuiderLayout>,
    },
    {
      path: '/affiliate/links/:linkId',
      element: <GuiderLayout><AffiliateLinkDetail /></GuiderLayout>,
    },
    {
      path: '/affiliate/offers',
      element: <GuiderLayout><AffiliateOffers /></GuiderLayout>,
    },
    {
      path: '/affiliate/offers/:offerId',
      element: <GuiderLayout><AffiliateOfferDetail /></GuiderLayout>,
    },
    {
      path: '/affiliate/events',
      element: <GuiderLayout><AffiliateEvents /></GuiderLayout>,
    },

    // Campaigns
    {
      path: '/campaigns',
      element: <GuiderLayout><CampaignsList /></GuiderLayout>,
    },
    {
      path: '/campaigns/:campaignId',
      element: <GuiderLayout><CampaignDetail /></GuiderLayout>,
    },
    {
      path: '/campaigns/:campaignId/invites',
      element: <GuiderLayout><CampaignInvites /></GuiderLayout>,
    },
    {
      path: '/campaigns/:campaignId/invites/:inviteId',
      element: <GuiderLayout><CampaignInviteDetail /></GuiderLayout>,
    },
    {
      path: '/campaigns/:campaignId/milestones',
      element: <GuiderLayout><CampaignMilestones /></GuiderLayout>,
    },
    {
      path: '/campaigns/:campaignId/deliverables',
      element: <GuiderLayout><CampaignDeliverables /></GuiderLayout>,
    },
    {
      path: '/campaigns/:campaignId/chat',
      element: <GuiderLayout><CampaignChat /></GuiderLayout>,
    },
    {
      path: '/campaigns/:campaignId/insights',
      element: <GuiderLayout><CampaignInsights /></GuiderLayout>,
    },

    // Rank & Badges
    {
      path: '/rank',
      element: <GuiderLayout><Rank /></GuiderLayout>,
    },
    {
      path: '/rank/badges',
      element: <GuiderLayout><Badges /></GuiderLayout>,
    },
    {
      path: '/rank/leaderboard',
      element: <GuiderLayout><Leaderboard /></GuiderLayout>,
    },

    // Wallet
    {
      path: '/wallet',
      element: <GuiderLayout><Wallet /></GuiderLayout>,
    },
    {
      path: '/wallet/transactions',
      element: <GuiderLayout><WalletTransactions /></GuiderLayout>,
    },
    {
      path: '/wallet/payouts',
      element: <GuiderLayout><PayoutsList /></GuiderLayout>,
    },
    {
      path: '/wallet/payouts/new',
      element: <GuiderLayout><PayoutCreate /></GuiderLayout>,
    },
    {
      path: '/wallet/payouts/:payoutId',
      element: <GuiderLayout><PayoutDetail /></GuiderLayout>,
    },
    {
      path: '/wallet/tax-invoices',
      element: <GuiderLayout><TaxInvoices /></GuiderLayout>,
    },

    // Analytics
    {
      path: '/analytics',
      element: <GuiderLayout><AnalyticsOverview /></GuiderLayout>,
    },
    {
      path: '/analytics/content',
      element: <GuiderLayout><AnalyticsContent /></GuiderLayout>,
    },
    {
      path: '/analytics/affiliate',
      element: <GuiderLayout><AnalyticsAffiliate /></GuiderLayout>,
    },
    {
      path: '/analytics/campaigns',
      element: <GuiderLayout><AnalyticsCampaigns /></GuiderLayout>,
    },

    // Reports & Policies
    {
      path: '/reports',
      element: <GuiderLayout><Reports /></GuiderLayout>,
    },
    {
      path: '/reports/policies',
      element: <GuiderLayout><Policies /></GuiderLayout>,
    },

    // Help & Support
    {
      path: '/help',
      element: <GuiderLayout><Help /></GuiderLayout>,
    },
    {
      path: '/help/support',
      element: <GuiderLayout><Support /></GuiderLayout>,
    },
    {
      path: '/help/announcements',
      element: <GuiderLayout><Announcements /></GuiderLayout>,
    },

    // Tools
    {
      path: '/tools/qr/:linkId',
      element: <GuiderLayout><QRGenerator /></GuiderLayout>,
    },
    {
      path: '/tools/share/:linkId',
      element: <GuiderLayout><ShareTool /></GuiderLayout>,
    },
    {
      path: '/tools/preview/:contentId',
      element: <GuiderLayout><PreviewTool /></GuiderLayout>,
    },
  ]);

  return (
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </AuthProvider>
    </HelmetProvider>
  );
}

