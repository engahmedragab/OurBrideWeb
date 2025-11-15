import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./Hooks/useAuth";
import RoutLayout from "./Components/RoutLayout/RoutLayout";
import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import Invitation from "./Components/Invitation/invitation";
import Items from "./Components/Items/Items";
import Contact from "./Components/Contact/Contact";
import Providers from "./Components/Providers/Providers";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import CreateInvitation from "./Components/CreateInvitation/CreateInvitation";
import InvitationCard from "./Components/InvitationCards/InvitationCard";
import InvitationCard2 from "./Components/InvitationCards/InvitationCard2";
import InvitationCard3 from "./Components/InvitationCards/InvitationCard3";
import InvitationCard4 from "./Components/InvitationCards/InvitationCard4";
import InvitationDataContextProvider from "./Context/InvitationDataContext";
import DeleteAccount from "./Components/DeleteAccount/DeleteAccount";
import TermsAndConditions from "./Components/Helps/TermsAndConditions";
import PrivacyPolicy from "./Components/Helps/PrivacyPolicy";
import Support from "./Components/Support/Support";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import { isCommunitySubdomain, isGuiderSubdomain, redirectToSubdomain } from "./utils/subdomainUtils";

import DeepLinkHandler from "./Components/DeepLink/DeepLinkHandler";
import DeepLinkRedirect from "./Components/DeepLink/DeepLinkRedirect";
import CouponDeepLink from "./Components/DeepLink/CouponDeepLink";
import PublicProviderProfile from "./Components/PublicProvider/PublicProviderProfile";
import PublicProviderStore from "./Components/PublicProvider/PublicProviderStore";
import PublicProviderLinks from "./Components/PublicProvider/PublicProviderLinks";
import Preparations from "./Components/Preparations/Preparations";
import PreparationDetails from "./Components/Preparations/PreparationDetails";
import Services from "./Components/Services/Services";
import ServiceDetails from "./Components/Services/ServiceDetails";
import ProductDetails from "./Components/Products/ProductDetails";

// Planner imports
import Planner from "./Components/Planner/Planner";
import PlannerChecklist from "./Components/Planner/PlannerChecklist";
import PlannerBudget from "./Components/Planner/PlannerBudget";
import PlannerGuestList from "./Components/Planner/PlannerGuestList";
import PlannerTimeline from "./Components/Planner/PlannerTimeline";
import PlannerCalendar from "./Components/Planner/PlannerCalendar";
import PlannerFavorites from "./Components/Planner/PlannerFavorites";

// UGC Public imports
import UGCExplore from "./Components/UGC/UGCExplore";
import UGCVideos from "./Components/UGC/UGCVideos";
import UGCTopGuides from "./Components/UGC/UGCTopGuides";
import UGCTopContent from "./Components/UGC/UGCTopContent";
import GuidesList from "./Components/UGC/GuidesList";
import GuidePublicProfile from "./Components/UGC/GuidePublicProfile";
import ContentViewer from "./Components/UGC/ContentViewer";
import Trending from "./Components/UGC/Trending";
import Leaderboard from "./Components/UGC/Leaderboard";
import CategoryContent from "./Components/UGC/CategoryContent";
import ProviderUGC from "./Components/UGC/ProviderUGC";
import ServiceUGC from "./Components/UGC/ServiceUGC";

// Become Guide/Provider imports
import BecomeGuide from "./Components/BecomeGuide/BecomeGuide";
import BecomeProvider from "./Components/BecomeProvider/BecomeProvider";

// Explore import
import Explore from "./Components/Explore/Explore";

// Download App import
import DownloadApp from "./Components/DownloadApp/DownloadApp";

// User Profile imports
import UserProfile from "./Components/UserProfile/UserProfile";
import ProfileView from "./Components/UserProfile/ProfileView";
import MyBookings from "./Components/UserProfile/MyBookings";
import MyFavorites from "./Components/UserProfile/MyFavorites";
import MyCoupons from "./Components/UserProfile/MyCoupons";

// Offers imports
import OffersList from "./Components/Offers/OffersList";
import OfferDetail from "./Components/Offers/OfferDetail";

// Shop redirect
import ShopRedirect from "./Components/Shop/ShopRedirect";

// Tracking redirects
import AffiliateRedirect from "./Components/DeepLink/AffiliateRedirect";
import QRRedirect from "./Components/DeepLink/QRRedirect";
import OfferRedirect from "./Components/DeepLink/OfferRedirect";

// Community imports
import CommunityHub from "./Components/Community/CommunityHub";
import ArticlesList from "./Components/Community/Articles/ArticlesList";
import ArticleDetail from "./Components/Community/Articles/ArticleDetail";
import PostsList from "./Components/Community/Posts/PostsList";
import PostDetail from "./Components/Community/Posts/PostDetail";
import BlogsList from "./Components/Community/Blogs/BlogsList";
import BlogDetail from "./Components/Community/Blogs/BlogDetail";
import ReelsList from "./Components/Community/Reels/ReelsList";
import ReelDetail from "./Components/Community/Reels/ReelDetail";
import PollsList from "./Components/Community/Polls/PollsList";
import PollDetail from "./Components/Community/Polls/PollDetail";
import ContestsList from "./Components/Community/Contests/ContestsList";
import ContestDetail from "./Components/Community/Contests/ContestDetail";
import TagsList from "./Components/Community/Tags/TagsList";
import TagDetail from "./Components/Community/Tags/TagDetail";
import UnifiedContentPage from "./Components/Community/Unified/UnifiedContentPage";
import ProfilePage from "./Components/Community/Profiles/ProfilePage";

