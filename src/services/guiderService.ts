import { OurbrideApi } from '../common/api/ourbride-http-client';

/**
 * Helper function to extract data from ApiResult format
 */
const extractData = (response) => {
  if (!response || !response.data) return null;
  // If response.data has a 'data' property and 'success' property, it's ApiResult format
  if (response.data.data !== undefined && response.data.success !== undefined) {
    return response.data.data;
  }
  // Otherwise, return the data directly
  return response.data;
};

/**
 * Guider/Guide Service
 * All API calls related to the guide workspace
 */
const guiderService = {
  // Onboarding & Account
  onboarding: {
    // Create onboarding (LocalGuider onboarding)
    create: (data) => OurbrideApi.postLocalGuiderOnboardingCreate(data).then(extractData),
    
    // Approve/Reject (admin functions - may not be needed in guide workspace)
    approveAreaManager: (onboardingId, data, managerId) => 
      OurbrideApi.postLocalGuiderOnboardingApproveAreaManager(onboardingId, data, { managerId }).then(extractData),
    approveAdmin: (onboardingId, data, adminId) => 
      OurbrideApi.postLocalGuiderOnboardingApproveAdmin(onboardingId, data, { adminId }).then(extractData),
    reject: (onboardingId, data, reviewerId) => 
      OurbrideApi.postLocalGuiderOnboardingReject(onboardingId, data, { reviewerId }).then(extractData),
  },

  // Status
  status: {
    get: () => OurbrideApi.getGuideGetGuideStatus().then(extractData),
  },

  // Profile
  profile: {
    // Get guide profile by ID
    getById: (guideProfileId) => OurbrideApi.getGuideGetGuideProfile(guideProfileId).then(extractData),
    // Get guide profile by user ID
    getByUserId: (userId) => OurbrideApi.getGuideGetGuideProfileByUserId(userId).then(extractData),
    // Get guide profile by handle
    getByHandle: (handle) => OurbrideApi.getGuideGetGuideProfileByHandle(handle).then(extractData),
    // Create guide profile
    create: (data) => OurbrideApi.postGuideCreateGuideProfile(data).then(extractData),
    // Update guide profile
    update: (guideProfileId, data) => OurbrideApi.putGuideUpdateGuideProfile(guideProfileId, data).then(extractData),
    // Delete guide profile
    delete: (guideProfileId) => OurbrideApi.deleteGuideDeleteGuideProfile(guideProfileId).then(extractData),
    // Submit for approval
    submitForApproval: (guideProfileId) => OurbrideApi.postGuideSubmitForApproval(guideProfileId).then(extractData),
    // Portfolio items
    addPortfolioItem: (guideProfileId, data) => OurbrideApi.postGuideAddPortfolioItem(guideProfileId, data).then(extractData),
    getPortfolioItems: (guideProfileId) => OurbrideApi.getGuideGetPortfolioItems(guideProfileId).then(extractData),
    updatePortfolioItem: (guideProfileId, itemId, data) => OurbrideApi.putGuideUpdatePortfolioItem(guideProfileId, itemId, data).then(extractData),
    removePortfolioItem: (guideProfileId, itemId) => OurbrideApi.deleteGuideRemovePortfolioItem(guideProfileId, itemId).then(extractData),
    setFeaturedPortfolioItem: (guideProfileId, itemId) => OurbrideApi.putGuideSetFeaturedPortfolioItem(guideProfileId, itemId).then(extractData),
  },

  // Content Management (UGC Content)
  content: {
    // Get content by guide profile ID
    getByGuide: (guideProfileId, params) => 
      OurbrideApi.getUgcContentGetContentByGuide(guideProfileId, params).then(extractData),
    // Get guide content analytics
    getAnalytics: (guideProfileId, params) => 
      OurbrideApi.getUgcContentGetGuideContentAnalytics(guideProfileId, params).then(extractData),
    // Generate guide content report
    generateReport: (guideProfileId, params) => 
      OurbrideApi.postUgcContentGenerateGuideContentReport(guideProfileId, params).then(extractData),
  },

  // Affiliate & Offers
  affiliate: {
    // Create affiliate link
    createLink: (data) => OurbrideApi.postAffiliateCreateAffiliateLink(data).then(extractData),
    // Update affiliate link
    updateLink: (linkId, data) => OurbrideApi.putAffiliateUpdateAffiliateLink(linkId, data).then(extractData),
    // Delete affiliate link
    deleteLink: (linkId) => OurbrideApi.deleteAffiliateDeleteAffiliateLink(linkId).then(extractData),
    // Get affiliate link by ID
    getLinkById: (linkId) => OurbrideApi.getAffiliateGetAffiliateLink(linkId).then(extractData),
    // Get guide's affiliate links
    getLinks: (guideProfileId, params) => 
      OurbrideApi.getAffiliateGetGuideAffiliateLinks(guideProfileId, params).then(extractData),
    getLinksByGuide: (guideProfileId, params) => 
      OurbrideApi.getAffiliateGetGuideAffiliateLinks(guideProfileId, params).then(extractData),
    // Get affiliate offers (search links)
    getOffers: (guideProfileId, params) => 
      OurbrideApi.getAffiliateSearchAffiliateLinks({ ...params, guideProfileId }).then(extractData),
    getOfferById: (guideProfileId, offerId) => 
      OurbrideApi.getAffiliateGetAffiliateLink(offerId).then(extractData),
    joinOffer: (guideProfileId, offerId) => 
      OurbrideApi.postAffiliateCreateAffiliateLink({ guideProfileId, offerId }).then(extractData),
    // Get events
    getEvents: (guideProfileId, params) => 
      OurbrideApi.getAffiliateGetAttributionEventsByGuide(guideProfileId, params).then(extractData),
    // Get affiliate link by code
    getLinkByCode: (linkCode) => OurbrideApi.getAffiliateGetAffiliateLinkByCode(linkCode).then(extractData),
    // Activate/Suspend link
    activateLink: (linkId) => OurbrideApi.postAffiliateActivateAffiliateLink(linkId).then(extractData),
    suspendLink: (linkId, data) => OurbrideApi.postAffiliateSuspendAffiliateLink(linkId, data).then(extractData),
    // Track events
    trackEvent: (data) => OurbrideApi.postAffiliateTrackEvent(data).then(extractData),
    // Get link events
    getLinkEvents: (linkId, params) => OurbrideApi.getAffiliateGetAffiliateLinkEvents(linkId, params).then(extractData),
    // Get guide events
    getGuideEvents: (guideProfileId, params) => 
      OurbrideApi.getAffiliateGetAttributionEventsByGuide(guideProfileId, params).then(extractData),
    // Analytics
    getLinkAnalytics: (linkId, params) => OurbrideApi.getAffiliateGetAffiliateLinkAnalytics(linkId, params).then(extractData),
    getGuideAnalytics: (guideProfileId, params) => 
      OurbrideApi.getAffiliateGetGuideAffiliateAnalytics(guideProfileId, params).then(extractData),
    getTopLinks: (guideProfileId, params) => 
      OurbrideApi.getAffiliateGetGuideAffiliateTopLinks(guideProfileId, params).then(extractData),
    getConversionFunnel: (linkId, params) => 
      OurbrideApi.getAffiliateGetAffiliateLinkConversionFunnel(linkId, params).then(extractData),
    // Commission
    processCommission: (data) => OurbrideApi.postAffiliateCommissionProcess(data).then(extractData),
    getCommissionLedger: (guideProfileId, params) => 
      OurbrideApi.getAffiliateGetGuideCommissionLedger(guideProfileId, params).then(extractData),
    calculateCommission: (data) => OurbrideApi.postAffiliateCommissionCalculate(data).then(extractData),
    // Search links
    searchLinks: (params) => OurbrideApi.getAffiliateSearchAffiliateLinks(params).then(extractData),
    // UTM management
    updateUTM: (linkId, data) => OurbrideApi.putAffiliateUpdateAffiliateLinkUtm(linkId, data).then(extractData),
    getUTMAnalytics: (linkId, params) => OurbrideApi.getAffiliateGetAffiliateLinkUtmAnalytics(linkId, params).then(extractData),
  },

  // Campaigns
  campaigns: {
    // Get campaign by ID
    getById: (guideProfileId, campaignId) => OurbrideApi.getCampaignGetCampaign(campaignId).then(extractData),
    // Get guide assignments (campaigns assigned to guide)
    getByGuide: (guideProfileId, params) => 
      OurbrideApi.getCampaignGetGuideAssignments(guideProfileId, params).then(extractData),
    getAssignments: (guideProfileId, params) => 
      OurbrideApi.getCampaignGetGuideAssignments(guideProfileId, params).then(extractData),
    // Get assignment by ID
    getAssignment: (assignmentId) => OurbrideApi.getCampaignGetCampaignAssignment(assignmentId).then(extractData),
    // Get invites (assignments with pending status)
    getInvites: (guideProfileId, campaignId) => 
      OurbrideApi.getCampaignGetGuideAssignments(guideProfileId, { campaignId, status: 'pending' }).then(extractData),
    getInviteById: (guideProfileId, campaignId, inviteId) => 
      OurbrideApi.getCampaignGetCampaignAssignment(inviteId).then(extractData),
    // Accept/Reject assignment (invite)
    acceptInvite: (guideProfileId, campaignId, inviteId) => 
      OurbrideApi.postCampaignAcceptCampaignInvitation(inviteId).then(extractData),
    rejectInvite: (guideProfileId, campaignId, inviteId, data) => 
      OurbrideApi.postCampaignRejectCampaignInvitation(inviteId, data).then(extractData),
    acceptAssignment: (assignmentId) => OurbrideApi.postCampaignAcceptCampaignInvitation(assignmentId).then(extractData),
    rejectAssignment: (assignmentId, data) => OurbrideApi.postCampaignRejectCampaignInvitation(assignmentId, data).then(extractData),
    // Update assignment
    updateAssignment: (assignmentId, data) => 
      OurbrideApi.putCampaignUpdateCampaignAssignment(assignmentId, data).then(extractData),
    // Delete assignment
    deleteAssignment: (assignmentId) => 
      OurbrideApi.deleteCampaignRemoveGuideFromCampaign(assignmentId).then(extractData),
    // Milestones
    getMilestones: (guideProfileId, campaignId) => OurbrideApi.getCampaignGetCampaignMilestones(campaignId).then(extractData),
    // Deliverables (may be part of milestones or separate)
    getDeliverables: (guideProfileId, campaignId) => 
      OurbrideApi.getCampaignGetCampaignMilestones(campaignId).then(extractData), // Using milestones for now
    // Chat messages (may need separate endpoint or use campaign assignment)
    getChatMessages: (guideProfileId, campaignId) => 
      OurbrideApi.getCampaignGetCampaignAssignment(campaignId).then(extractData), // Placeholder
    sendChatMessage: (guideProfileId, campaignId, data) => 
      OurbrideApi.putCampaignUpdateCampaignAssignment(campaignId, data).then(extractData), // Placeholder
    // Analytics
    getInsights: (guideProfileId, campaignId) => 
      OurbrideApi.getCampaignGetCampaignAnalytics(campaignId, {}).then(extractData),
    getAnalytics: (campaignId, params) => OurbrideApi.getCampaignGetCampaignAnalytics(campaignId, params).then(extractData),
    getPerformance: (campaignId, params) => OurbrideApi.getCampaignGetCampaignPerformance(campaignId, params).then(extractData),
    getGuideAnalytics: (guideProfileId, params) => 
      OurbrideApi.getCampaignGetGuideCampaignAnalytics(guideProfileId, params).then(extractData),
    // Search campaigns
    search: (data) => OurbrideApi.postCampaignSearchCampaigns(data).then(extractData),
  },

  // Rankings & Badges
  rank: {
    // Get guide tier/rank info
    get: (guideProfileId) => OurbrideApi.getGuideGetGuideProfile(guideProfileId).then(extractData), // Profile contains tier info
    // Promote/Demote tier (admin functions)
    promoteTier: (guideProfileId, data) => OurbrideApi.postGuidePromoteGuideTier(guideProfileId, data).then(extractData),
    demoteTier: (guideProfileId, data) => OurbrideApi.postGuideDemoteGuideTier(guideProfileId, data).then(extractData),
    // Get badges (may be part of profile)
    getBadges: (guideProfileId) => 
      OurbrideApi.getGuideGetGuideProfile(guideProfileId).then(extractData), // Profile may contain badges
    // Get leaderboard
    getLeaderboard: (guideProfileId) => 
      OurbrideApi.getGuideGetTopGuides({}).then(extractData),
  },
  badges: {
    // Badges may be part of profile or separate endpoint - check API
    getAll: () => Promise.resolve([]), // Placeholder - implement when API available
  },
  leaderboard: {
    // Get top guides
    getTopGuides: (params) => OurbrideApi.getGuideGetTopGuides(params).then(extractData),
    // Get guides by niche
    getByNiche: (niche, params) => OurbrideApi.getGuideGetGuidesByNiche(niche, params).then(extractData),
    // Search guides
    search: (data) => OurbrideApi.postGuideSearchGuides(data).then(extractData),
  },

  // Wallet & Earnings
  wallet: {
    // Get wallet balance/summary
    get: (guideProfileId) => 
      OurbrideApi.getCommissionGetGuideCommissionSummary(guideProfileId).then(extractData),
    // Get transactions (commission ledger)
    getTransactions: (guideProfileId, params) => 
      OurbrideApi.getCommissionGetGuideCommissionLedger(guideProfileId, params).then(extractData),
    // Get commissions
    getCommissions: (guideProfileId, params) => 
      OurbrideApi.getCommissionGetGuideCommissions(guideProfileId, params).then(extractData),
    // Get commission summary
    getSummary: (guideProfileId) => 
      OurbrideApi.getCommissionGetGuideCommissionSummary(guideProfileId).then(extractData),
    // Get commission analytics
    getAnalytics: (guideProfileId, params) => 
      OurbrideApi.getCommissionGetGuideCommissionAnalytics(guideProfileId, params).then(extractData),
    // Generate commission report
    generateReport: (guideProfileId, params) => 
      OurbrideApi.postCommissionGenerateGuideCommissionReport(guideProfileId, params).then(extractData),
    // Payouts
    getPayouts: (guideProfileId, params) => 
      OurbrideApi.getPayoutGetPayoutRequestsByGuide(guideProfileId, params).then(extractData),
    getPayoutById: (guideProfileId, payoutId) => 
      OurbrideApi.getPayoutGetPayoutRequest(payoutId).then(extractData),
    createPayout: (guideProfileId, data) => 
      OurbrideApi.postPayoutCreatePayoutRequest(data).then(extractData),
    // Tax invoices
    getTaxInvoices: (guideProfileId, params) => 
      OurbrideApi.getPayoutGetPayoutRequestsByGuide(guideProfileId, { ...params, includeInvoices: true }).then(extractData),
  },
  payouts: {
    // Get payout requests by guide
    getByGuide: (guideProfileId, params) => 
      OurbrideApi.getPayoutGetPayoutRequestsByGuide(guideProfileId, params).then(extractData),
    // Get payout methods by guide
    getMethods: (guideProfileId) => 
      OurbrideApi.getPayoutGetPayoutMethodsByGuide(guideProfileId).then(extractData),
    // Get payout analytics
    getAnalytics: (guideProfileId, params) => 
      OurbrideApi.getPayoutGetGuidePayoutAnalytics(guideProfileId, params).then(extractData),
    // Generate payout report
    generateReport: (guideProfileId, params) => 
      OurbrideApi.postPayoutGenerateGuidePayoutReport(guideProfileId, params).then(extractData),
  },
  tax: {
    // Tax invoices may be part of payout system - check API
    getInvoices: (params) => Promise.resolve([]), // Placeholder
    downloadInvoice: (invoiceId) => Promise.resolve(null), // Placeholder
  },

  // Analytics
  analytics: {
    // Dashboard for local guide
    getDashboard: (params) => OurbrideApi.getHomehomeDashboardLocalGuide(params).then(extractData),
    // Overview
    getOverview: (guideProfileId) => 
      OurbrideApi.getGuideGetGuideAnalytics(guideProfileId, {}).then(extractData),
    // Guide analytics
    getGuideAnalytics: (guideProfileId, params) => 
      OurbrideApi.getGuideGetGuideAnalytics(guideProfileId, params).then(extractData),
    // Content analytics
    getContent: (guideProfileId, params) => 
      OurbrideApi.getUgcContentGetGuideContentAnalytics(guideProfileId, params).then(extractData),
    getContentAnalytics: (guideProfileId, params) => 
      OurbrideApi.getUgcContentGetGuideContentAnalytics(guideProfileId, params).then(extractData),
    // Affiliate analytics
    getAffiliate: (guideProfileId, params) => 
      OurbrideApi.getAffiliateGetGuideAffiliateAnalytics(guideProfileId, params).then(extractData),
    getAffiliateAnalytics: (guideProfileId, params) => 
      OurbrideApi.getAffiliateGetGuideAffiliateAnalytics(guideProfileId, params).then(extractData),
    // Campaign analytics
    getCampaigns: (guideProfileId, params) => 
      OurbrideApi.getCampaignGetGuideCampaignAnalytics(guideProfileId, params).then(extractData),
    getCampaignAnalytics: (guideProfileId, params) => 
      OurbrideApi.getCampaignGetGuideCampaignAnalytics(guideProfileId, params).then(extractData),
    // Commission analytics
    getCommissionAnalytics: (guideProfileId, params) => 
      OurbrideApi.getCommissionGetGuideCommissionAnalytics(guideProfileId, params).then(extractData),
    // Payout analytics
    getPayoutAnalytics: (guideProfileId, params) => 
      OurbrideApi.getPayoutGetGuidePayoutAnalytics(guideProfileId, params).then(extractData),
  },

  // Reports & Policies
  reports: {
    // Content reports may be part of content moderation - check API
    getAll: (params) => Promise.resolve([]), // Placeholder
    getById: (reportId) => Promise.resolve(null), // Placeholder
  },
  policies: {
    // Policies may be static content or API endpoint - check API
    get: () => Promise.resolve(null), // Placeholder
  },

  // Help & Support
  help: {
    // Help/FAQ may be static or API - check API
    getFaqs: (params) => Promise.resolve([]), // Placeholder
    getFAQ: (params) => Promise.resolve([]), // Placeholder
    // Support
    submitSupportRequest: (guideProfileId, data) => Promise.resolve(null), // Placeholder - implement when API available
    // Announcements
    getAnnouncements: (params) => Promise.resolve([]), // Placeholder
  },
  support: {
    // Support tickets may use general support API - check API
    createTicket: (data) => Promise.resolve(null), // Placeholder
    getTickets: (params) => Promise.resolve([]), // Placeholder
    getTicketById: (ticketId) => Promise.resolve(null), // Placeholder
  },
  announcements: {
    // Announcements may be part of general announcements - check API
    getAll: (params) => Promise.resolve([]), // Placeholder
    getById: (announcementId) => Promise.resolve(null), // Placeholder
  },

  // Tools
  tools: {
    // QR code generation - may need to implement client-side or use API
    getQR: (linkId) => Promise.resolve(null), // Placeholder
    // Share tool - client-side implementation
    getShare: (linkId) => Promise.resolve(null), // Placeholder
    // Preview - may use content preview endpoint
    getPreview: (contentId) => Promise.resolve(null), // Placeholder
  },

  // Integrations (optional)
  integrations: {
    // Integrations may not be in API yet - placeholder
    getAll: () => Promise.resolve([]), // Placeholder
    connect: (platform, data) => Promise.resolve(null), // Placeholder
    disconnect: (platform) => Promise.resolve(null), // Placeholder
  },

  // Dashboard
  dashboard: {
    // Use local guide dashboard
    get: (params) => OurbrideApi.getHomehomeDashboardLocalGuide(params).then(extractData),
  },
};

export default guiderService;


