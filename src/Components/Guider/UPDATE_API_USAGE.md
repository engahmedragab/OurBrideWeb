# API Integration Update Guide

All components have been created with placeholder API calls. To complete the integration:

## Pattern to Follow

1. **Import the auth helper:**
```javascript
import { getGuideProfileId, getUserId } from '../../../utils/guiderAuth';
```

2. **Replace hardcoded guideProfileId:**
```javascript
// OLD:
const guideProfileId = 1; // TODO: Get from auth

// NEW:
const guideProfileId = getGuideProfileId();
if (!guideProfileId) {
  // Handle error or try to get from status
  const status = await guiderService.status.get();
  if (status?.guideProfileId) {
    localStorage.setItem('guideProfileId', status.guideProfileId);
    // Use status.guideProfileId
  } else {
    toast.error('Please complete onboarding first');
    navigate('/onboarding');
    return;
  }
}
```

3. **Update API calls to use real service methods:**
- All service methods are available in `guiderService`
- Check `src/services/guiderService.js` for available methods
- Use proper error handling with toast notifications

## Components Updated:
- ✅ Onboarding (Profile, Portfolio, Verification, Review)
- ✅ Status
- ✅ Profile (Overview, Public)

## Components Still Need Updates:
- Content (List, Create, Edit, Detail, Insights)
- Affiliate (Overview, Links, Offers, Events)
- Campaigns (List, Detail, Invites, Milestones, Deliverables, Chat, Insights)
- Rank (Rank, Badges, Leaderboard)
- Wallet (Wallet, Transactions, Payouts, Tax Invoices)
- Analytics (Overview, Content, Affiliate, Campaigns)
- Reports & Policies
- Help & Support

## Service Methods Available:
All methods are in `src/services/guiderService.js`:
- `guiderService.onboarding.*`
- `guiderService.status.*`
- `guiderService.profile.*`
- `guiderService.content.*`
- `guiderService.affiliate.*`
- `guiderService.campaigns.*`
- `guiderService.rank.*`
- `guiderService.wallet.*`
- `guiderService.analytics.*`
- `guiderService.help.*`