// Analytics imports
import { getAnalyticsConfig } from "./config/analytics";
import { initializeAnalytics } from "./utils/AnalyticsManager";
import { initializeAutoAnalytics } from "./utils/autoAnalytics";
import AnalyticsToggle from "./Components/Analytics/AnalyticsToggle";


export default function App() {
  // Check if we're on community subdomain - if so, redirect to community app
  useEffect(() => {
    if (isCommunitySubdomain()) {
      // If on subdomain, we should use CommunityApp instead
      // For now, we'll handle it in the router, but you can also redirect
      // window.location.href = window.location.href.replace('community.', '');
    }
  }, []);

  // Initialize analytics on app start - delay until DOM is ready
  useEffect(() => {
    // Wait for DOM to be fully ready before initializing analytics
    const initAnalytics = () => {
      try {
        const analyticsConfig = getAnalyticsConfig();
        initializeAnalytics(analyticsConfig);
        // Delay autoAnalytics initialization to ensure DOM is ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          // DOM is already ready
          setTimeout(() => {
            try {
              initializeAutoAnalytics();
            } catch (error) {
              // AutoAnalytics initialization failed silently
            }
          }, 100);
        } else {
          // Wait for DOM to be ready
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

  const myRouter = createBrowserRouter([
    {
      path: "/",
      element: <RoutLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "home", element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "explore", element: <Explore /> },
        { path: "download-app", element: <DownloadApp /> },
        { path: "privacy", element: <PrivacyPolicy /> },
        { path: "terms", element: <TermsAndConditions /> },

        // Planner Routes
        {
          path: "planner",
          element: <Planner />,
          children: [
            { index: true, element: <PlannerChecklist /> },
            { path: "checklist", element: <PlannerChecklist /> },
            { path: "budget", element: <PlannerBudget /> },
            { path: "guest-list", element: <PlannerGuestList /> },
            { path: "guests", element: <PlannerGuestList /> },
            { path: "timeline", element: <PlannerTimeline /> },
            { path: "calendar", element: <PlannerCalendar /> },
            { path: "favorites", element: <PlannerFavorites /> },
          ],
        },

        // Services Routes
        { path: "services", element: <Services /> },
        { path: "services/categories", element: <Services /> },
        { path: "services/:id", element: <ServiceDetails /> },
        { path: "services/:serviceId/ugc", element: <ServiceUGC /> },

        // Providers Routes
        { path: "providers", element: <Providers /> },
        { path: "providers/:providerId", element: <PublicProviderProfile /> },
        { path: "providers/:providerId/ugc", element: <ProviderUGC /> },

        // Offers Routes
        { path: "offers", element: <OffersList /> },
        { path: "offers/:offerId", element: <OfferDetail /> },

        // Products Routes
        { path: "products/:productId", element: <ProductDetails /> },

        // Shop Redirect
        { path: "shop", element: <ShopRedirect /> },

        // UGC Public Routes
        {
          path: "explore/ugc",
          element: <UGCExplore />,
          children: [
            { index: true, element: <UGCVideos /> },
            { path: "videos", element: <UGCVideos /> },
            { path: "top-guides", element: <UGCTopGuides /> },
            { path: "top-content", element: <UGCTopContent /> },
          ],
        },
        { path: "guides", element: <GuidesList /> },
        { path: "guides/:handle", element: <GuidePublicProfile /> },
        { path: "content/:contentId", element: <ContentViewer /> },
        {
          path: "trending",
          element: <Trending />,
        },
        { path: "trending/:type", element: <Trending /> },
        { path: "leaderboard", element: <Leaderboard /> },
        { path: "category/:niche", element: <CategoryContent /> },

        // Become Guide/Provider Routes - Redirect to guider subdomain if accessed on main domain
        {
          path: "become-guide",
          element: <BecomeGuide />,
          loader: () => {
            // Redirect to guider subdomain if not already on it (except localhost)
            if (!isGuiderSubdomain() &&
              window.location.hostname !== 'localhost' &&
              window.location.hostname !== '127.0.0.1') {
              redirectToSubdomain('/', 'guider');
              return null;
            }
            return null;
          }
        },
        {
          path: "become-a-guide",
          element: <BecomeGuide />,
          loader: () => {
            // Redirect to guider subdomain if not already on it (except localhost)
            if (!isGuiderSubdomain() &&
              window.location.hostname !== 'localhost' &&
              window.location.hostname !== '127.0.0.1') {
              redirectToSubdomain('/', 'guider');
              return null;
            }
            return null;
          }
        },
        { path: "become-provider", element: <BecomeProvider /> },

        // User Profile Routes (Login Required)
        { path: "me", element: <UserProfile /> },
        { path: "me/profile", element: <ProfileView /> },
        { path: "my-bookings", element: <MyBookings /> },
        { path: "my-favorites", element: <MyFavorites /> },
        { path: "my-coupons", element: <MyCoupons /> },

        // Legacy/Other Routes
        { path: "invitation", element: <Invitation /> },
        { path: "items", element: <Items /> },
        { path: "preparations", element: <Preparations /> },
        { path: "preparations/:preparationId", element: <PreparationDetails /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "createInvitation", element: <CreateInvitation /> },
        { path: "invitationCard", element: <InvitationCard /> },
        { path: "invitationCard2", element: <InvitationCard2 /> },
        { path: "invitationCard3", element: <InvitationCard3 /> },
        { path: "invitationCard4", element: <InvitationCard4 /> },
        { path: "support", element: <Support /> },
        // Public Provider Marketplace Routes
        { path: "marketplace/providers/:id", element: <PublicProviderProfile /> },
        { path: "marketplace/providers/code/:code", element: <PublicProviderProfile /> },
        { path: "marketplace/providers/slug/:slug", element: <PublicProviderProfile /> },
        { path: "marketplace/providers/:providerId/store", element: <PublicProviderStore /> },
        { path: "marketplace/providers/:id/links", element: <PublicProviderLinks /> },
        { path: "marketplace/providers/code/:code/links", element: <PublicProviderLinks /> },
        { path: "marketplace/providers/slug/:slug/links", element: <PublicProviderLinks /> },
        // Community Routes - Redirect to subdomain if accessed on main domain
        {
          path: "community",
          element: <CommunityHub />,
          loader: () => {
            // Redirect to subdomain if not already on it (except localhost)
            if (!isCommunitySubdomain() &&
              window.location.hostname !== 'localhost' &&
              window.location.hostname !== '127.0.0.1') {
              redirectToSubdomain('/');
              return null;
            }
            return null;
          }
        },
        { path: "community/articles", element: <ArticlesList /> },
        { path: "community/articles/:slug", element: <ArticleDetail /> },
        { path: "community/posts", element: <PostsList /> },
        { path: "community/posts/:id", element: <PostDetail /> },
        { path: "community/blogs", element: <BlogsList /> },
        { path: "community/blogs/:slug", element: <BlogDetail /> },
        { path: "community/reels", element: <ReelsList /> },
        { path: "community/reels/:id", element: <ReelDetail /> },
        { path: "community/decision-groups", element: <PollsList /> },
        { path: "community/decision-groups/:id", element: <PollDetail /> },
        { path: "community/contests", element: <ContestsList /> },
        { path: "community/contests/:id", element: <ContestDetail /> },
        { path: "community/tags", element: <TagsList /> },
        { path: "community/tags/:slug", element: <TagDetail /> },
        { path: "community/unified/category/:id", element: <UnifiedContentPage /> },
        { path: "community/unified/item/:id", element: <UnifiedContentPage /> },
        { path: "community/unified/preparation/:id", element: <UnifiedContentPage /> },
        { path: "community/unified/provider/:id", element: <UnifiedContentPage /> },
        { path: "community/unified/bazaar-event/:id", element: <UnifiedContentPage /> },
        { path: "community/profiles/user/:id", element: <ProfilePage /> },
        { path: "community/profiles/provider/:id", element: <ProfilePage /> },
        { path: "community/profiles/bazaar-event/:id", element: <ProfilePage /> },
        // Legacy route support
        { path: "community/profiles/user/:userGuid", element: <ProfilePage /> },
        { path: "community/profiles/provider/:providerId", element: <ProfilePage /> },
        { path: "community/profiles/bazaar-event/:eventId", element: <ProfilePage /> },
      ],
    },
    {
      path: "/dl/:shortCode", // 🔥 This handles short links like our-bride.com/dl/abc123
      element: <DeepLinkHandler />,
    },
    {
      path: "/app/coupon", // Special coupon route - redirects to store if app not installed
      element: <CouponDeepLink />,
    },
    {
      path: "/app/*",
      element: <DeepLinkRedirect />,
    },
    {
      path: "/scan/*",
      element: <DeepLinkRedirect />,
    },
    {
      path: "/redirect*",
      element: <DeepLinkRedirect />,
    },
    // Tracking Routes (Public Redirects)
    {
      path: "/go/:affiliateCode",
      element: <AffiliateRedirect />,
    },
    {
      path: "/qr/:type/:id",
      element: <QRRedirect />,
    },
    {
      path: "/qr/:qrCode",
      element: <QRRedirect />,
    },
    {
      path: "/o/:offerCode",
      element: <OfferRedirect />,
    },
    {
      path: "/delete-account",
      element: <DeleteAccount />,
    },
    {
      path: "/terms-conditions",
      element: <TermsAndConditions />,
    },
    {
      path: "/privacy-policy",
      element: <PrivacyPolicy />,
    },
  ]);

  return (
    <HelmetProvider>
      <AuthProvider>
        <InvitationDataContextProvider>
          <RouterProvider router={myRouter} />
          <ToastContainer />
        </InvitationDataContextProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}


