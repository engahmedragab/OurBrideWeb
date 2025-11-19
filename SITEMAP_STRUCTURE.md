# OurBride Web - Visual Sitemap Structure

## 🌐 Main Domain: our-bride.com

```
our-bride.com/
│
├── 🏠 Core Pages
│   ├── / (Home)
│   ├── /home
│   ├── /about
│   ├── /contact
│   ├── /explore
│   ├── /download-app
│   ├── /privacy
│   ├── /terms
│   ├── /support
│   ├── /privacy-policy (legacy)
│   └── /terms-conditions (legacy)
│
├── 📅 Wedding Planner
│   └── /planner
│       ├── / (Checklist - default)
│       ├── /checklist
│       ├── /budget
│       ├── /guest-list
│       ├── /guests (alias)
│       ├── /timeline
│       ├── /calendar
│       └── /favorites
│
├── 🛍️ Marketplace
│   ├── /services
│   │   ├── / (Services list)
│   │   ├── /categories
│   │   ├── /:id (Service detail)
│   │   └── /:serviceId/ugc
│   │
│   ├── /providers
│   │   ├── / (Providers list)
│   │   ├── /:providerId
│   │   └── /:providerId/ugc
│   │
│   ├── /marketplace/providers
│   │   ├── /:id
│   │   ├── /code/:code
│   │   ├── /slug/:slug
│   │   ├── /:providerId/store
│   │   ├── /:id/links
│   │   ├── /code/:code/links
│   │   └── /slug/:slug/links
│   │
│   ├── /offers
│   │   ├── / (Offers list)
│   │   └── /:offerId
│   │
│   ├── /products
│   │   └── /:productId
│   │
│   └── /shop (redirect)
│
├── 🎬 UGC & Content Discovery
│   ├── /explore/ugc
│   │   ├── / (Videos - default)
│   │   ├── /videos
│   │   ├── /top-guides
│   │   └── /top-content
│   │
│   ├── /guides
│   │   ├── / (Guides list)
│   │   └── /:handle
│   │
│   ├── /content/:contentId
│   ├── /trending
│   ├── /trending/:type
│   ├── /leaderboard
│   └── /category/:niche
│
├── 👥 Community (redirects to subdomain)
│   └── /community
│       ├── / (Community Hub)
│       │
│       ├── /articles
│       │   ├── / (Articles list)
│       │   └── /:slug
│       │
│       ├── /posts
│       │   ├── / (Posts list)
│       │   └── /:id
│       │
│       ├── /blogs
│       │   ├── / (Blogs list)
│       │   └── /:slug
│       │
│       ├── /reels
│       │   ├── / (Reels list)
│       │   └── /:id
│       │
│       ├── /decision-groups
│       │   ├── / (Polls list)
│       │   └── /:id
│       │
│       ├── /contests
│       │   ├── / (Contests list)
│       │   └── /:id
│       │
│       ├── /tags
│       │   ├── / (Tags list)
│       │   └── /:slug
│       │
│       ├── /unified
│       │   ├── /category/:id
│       │   ├── /item/:id
│       │   ├── /preparation/:id
│       │   ├── /provider/:id
│       │   └── /bazaar-event/:id
│       │
│       └── /profiles
│           ├── /user/:id
│           ├── /provider/:id
│           └── /bazaar-event/:id
│
├── 📋 Preparations
│   ├── /preparations
│   └── /preparations/:preparationId
│
├── 🎯 Become Guide/Provider
│   ├── /become-guide (redirects to guider subdomain)
│   ├── /become-a-guide (redirects to guider subdomain)
│   └── /become-provider
│
├── 👤 User Profile (Auth Required)
│   ├── /me
│   ├── /me/profile
│   ├── /my-bookings
│   ├── /my-favorites
│   └── /my-coupons
│
├── 🔗 Deep Links & Tracking
│   ├── /dl/:shortCode
│   ├── /app/coupon
│   ├── /app/*
│   ├── /scan/*
│   ├── /redirect*
│   ├── /go/:affiliateCode
│   ├── /qr/:type/:id
│   ├── /qr/:qrCode
│   └── /o/:offerCode
│
├── 🔐 Authentication
│   ├── /register
│   ├── /login
│   └── /delete-account
│
└── 🎴 Legacy/Invitation Routes
    ├── /invitation
    ├── /items
    ├── /createInvitation
    ├── /invitationCard
    ├── /invitationCard2
    ├── /invitationCard3
    └── /invitationCard4
```

