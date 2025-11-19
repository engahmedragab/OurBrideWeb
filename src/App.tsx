import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./Hooks/useAuth";
import RoutLayout from "./Components/RoutLayout/RoutLayout";
import InvitationDataContextProvider from "./Context/InvitationDataContext";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import { isCommunitySubdomain, isGuiderSubdomain, redirectToSubdomain } from "./utils/subdomainUtils";

// Core pages
import Home from "./pages/core/Home";
import About from "./pages/core/About";
import Contact from "./pages/core/Contact";
import Explore from "./pages/core/Explore";
import DownloadApp from "./pages/core/DownloadApp";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DeleteAccount from "./pages/auth/DeleteAccount";

// Marketplace pages
import ServicesHome from "./pages/marketplace/ServicesHome";
import ProductsHome from "./pages/marketplace/ProductsHome";
import GiftCardsHome from "./pages/marketplace/GiftCardsHome";
import MembershipsHome from "./pages/marketplace/MembershipsHome";
import Services from "./pages/marketplace/Services";
import ServiceDetails from "./pages/marketplace/ServiceDetails";
import ProductDetails from "./pages/marketplace/ProductDetails";
import Providers from "./pages/marketplace/Providers";
import PublicProviderProfile from "./pages/marketplace/PublicProviderProfile";
import PublicProviderStore from "./pages/marketplace/PublicProviderStore";
import PublicProviderLinks from "./pages/marketplace/PublicProviderLinks";
import OffersList from "./pages/marketplace/OffersList";
import OfferDetail from "./pages/marketplace/OfferDetail";
import ShopRedirect from "./pages/marketplace/ShopRedirect";

// Planner pages
import Planner from "./pages/planner/Planner";
import PlannerChecklist from "./pages/planner/PlannerChecklist";
import PlannerBudget from "./pages/planner/PlannerBudget";
import PlannerGuestList from "./pages/planner/PlannerGuestList";
import PlannerTimeline from "./pages/planner/PlannerTimeline";
import PlannerCalendar from "./pages/planner/PlannerCalendar";
import PlannerFavorites from "./pages/planner/PlannerFavorites";



// Community pages
import CommunityHub from "./pages/community/CommunityHub";
import ArticlesList from "./pages/community/ArticlesList";
import ArticleDetail from "./pages/community/ArticleDetail";
import PostsList from "./pages/community/PostsList";
import PostDetail from "./pages/community/PostDetail";
import BlogsList from "./pages/community/BlogsList";
import BlogDetail from "./pages/community/BlogDetail";
import ReelsList from "./pages/community/ReelsList";
import ReelDetail from "./pages/community/ReelDetail";
import PollsList from "./pages/community/PollsList";
import PollDetail from "./pages/community/PollDetail";
import ContestsList from "./pages/community/ContestsList";
import ContestDetail from "./pages/community/ContestDetail";
import TagsList from "./pages/community/TagsList";
import TagDetail from "./pages/community/TagDetail";
import UnifiedContentPage from "./pages/community/UnifiedContentPage";
import ProfilePage from "./pages/community/ProfilePage";

// User pages
import UserProfile from "./pages/user/UserProfile";
import ProfileView from "./pages/user/ProfileView";
import MyBookings from "./pages/user/MyBookings";
import MyFavorites from "./pages/user/MyFavorites";
import MyCoupons from "./pages/user/MyCoupons";

// Orders pages
import Cart from "./pages/orders/Cart";
import Checkout from "./pages/orders/Checkout";
import CreateOrder from "./pages/orders/CreateOrder";
import OrderSuccess from "./pages/orders/OrderSuccess";
import MyOrders from "./pages/orders/MyOrders";
import OrderDetails from "./pages/orders/OrderDetails";
import UserCarts from "./pages/orders/UserCarts";

// Invitations pages
import Invitation from "./pages/invitations/Invitation";
import CreateInvitation from "./pages/invitations/CreateInvitation";
import InvitationCard from "./pages/invitations/InvitationCard";
import InvitationCard2 from "./pages/invitations/InvitationCard2";
import InvitationCard3 from "./pages/invitations/InvitationCard3";
import InvitationCard4 from "./pages/invitations/InvitationCard4";

// Legacy pages
import Items from "./pages/marketplace/Items";
import Preparations from "./pages/marketplace/Preparations";
import PreparationDetails from "./pages/marketplace/PreparationDetails";

// Helps pages
import Support from "./pages/helps/Support";
import PrivacyPolicy from "./pages/helps/PrivacyPolicy";
import TermsAndConditions from "./pages/helps/TermsAndConditions";

// DeepLink pages
import DeepLinkHandler from "./pages/deeplink/DeepLinkHandler";
import DeepLinkRedirect from "./pages/deeplink/DeepLinkRedirect";
import CouponDeepLink from "./pages/deeplink/CouponDeepLink";
import AffiliateRedirect from "./pages/deeplink/AffiliateRedirect";
import QRRedirect from "./pages/deeplink/QRRedirect";
import OfferRedirect from "./pages/deeplink/OfferRedirect";

// Become pages
import BecomeGuide from "./pages/become/BecomeGuide";
import BecomeProvider from "./pages/become/BecomeProvider";

// Analytics imports
import { getAnalyticsConfig } from "./config/analytics";
import { initializeAnalytics } from "./utils/AnalyticsManager";
import { initializeAutoAnalytics } from "./utils/autoAnalytics";


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
        { path: "services-home", element: <ServicesHome /> },
        { path: "products-home", element: <ProductsHome /> },
        { path: "gift-cards-home", element: <GiftCardsHome /> },
        { path: "memberships-home", element: <MembershipsHome /> },
        { path: "user-carts", element: <UserCarts /> },
        { path: "cart", element: <Cart /> },
        { path: "checkout", element: <Checkout /> },
        { path: "order/create", element: <CreateOrder /> },
        { path: "order/success", element: <OrderSuccess /> },
        { path: "my-orders", element: <MyOrders /> },
        { path: "order/:id", element: <OrderDetails /> },
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
        // { path: "services/:serviceId/ugc", element: <ServiceUGC /> },

        // Providers Routes
        { path: "providers", element: <Providers /> },
        { path: "providers/:providerId", element: <PublicProviderProfile /> },
        // { path: "providers/:providerId/ugc", element: <ProviderUGC /> },

        // Offers Routes
        { path: "offers", element: <OffersList /> },
        { path: "offers/:offerId", element: <OfferDetail /> },

        // Products Routes
        { path: "products/:productId", element: <ProductDetails /> },

        // Shop Redirect
        { path: "shop", element: <ShopRedirect /> },


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


