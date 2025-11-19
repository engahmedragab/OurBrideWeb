# Pages Folder Structure

All screen/page components have been reorganized into a grouped `pages` folder structure for better organization and maintainability.

## 📁 Folder Structure

```
src/pages/
├── core/              # Core public pages
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Explore.tsx
│   └── DownloadApp.tsx
│
├── auth/              # Authentication pages
│   ├── Login.tsx
│   ├── Register.tsx
│   └── DeleteAccount.tsx
│
├── marketplace/       # Marketplace & e-commerce pages
│   ├── ServicesHome.tsx
│   ├── ProductsHome.tsx
│   ├── GiftCardsHome.tsx
│   ├── MembershipsHome.tsx
│   ├── Services.tsx
│   ├── ServiceDetails.tsx
│   ├── ProductDetails.tsx
│   ├── Providers.tsx
│   ├── PublicProviderProfile.tsx
│   ├── PublicProviderStore.tsx
│   ├── PublicProviderLinks.tsx
│   ├── OffersList.tsx
│   ├── OfferDetail.tsx
│   └── ShopRedirect.tsx
│
├── planner/          # Wedding planner pages
│   ├── Planner.tsx
│   ├── PlannerChecklist.tsx
│   ├── PlannerBudget.tsx
│   ├── PlannerGuestList.tsx
│   ├── PlannerTimeline.tsx
│   ├── PlannerCalendar.tsx
│   └── PlannerFavorites.tsx
│
├── ugc/              # User-generated content pages
│   ├── UGCExplore.tsx
│   ├── UGCVideos.tsx
│   ├── UGCTopGuides.tsx
│   ├── UGCTopContent.tsx
│   ├── GuidesList.tsx
│   ├── GuidePublicProfile.tsx
│   ├── ContentViewer.tsx
│   ├── Trending.tsx
│   ├── Leaderboard.tsx
│   ├── CategoryContent.tsx
│   ├── ProviderUGC.tsx
│   └── ServiceUGC.tsx
│
├── community/        # Community pages
│   ├── CommunityHub.tsx
│   ├── ArticlesList.tsx
│   ├── ArticleDetail.tsx
│   ├── PostsList.tsx
│   ├── PostDetail.tsx
│   ├── BlogsList.tsx
│   ├── BlogDetail.tsx
│   ├── ReelsList.tsx
│   ├── ReelDetail.tsx
│   ├── PollsList.tsx
│   ├── PollDetail.tsx
│   ├── ContestsList.tsx
│   ├── ContestDetail.tsx
│   ├── TagsList.tsx
│   ├── TagDetail.tsx
│   ├── UnifiedContentPage.tsx
│   └── ProfilePage.tsx
│
├── user/             # User profile pages
│   ├── UserProfile.tsx
│   ├── ProfileView.tsx
│   ├── MyBookings.tsx
│   ├── MyFavorites.tsx
│   └── MyCoupons.tsx
│
├── orders/           # Order & cart pages
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── CreateOrder.tsx
│   ├── OrderSuccess.tsx
│   ├── MyOrders.tsx
│   ├── OrderDetails.tsx
│   └── UserCarts.tsx
│
├── invitations/      # Invitation pages
│   ├── Invitation.tsx
│   ├── CreateInvitation.tsx
│   ├── InvitationCard.tsx
│   ├── InvitationCard2.tsx
│   ├── InvitationCard3.tsx
│   └── InvitationCard4.tsx
│
├── legacy/           # Legacy pages
│   ├── Items.tsx
│   ├── Preparations.tsx
│   └── PreparationDetails.tsx
│
├── helps/            # Help & legal pages
│   ├── Support.tsx
│   ├── PrivacyPolicy.tsx
│   └── TermsAndConditions.tsx
│
├── deeplink/         # Deep link & tracking pages
│   ├── DeepLinkHandler.tsx
│   ├── DeepLinkRedirect.tsx
│   ├── CouponDeepLink.tsx
│   ├── AffiliateRedirect.tsx
│   ├── QRRedirect.tsx
│   └── OfferRedirect.tsx
│
└── become/           # Become guide/provider pages
    ├── BecomeGuide.tsx
    └── BecomeProvider.tsx
```

## 📝 Import Examples

### Before (Old Structure)
```typescript
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Services from "./Components/Services/Services";
```

### After (New Structure)
```typescript
import Home from "./pages/core/Home";
import Login from "./pages/auth/Login";
import Services from "./pages/marketplace/Services";
```

## ✅ Changes Made

1. ✅ Created grouped folder structure in `src/pages/`
2. ✅ Moved all page components from `Components/` to appropriate `pages/` subfolders
3. ✅ Updated all imports in `App.tsx` to use new paths
4. ✅ Fixed relative imports in moved files
5. ✅ Created missing files (`OrderDetails.tsx`, `UserCarts.tsx`)
6. ✅ Fixed broken imports in marketplace home pages

## 🎯 Benefits

- **Better Organization**: Pages grouped by feature/domain
- **Easier Navigation**: Clear folder structure makes finding files easier
- **Scalability**: Easy to add new pages in appropriate groups
- **Maintainability**: Related pages are grouped together
- **Consistency**: All page components follow the same structure

## 📌 Notes

- Non-page components (like `RoutLayout`, `NavBar`, `Footer`, etc.) remain in `Components/`
- Only screen/page components were moved to `pages/`
- All imports have been updated and verified
- No linting errors

---

*Last Updated: After reorganization*

