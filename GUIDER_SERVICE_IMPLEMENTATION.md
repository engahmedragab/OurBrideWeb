# Guider Service Implementation

## ✅ Completed

### Service Layer
- **`src/services/guiderService.ts`** - Comprehensive service created with all API methods:
  - ✅ Guide Profile Management (CRUD, approval, tier, portfolio, verification, status, role management)
  - ✅ UGC Content Management (CRUD, moderation, search, analytics, reports, validation, notifications)
  - ✅ Tier Management (get, create, update, delete, user tier operations, analytics, reports, validation)
  - ✅ Referral Management (CRUD, code management, share events, analytics, reports, validation, notifications)
  - ✅ Loyalty Management (points, goals, user goals, analytics, reports, validation, notifications)
  - ✅ Wallet Management (CRUD, balance, ledger, tier, analytics, reports, validation)
  - ✅ Payout Management (requests, processing, methods, analytics, reports, validation, notifications)
  - ✅ Attribution Management (events, tracking, analytics, reports, validation, notifications)
  - ✅ Local Guider Onboarding (create, approve, reject)

## 📋 Service Structure

The service follows the same pattern as `plannerService.ts` and `purchaseService.ts`:
- Uses `OurbrideApi` from `ourbride-http-client`
- Extracts data using `extractData` helper
- Handles ApiResult format automatically
- All methods return promises with extracted data

## ⚠️ Components to Update

All guider components in `src/Components/Guider/` need to be updated to use the new service structure. The old service had different method names, so components need to be updated.

### Components Already Using guiderService (Need Updates):
1. **Profile Components** (`src/Components/Guider/Profile/`)
   - `Profile.tsx` - Uses `guiderService.profile.getById()`, `getByUserId()` ✅ (already correct)
   - `ProfilePublic.tsx` - Needs update
   - `ProfileSettings.tsx` - Needs update
   - `ProfileLinks.tsx` - Needs update

2. **Content Components** (`src/Components/Guider/Content/`)
   - `ContentList.tsx` - Uses `guiderService.content.getByGuide()` ✅ (already correct)
   - `ContentCreate.tsx` - Needs update to use `guiderService.ugcContent.create()`
   - `ContentDetail.tsx` - Needs update to use `guiderService.ugcContent.getById()`
   - `ContentEdit.tsx` - Needs update to use `guiderService.ugcContent.update()`
   - `ContentInsights.tsx` - Needs update to use `guiderService.ugcContent.getAnalytics()`

3. **Onboarding Components** (`src/Components/Guider/Onboarding/`)
   - `OnboardingProfile.tsx` - Needs update to use `guiderService.onboarding.create()`
   - `OnboardingPortfolio.tsx` - Needs update
   - `OnboardingVerification.tsx` - Needs update
   - `OnboardingReview.tsx` - Needs update

4. **Wallet Components** (`src/Components/Guider/Wallet/`)
   - `Wallet.tsx` - Needs update to use `guiderService.wallets.getByUserId()`
   - `WalletTransactions.tsx` - Needs update to use `guiderService.wallets.getLedger()`
   - `PayoutsList.tsx` - Needs update to use `guiderService.payouts.getRequestsByGuide()`
   - `PayoutCreate.tsx` - Needs update to use `guiderService.payouts.createRequest()`
   - `PayoutDetail.tsx` - Needs update to use `guiderService.payouts.getRequest()`
   - `TaxInvoices.tsx` - Needs update

5. **Affiliate Components** (`src/Components/Guider/Affiliate/`)
   - All components need updates (affiliate APIs are in a different service, but may need integration)

6. **Campaigns Components** (`src/Components/Guider/Campaigns/`)
   - All components need updates (campaign APIs are in a different service, but may need integration)

7. **Analytics Components** (`src/Components/Guider/Analytics/`)
   - `AnalyticsOverview.tsx` - Needs update to use `guiderService.guides.getAnalytics()`
   - `AnalyticsContent.tsx` - Needs update to use `guiderService.ugcContent.getGuideAnalytics()`
   - `AnalyticsAffiliate.tsx` - Needs update
   - `AnalyticsCampaigns.tsx` - Needs update

8. **Rank Components** (`src/Components/Guider/Rank/`)
   - `Rank.tsx` - Needs update to use `guiderService.tiers.getCurrentTierCode()`
   - `Leaderboard.tsx` - Needs update to use `guiderService.guides.getTop()`
   - `Badges.tsx` - Needs update

9. **Status Component** (`src/Components/Guider/Status/`)
   - `Status.tsx` - Needs update to use `guiderService.guides.getStatus()`

10. **Dashboard Component** (`src/Components/Guider/Dashboard/`)
    - `Dashboard.tsx` - Needs update to use various guiderService methods

## 🔄 Migration Guide

### Old Service vs New Service

**Old Method Names** → **New Method Names**

#### Profile:
- `guiderService.profile.getById()` → ✅ Same
- `guiderService.profile.getByUserId()` → ✅ Same
- `guiderService.profile.getByHandle()` → ✅ Same
- `guiderService.profile.create()` → ✅ Same
- `guiderService.profile.update()` → ✅ Same

#### Content:
- `guiderService.content.getByGuide()` → `guiderService.ugcContent.getByGuide()` ⚠️
- `guiderService.content.getAnalytics()` → `guiderService.ugcContent.getGuideAnalytics()` ⚠️
- `guiderService.content.generateReport()` → `guiderService.ugcContent.generateGuideReport()` ⚠️

#### Onboarding:
- `guiderService.onboarding.create()` → ✅ Same
- `guiderService.onboarding.approveAreaManager()` → ✅ Same
- `guiderService.onboarding.approveAdmin()` → ✅ Same
- `guiderService.onboarding.reject()` → ✅ Same

#### Status:
- `guiderService.status.get()` → `guiderService.guides.getStatus()` ⚠️

## 📝 Next Steps

1. **Update Import Statements**: Change from old service structure to new structure
2. **Update Method Calls**: Update method names to match new service structure
3. **Add Error Handling**: Ensure all components have proper error handling
4. **Add Loading States**: Ensure all components show loading states
5. **Test Each Component**: Test each updated component to ensure it works correctly

## 🎯 Priority Components

Update these components first as they are most commonly used:
1. Profile.tsx (partially done)
2. ContentList.tsx (partially done)
3. ContentCreate.tsx
4. ContentDetail.tsx
5. Wallet.tsx
6. PayoutsList.tsx
7. Dashboard.tsx

## 📚 API Method Reference

See `src/services/guiderService.ts` for complete API method reference. All methods are organized by category:
- `guiderService.guides.*` - Guide profile operations
- `guiderService.ugcContent.*` - UGC content operations
- `guiderService.tiers.*` - Tier management operations
- `guiderService.referrals.*` - Referral operations
- `guiderService.loyalty.*` - Loyalty operations
- `guiderService.wallets.*` - Wallet operations
- `guiderService.payouts.*` - Payout operations
- `guiderService.attributions.*` - Attribution operations
- `guiderService.onboarding.*` - Onboarding operations

