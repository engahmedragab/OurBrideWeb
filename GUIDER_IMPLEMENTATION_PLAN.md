# Guider Workspace Implementation Plan

## Overview
Complete guide/creator workspace implementation for `guider.our-bride.com` subdomain with all routes and sections from the sitemap.

## Implementation Status

### Phase 1: Foundation ✅
- [x] Subdomain detection and routing
- [x] Service layer structure
- [x] Main app router
- [ ] Layout with sidebar navigation
- [ ] Route guards and redirects

### Phase 2: Core Features
- [ ] Onboarding flow (5 steps)
- [ ] Status page
- [ ] Profile management
- [ ] Dashboard

### Phase 3: Content Management
- [ ] Content list with filters
- [ ] Content creation/editing
- [ ] Content insights
- [ ] Drafts/Submitted/Published/Rejected views

### Phase 4: Affiliate & Offers
- [ ] Affiliate links management
- [ ] Offers browsing
- [ ] Events tracking
- [ ] Analytics

### Phase 5: Campaigns
- [ ] Campaign list
- [ ] Invites management
- [ ] Milestones & deliverables
- [ ] Campaign chat
- [ ] Campaign insights

### Phase 6: Rankings & Community
- [ ] Rank display
- [ ] Badges showcase
- [ ] Leaderboard

### Phase 7: Wallet & Earnings
- [ ] Wallet overview
- [ ] Transactions
- [ ] Payout requests
- [ ] Tax invoices

### Phase 8: Analytics
- [ ] Overview dashboard
- [ ] Content analytics
- [ ] Affiliate analytics
- [ ] Campaign analytics

### Phase 9: Support & Help
- [ ] Reports management
- [ ] Policies display
- [ ] Help/FAQ
- [ ] Support tickets
- [ ] Announcements

### Phase 10: Tools & Utilities
- [ ] QR code generator
- [ ] Share tools
- [ ] Preview tools
- [ ] Integrations (optional)

## API Method Mapping

The service layer needs to be updated with actual API method names from `ourbride-api.ts`. Methods follow patterns like:
- `postAffiliateCreateAffiliateLink`
- `getCampaignGetCampaign`
- `getGuideGetGuideProfile`
- `getUgcContentGetContentByGuide`
- `getPayoutGetPayoutRequestsByGuide`

## Next Steps

1. Search and map all actual API method names
2. Update `guiderService.js` with correct method calls
3. Create layout component with sidebar
4. Implement route guards
5. Build components section by section