---

## 🌍 Subdomain: community.our-bride.com

```
community.our-bride.com/
│
├── / (Community Hub)
│
├── /articles
│   ├── / (Articles list)
│   └── /:slug
│
├── /posts
│   ├── / (Posts list)
│   └── /:id
│
├── /blogs
│   ├── / (Blogs list)
│   └── /:slug
│
├── /reels
│   ├── / (Reels list)
│   └── /:id
│
├── /decision-groups
│   ├── / (Polls list)
│   └── /:id
│
├── /contests
│   ├── / (Contests list)
│   └── /:id
│
├── /tags
│   ├── / (Tags list)
│   └── /:slug
│
├── /unified
│   ├── /category/:id
│   ├── /item/:id
│   ├── /preparation/:id
│   ├── /provider/:id
│   └── /bazaar-event/:id
│
└── /profiles
    ├── /user/:id
    ├── /provider/:id
    └── /bazaar-event/:id
```

---

## 🎓 Subdomain: guider.our-bride.com

```
guider.our-bride.com/
│
├── / (Dashboard)
│
├── /onboarding
│   ├── / (Profile step)
│   ├── /profile
│   ├── /portfolio
│   ├── /verification
│   └── /review
│
├── /status
│
├── /profile
│   ├── / (Profile management)
│   ├── /public
│   ├── /settings
│   └── /links
│
├── /content
│   ├── / (Content list)
│   ├── /new
│   ├── /drafts
│   ├── /submitted
│   ├── /published
│   ├── /rejected
│   ├── /:contentId
│   ├── /:contentId/edit
│   └── /:contentId/insights
│
├── /affiliate
│   ├── / (Overview)
│   ├── /links
│   ├── /links/new
│   ├── /links/:linkId
│   ├── /offers
│   ├── /offers/:offerId
│   └── /events
│
├── /campaigns
│   ├── / (Campaigns list)
│   ├── /invites
│   ├── /invites/:inviteId
│   ├── /:campaignId
│   ├── /:campaignId/milestones
│   ├── /:campaignId/deliverables
│   ├── /:campaignId/chat
│   └── /:campaignId/insights
│
├── /rank
├── /badges
├── /leaderboard
│
├── /wallet
│   ├── / (Wallet overview)
│   └── /transactions
│
├── /payouts
│   ├── / (Payouts list)
│   ├── /new
│   └── /:payoutId
│
├── /tax
│
├── /analytics
│   ├── / (Overview)
│   ├── /content
│   ├── /affiliate
│   └── /campaigns
│
├── /reports
├── /policies
│
├── /help
│   ├── / (Help center)
│   ├── /faq
│   └── /contact
│
└── /tools
    ├── / (Tools hub)
    ├── /link-shortener
    └── /qr-generator
```

---

## 📊 Route Priority Matrix

### High Priority (Should be in Sitemap)
- ✅ All core public pages
- ✅ All planner routes
- ✅ Services & Providers lists
- ✅ Offers list
- ✅ UGC discovery routes
- ✅ Community hub and list pages
- ✅ Become Guide/Provider pages

### Medium Priority (Consider for Sitemap)
- ⚠️ Preparations list
- ⚠️ Authentication pages (if public)
- ⚠️ Legacy routes (if still used)

### Low Priority (Should NOT be in Sitemap)
- ❌ Dynamic detail pages (generate dynamically)
- ❌ User-specific routes (auth required)
- ❌ Tracking/redirect routes
- ❌ Deep link routes

---

## 🔄 Route Redirects & Aliases

### Redirects
- `/community/*` → `community.our-bride.com/*`
- `/become-guide` → `guider.our-bride.com/*`
- `/become-a-guide` → `guider.our-bride.com/*`
- `/shop` → External store

### Aliases
- `/home` = `/`
- `/planner/guests` = `/planner/guest-list`
- `/privacy-policy` = `/privacy`
- `/terms-conditions` = `/terms`

---

## 📈 SEO Route Categories

### Public Indexable Routes
- Core pages
- Planner routes
- Marketplace lists
- UGC discovery
- Community lists
- Become Guide/Provider

### Dynamic Routes (Generate Sitemap)
- Service details
- Provider profiles
- Offer details
- Product details
- Content details
- Guide profiles
- Community content details

### Non-Indexable Routes
- User profile routes
- Tracking routes
- Deep link routes
- Authentication routes (login/register)

---

*This visual structure represents the complete routing architecture of the OurBride Web platform.*

