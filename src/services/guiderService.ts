import { OurbrideApi } from '../common/api/ourbride-http-client';
import {
  CreateGuideProfileRequest, UpdateGuideProfileRequest, GuideProfileResponse,
  CreateContentRequest, UpdateContentRequest, UGCContentResponse, SearchContentRequest,
  CreateTierRequest, UpdateTierRequest, TierResponse,
  CreateReferralRequest, UpdateReferralStatusRequest, ReferralResponse,
  UpdateUserPointsRequest, LoyaltyUserProfileResponse, LoyaltyGoalResponse, LoyaltyUserGoalResponse,
  CreateWalletRequest, UpdateWalletRequest, WalletAccountResponse, AddPointsRequest, DeductPointsRequest, TransferPointsRequest, WalletBalanceResponse,
  CreatePayoutRequestRequest, UpdatePayoutRequestRequest, PayoutRequestResponse, AddPayoutMethodRequest, PayoutMethodResponse,
  RecordAttributionEventRequest, AttributionEventResponse, TrackUserActionRequest, TrackConversionRequest, TrackCampaignAttributionRequest, TrackReferralAttributionRequest,
  OnboardingLocalGuiderRequest,
} from '../common/api/gen/ourbride-api';

/**
 * Helper to extract data from ApiResult format
 */
const extractData = (response: any) => {
  if (!response || !response.data) return null;
  if (response.data.data !== undefined && response.data.success !== undefined) {
    return response.data.data;
  }
  return response.data;
};

/**
 * Guider Service
 * Comprehensive service for all guider-related API calls
 */
export const guiderService = {
  // ==================== GUIDE PROFILE MANAGEMENT ====================
  guides: {
    create: (data: CreateGuideProfileRequest) => OurbrideApi.postGuideCreateGuideProfile(data).then(extractData),
    getById: (guideProfileId: number) => OurbrideApi.getGuideGetGuideProfile(guideProfileId).then(extractData),
    getByUserId: (userId: string) => OurbrideApi.getGuideGetGuideProfileByUserId(userId).then(extractData),
    getByHandle: (handle: string) => OurbrideApi.getGuideGetGuideProfileByHandle(handle).then(extractData),
    update: (guideProfileId: number, data: UpdateGuideProfileRequest) => OurbrideApi.putGuideUpdateGuideProfile(guideProfileId, data).then(extractData),
    delete: (guideProfileId: number) => OurbrideApi.deleteGuideDeleteGuideProfile(guideProfileId).then(extractData),
    
    // Approval workflow
    submitForApproval: (guideProfileId: number, data?: any) => OurbrideApi.postGuideSubmitForApproval(guideProfileId, data || {}).then(extractData),
    approve: (guideProfileId: number, data?: any) => OurbrideApi.postGuideApproveGuide(guideProfileId, data || {}).then(extractData),
    reject: (guideProfileId: number, data?: any) => OurbrideApi.postGuideRejectGuide(guideProfileId, data || {}).then(extractData),
    suspend: (guideProfileId: number, data?: any) => OurbrideApi.postGuideSuspendGuide(guideProfileId, data || {}).then(extractData),
    
    // Tier management
    promoteTier: (guideProfileId: number, data?: any) => OurbrideApi.postGuidePromoteGuideTier(guideProfileId, data || {}).then(extractData),
    demoteTier: (guideProfileId: number, data?: any) => OurbrideApi.postGuideDemoteGuideTier(guideProfileId, data || {}).then(extractData),
    
    // Search and discovery
    search: (data: any) => OurbrideApi.postGuideSearchGuides(data).then(extractData),
    getTop: (query?: any) => OurbrideApi.getGuideGetTopGuides(query).then(extractData),
    getByNiche: (niche: string, query?: any) => OurbrideApi.getGuideGetGuidesByNiche(niche, query).then(extractData),
    
    // Metrics and analytics
    updateMetrics: (guideProfileId: number, data?: any) => OurbrideApi.putGuideUpdateGuideMetrics(guideProfileId, data || {}).then(extractData),
    getAnalytics: (guideProfileId: number, query?: any) => OurbrideApi.getGuideGetGuideAnalytics(guideProfileId, query).then(extractData),
    
    // Portfolio management
    addPortfolioItem: (guideProfileId: number, data: any) => OurbrideApi.postGuideAddPortfolioItem(guideProfileId, data).then(extractData),
    getPortfolioItems: (guideProfileId: number) => OurbrideApi.getGuideGetPortfolioItems(guideProfileId).then(extractData),
    updatePortfolioItem: (guideProfileId: number, portfolioItemId: number, data: any) => OurbrideApi.putGuideUpdatePortfolioItem(guideProfileId, portfolioItemId, data).then(extractData),
    removePortfolioItem: (guideProfileId: number, portfolioItemId: number) => OurbrideApi.deleteGuideRemovePortfolioItem(guideProfileId, portfolioItemId).then(extractData),
    setFeaturedPortfolioItem: (guideProfileId: number, portfolioItemId: number) => OurbrideApi.putGuideSetFeaturedPortfolioItem(guideProfileId, portfolioItemId).then(extractData),
    
    // Verification
    verify: (guideProfileId: number) => OurbrideApi.postGuideVerifyGuide(guideProfileId).then(extractData),
    unverify: (guideProfileId: number) => OurbrideApi.postGuideUnverifyGuide(guideProfileId).then(extractData),
    
    // Status management
    activate: (guideProfileId: number) => OurbrideApi.postGuideActivateGuide(guideProfileId).then(extractData),
    deactivate: (guideProfileId: number) => OurbrideApi.postGuideDeactivateGuide(guideProfileId).then(extractData),
    getStatus: (guideProfileId: number) => OurbrideApi.getGuideGetGuideStatus(guideProfileId).then(extractData),
    
    // Role management
    assignRole: (guideProfileId: number, data?: any) => OurbrideApi.postGuideAssignLocalGuideRole(guideProfileId, data || {}).then(extractData),
    removeRole: (guideProfileId: number) => OurbrideApi.deleteGuideRemoveLocalGuideRole(guideProfileId).then(extractData),
    hasRole: (guideProfileId: number) => OurbrideApi.getGuideHasLocalGuideRole(guideProfileId).then(extractData),
    getLocalGuideUsers: () => OurbrideApi.getGuideGetLocalGuideUsers().then(extractData),
    createForUser: (data: any) => OurbrideApi.postGuideCreateGuideProfileForUser(data).then(extractData),
  },

  // ==================== UGC CONTENT MANAGEMENT ====================
  ugcContent: {
    create: (data: CreateContentRequest) => OurbrideApi.postUgcContentCreateContent(data).then(extractData),
    getById: (contentId: number) => OurbrideApi.getUgcContentGetContent(contentId).then(extractData),
    getBySlug: (slug: string) => OurbrideApi.getUgcContentGetContentBySlug(slug).then(extractData),
    update: (contentId: number, data: UpdateContentRequest) => OurbrideApi.putUgcContentUpdateContent(contentId, data).then(extractData),
    delete: (contentId: number) => OurbrideApi.deleteUgcContentDeleteContent(contentId).then(extractData),
    
    // Submission and moderation
    submit: (contentId: number) => OurbrideApi.postUgcContentSubmitContent(contentId).then(extractData),
    approve: (contentId: number, data?: any) => OurbrideApi.postUgcContentApproveContent(contentId, data || {}).then(extractData),
    reject: (contentId: number, data?: any) => OurbrideApi.postUgcContentRejectContent(contentId, data || {}).then(extractData),
    publish: (contentId: number) => OurbrideApi.postUgcContentPublishContent(contentId).then(extractData),
    suspend: (contentId: number, data?: any) => OurbrideApi.postUgcContentSuspendContent(contentId, data || {}).then(extractData),
    
    // Discovery and search
    search: (data: SearchContentRequest) => OurbrideApi.postUgcContentSearchContent(data).then(extractData),
    getByGuide: (guideProfileId: number, query?: any) => OurbrideApi.getUgcContentGetContentByGuide(guideProfileId, query).then(extractData),
    getFeatured: (query?: any) => OurbrideApi.getUgcContentGetFeaturedContent(query).then(extractData),
    getTrending: (query?: any) => OurbrideApi.getUgcContentGetTrendingContent(query).then(extractData),
    
    // Moderation
    getModerationQueue: (query?: any) => OurbrideApi.getUgcContentGetModerationQueue(query).then(extractData),
    getContentForModeration: (contentId: number) => OurbrideApi.getUgcContentGetContentForModeration(contentId).then(extractData),
    flag: (contentId: number, data?: any) => OurbrideApi.postUgcContentFlagContent(contentId, data || {}).then(extractData),
    escalate: (contentId: number, data?: any) => OurbrideApi.postUgcContentEscalateContent(contentId, data || {}).then(extractData),
    
    // Analytics
    getAnalytics: (contentId: number, query?: any) => OurbrideApi.getUgcContentGetContentAnalytics(contentId, query).then(extractData),
    getGuideAnalytics: (guideProfileId: number, query?: any) => OurbrideApi.getUgcContentGetGuideContentAnalytics(guideProfileId, query).then(extractData),
    getPerformance: (query?: any) => OurbrideApi.getUgcContentGetContentPerformance(query).then(extractData),
    getTrends: (query?: any) => OurbrideApi.getUgcContentGetContentTrends(query).then(extractData),
    
    // Reports
    generateSummaryReport: (data?: any) => OurbrideApi.postUgcContentGenerateContentSummaryReport(data || {}).then(extractData),
    generateGuideReport: (guideProfileId: number, data?: any) => OurbrideApi.postUgcContentGenerateGuideContentReport(guideProfileId, data || {}).then(extractData),
    generateModerationReport: (data?: any) => OurbrideApi.postUgcContentGenerateContentModerationReport(data || {}).then(extractData),
    
    // Validation
    validate: (data?: any) => OurbrideApi.postUgcContentValidateContent(data || {}).then(extractData),
    checkEligibility: (data?: any) => OurbrideApi.postUgcContentCheckContentEligibility(data || {}).then(extractData),
    validateConfiguration: (data?: any) => OurbrideApi.postUgcContentValidateContentConfiguration(data || {}).then(extractData),
    
    // Notifications
    sendNotification: (data?: any) => OurbrideApi.postUgcContentSendContentNotification(data || {}).then(extractData),
    getNotifications: (guideProfileId: number) => OurbrideApi.getUgcContentGetContentNotifications(guideProfileId).then(extractData),
    markNotificationRead: (notificationId: number) => OurbrideApi.putUgcContentMarkContentNotificationAsRead(notificationId).then(extractData),
  },

  // ==================== TIER MANAGEMENT ====================
  tiers: {
    getActive: () => OurbrideApi.getTierGetActiveTiers().then(extractData),
    getByCode: (tierCode: string) => OurbrideApi.getTierGetTierByCode(tierCode).then(extractData),
    getForPoints: (points: number) => OurbrideApi.getTierGetTierForPoints(points).then(extractData),
    getInRange: (query?: { minPoints?: number; maxPoints?: number }) => OurbrideApi.getTierGetTiersInRange(query).then(extractData),
    validateCode: (tierCode: string) => OurbrideApi.getTierValidateTierCode(tierCode).then(extractData),
    getSorted: () => OurbrideApi.getTierGetTiersBySortOrder().then(extractData),
    
    // Admin operations
    create: (data: CreateTierRequest) => OurbrideApi.postTierCreateTier(data).then(extractData),
    update: (tierId: number, data: UpdateTierRequest) => OurbrideApi.putTierUpdateTier(tierId, data).then(extractData),
    delete: (tierId: number) => OurbrideApi.deleteTierDeleteTier(tierId).then(extractData),
    
    // User tier operations
    getCurrentTierCode: (userId: string) => OurbrideApi.getTierGetCurrentTierCode(userId).then(extractData),
    calculate: (userId: string) => OurbrideApi.postTierCalculateTier(userId).then(extractData),
    recalculate: (userId: string) => OurbrideApi.postTierRecalculateTier(userId).then(extractData),
    promote: (userId: string, data?: any) => OurbrideApi.postTierPromoteTier(userId, data || {}).then(extractData),
    demote: (userId: string, data?: any) => OurbrideApi.postTierDemoteTier(userId, data || {}).then(extractData),
    
    // Rules and thresholds
    getRules: () => OurbrideApi.getTierGetTierRules().then(extractData),
    getRule: (tierCode: string) => OurbrideApi.getTierGetTierRule(tierCode).then(extractData),
    validateTransition: (query: { fromTierCode: string; toTierCode: string }) => OurbrideApi.getTierValidateTierTransition(query).then(extractData),
    
    // Analytics
    getAnalytics: (query?: any) => OurbrideApi.getTierGetTierAnalytics(query).then(extractData),
    getDistribution: (query?: any) => OurbrideApi.getTierGetTierDistribution(query).then(extractData),
    getPerformance: (query?: any) => OurbrideApi.getTierGetTierPerformance(query).then(extractData),
    getUserHistory: (userId: string) => OurbrideApi.getTierGetUserTierHistory(userId).then(extractData),
    
    // Reports
    generateSummaryReport: (data?: any) => OurbrideApi.postTierGenerateTierSummaryReport(data || {}).then(extractData),
    generateDistributionReport: (data?: any) => OurbrideApi.postTierGenerateTierDistributionReport(data || {}).then(extractData),
    generateUserReport: (userId: string, data?: any) => OurbrideApi.postTierGenerateUserTierReport(userId, data || {}).then(extractData),
    
    // Validation
    checkEligibility: (userId: string, data?: any) => OurbrideApi.postTierCheckTierEligibility(userId, data || {}).then(extractData),
    previewChange: (userId: string, data?: any) => OurbrideApi.postTierPreviewTierChange(userId, data || {}).then(extractData),
    validateConfiguration: (data?: any) => OurbrideApi.postTierValidateTierConfiguration(data || {}).then(extractData),
  },

  // ==================== REFERRAL MANAGEMENT ====================
  referrals: {
    create: (data: CreateReferralRequest) => OurbrideApi.postReferralCreateReferral(data).then(extractData),
    getById: (referralId: number) => OurbrideApi.getReferralGetReferral(referralId).then(extractData),
    getByReferrer: (referrerId: string) => OurbrideApi.getReferralGetReferralsByReferrer(referrerId).then(extractData),
    getByReferee: (refereeId: string) => OurbrideApi.getReferralGetReferralsByReferee(refereeId).then(extractData),
    getAll: (query?: any) => OurbrideApi.getReferralGetAllReferrals(query).then(extractData),
    updateStatus: (referralId: number, data: UpdateReferralStatusRequest) => OurbrideApi.putReferralUpdateReferralStatus(referralId, data).then(extractData),
    delete: (referralId: number) => OurbrideApi.deleteReferralDeleteReferral(referralId).then(extractData),
    
    // Code management
    generateCode: (data?: any) => OurbrideApi.postReferralGenerateReferralCode(data || {}).then(extractData),
    getCodesByUser: (userId: string) => OurbrideApi.getReferralGetReferralCodesByUser(userId).then(extractData),
    validateCode: (code: string) => OurbrideApi.getReferralValidateReferralCode(code).then(extractData),
    useCode: (data?: any) => OurbrideApi.postReferralUseReferralCode(data || {}).then(extractData),
    deactivateCode: (codeId: number) => OurbrideApi.putReferralDeactivateReferralCode(codeId).then(extractData),
    
    // Share events
    recordShareEvent: (data?: any) => OurbrideApi.postReferralRecordShareEvent(data || {}).then(extractData),
    getShareEventsByUser: (userId: string) => OurbrideApi.getReferralGetShareEventsByUser(userId).then(extractData),
    getAllShareEvents: (query?: any) => OurbrideApi.getReferralGetAllShareEvents(query).then(extractData),
    getShareEvent: (eventId: number) => OurbrideApi.getReferralGetShareEvent(eventId).then(extractData),
    
    // Analytics
    getAnalytics: (query?: any) => OurbrideApi.getReferralGetReferralAnalytics(query).then(extractData),
    getUserAnalytics: (userId: string, query?: any) => OurbrideApi.getReferralGetUserReferralAnalytics(userId, query).then(extractData),
    getPerformance: (query?: any) => OurbrideApi.getReferralGetReferralPerformance(query).then(extractData),
    getTrends: (query?: any) => OurbrideApi.getReferralGetReferralTrends(query).then(extractData),
    
    // Reports
    generateSummaryReport: (data?: any) => OurbrideApi.postReferralGenerateReferralSummaryReport(data || {}).then(extractData),
    generateUserReport: (userId: string, data?: any) => OurbrideApi.postReferralGenerateUserReferralReport(userId, data || {}).then(extractData),
    generatePerformanceReport: (data?: any) => OurbrideApi.postReferralGenerateReferralPerformanceReport(data || {}).then(extractData),
    
    // Validation
    checkEligibility: (userId: string, data?: any) => OurbrideApi.postReferralCheckReferralEligibility(userId, data || {}).then(extractData),
    validateOperation: (userId: string, data?: any) => OurbrideApi.postReferralValidateReferralOperation(userId, data || {}).then(extractData),
    validateConfiguration: (data?: any) => OurbrideApi.postReferralValidateReferralConfiguration(data || {}).then(extractData),
    
    // Notifications
    sendNotification: (data?: any) => OurbrideApi.postReferralSendReferralNotification(data || {}).then(extractData),
    getUserNotifications: (userId: string) => OurbrideApi.getReferralGetUserReferralNotifications(userId).then(extractData),
    markNotificationRead: (notificationId: number) => OurbrideApi.putReferralMarkReferralNotificationAsRead(notificationId).then(extractData),
  },

  // ==================== LOYALTY MANAGEMENT ====================
  loyalty: {
    // Points management
    updatePoints: (data: UpdateUserPointsRequest) => OurbrideApi.postLoyaltyUpdateUserPoints(data).then(extractData),
    getUserTotalPoints: (userId: string) => OurbrideApi.getLoyaltyGetUserTotalPoints(userId).then(extractData),
    getUserProfile: (userId: string) => OurbrideApi.getLoyaltyGetUserProfile(userId).then(extractData),
    initProfile: (userId: string) => OurbrideApi.postLoyaltyInitLoyaltyProfile(userId).then(extractData),
    
    // Goals management
    createGoal: (data?: any) => OurbrideApi.postLoyaltyCreateLoyaltyGoal(data || {}).then(extractData),
    updateGoal: (goalId: number, data?: any) => OurbrideApi.putLoyaltyUpdateLoyaltyGoal(goalId, data || {}).then(extractData),
    deleteGoal: (goalId: number) => OurbrideApi.deleteLoyaltyDeleteLoyaltyGoal(goalId).then(extractData),
    getGoals: (query?: any) => OurbrideApi.getLoyaltyGetLoyaltyGoals(query).then(extractData),
    getGoal: (goalId: number) => OurbrideApi.getLoyaltyGetLoyaltyGoal(goalId).then(extractData),
    
    // User goals
    assignGoal: (userId: string, data?: any) => OurbrideApi.postLoyaltyAssignGoalToUser(userId, data || {}).then(extractData),
    updateUserGoalProgress: (userId: string, userGoalId: number, data?: any) => OurbrideApi.putLoyaltyUpdateUserGoalProgress(userId, userGoalId, data || {}).then(extractData),
    completeUserGoal: (userId: string, userGoalId: number) => OurbrideApi.postLoyaltyCompleteUserGoal(userId, userGoalId).then(extractData),
    getUserGoals: (userId: string) => OurbrideApi.getLoyaltyGetUserGoals(userId).then(extractData),
    getUserGoal: (userId: string, userGoalId: number) => OurbrideApi.getLoyaltyGetUserGoal(userId, userGoalId).then(extractData),
    
    // Analytics
    getAnalytics: (query?: any) => OurbrideApi.getLoyaltyGetLoyaltyAnalytics(query).then(extractData),
    getUserAnalytics: (userId: string, query?: any) => OurbrideApi.getLoyaltyGetUserLoyaltyAnalytics(userId, query).then(extractData),
    getPerformance: (query?: any) => OurbrideApi.getLoyaltyGetLoyaltyPerformance(query).then(extractData),
    getTrends: (query?: any) => OurbrideApi.getLoyaltyGetLoyaltyTrends(query).then(extractData),
    
    // Reports
    generateSummaryReport: (data?: any) => OurbrideApi.postLoyaltyGenerateLoyaltySummaryReport(data || {}).then(extractData),
    generateUserReport: (userId: string, data?: any) => OurbrideApi.postLoyaltyGenerateUserLoyaltyReport(userId, data || {}).then(extractData),
    generateGoalsReport: (data?: any) => OurbrideApi.postLoyaltyGenerateLoyaltyGoalsReport(data || {}).then(extractData),
    
    // Validation
    checkGoalEligibility: (userId: string, data?: any) => OurbrideApi.postLoyaltyCheckGoalEligibility(userId, data || {}).then(extractData),
    validateOperation: (userId: string, data?: any) => OurbrideApi.postLoyaltyValidateLoyaltyOperation(userId, data || {}).then(extractData),
    validateConfiguration: (data?: any) => OurbrideApi.postLoyaltyValidateLoyaltyConfiguration(data || {}).then(extractData),
    
    // Notifications
    sendNotification: (data?: any) => OurbrideApi.postLoyaltySendLoyaltyNotification(data || {}).then(extractData),
    getUserNotifications: (userId: string) => OurbrideApi.getLoyaltyGetUserLoyaltyNotifications(userId).then(extractData),
    markNotificationRead: (notificationId: number) => OurbrideApi.putLoyaltyMarkNotificationAsRead(notificationId).then(extractData),
  },

  // ==================== WALLET MANAGEMENT ====================
  wallets: {
    create: (data: CreateWalletRequest) => OurbrideApi.postWalletCreateWallet(data).then(extractData),
    getByUserId: (userId: string) => OurbrideApi.getWalletGetWalletByUserId(userId).then(extractData),
    getById: (walletId: number) => OurbrideApi.getWalletGetWallet(walletId).then(extractData),
    update: (walletId: number, data: UpdateWalletRequest) => OurbrideApi.putWalletUpdateWallet(walletId, data).then(extractData),
    delete: (walletId: number) => OurbrideApi.deleteWalletDeleteWallet(walletId).then(extractData),
    ensureExists: (userId: string) => OurbrideApi.postWalletEnsureWalletExists(userId).then(extractData),
    
    // Balance management
    addPoints: (walletId: number, data: AddPointsRequest) => OurbrideApi.postWalletAddPoints(walletId, data).then(extractData),
    deductPoints: (walletId: number, data: DeductPointsRequest) => OurbrideApi.postWalletDeductPoints(walletId, data).then(extractData),
    transferPoints: (data: TransferPointsRequest) => OurbrideApi.postWalletTransferPoints(data).then(extractData),
    getBalance: (walletId: number) => OurbrideApi.getWalletGetWalletBalance(walletId).then(extractData),
    getUserBalance: (userId: string) => OurbrideApi.getWalletGetUserWalletBalance(userId).then(extractData),
    
    // Ledger management
    addLedgerEntry: (data?: any) => OurbrideApi.postWalletAddLedgerEntry(data || {}).then(extractData),
    getLedger: (walletId: number, query?: any) => OurbrideApi.getWalletGetWalletLedger(walletId, query).then(extractData),
    getUserLedger: (userId: string, query?: any) => OurbrideApi.getWalletGetUserWalletLedger(userId, query).then(extractData),
    getAllLedger: (query?: any) => OurbrideApi.getWalletGetAllWalletLedger(query).then(extractData),
    getLedgerEntry: (ledgerId: number) => OurbrideApi.getWalletGetWalletLedgerEntry(ledgerId).then(extractData),
    
    // Tier management
    updateTier: (walletId: number, data?: any) => OurbrideApi.putWalletUpdateWalletTier(walletId, data || {}).then(extractData),
    getTier: (walletId: number) => OurbrideApi.getWalletGetWalletTier(walletId).then(extractData),
    getUserTier: (userId: string) => OurbrideApi.getWalletGetUserWalletTier(userId).then(extractData),
    calculateTier: (walletId: number) => OurbrideApi.postWalletCalculateWalletTier(walletId).then(extractData),
    
    // Analytics
    getAnalytics: (walletId: number, query?: any) => OurbrideApi.getWalletGetWalletAnalytics(walletId, query).then(extractData),
    getUserAnalytics: (userId: string, query?: any) => OurbrideApi.getWalletGetUserWalletAnalytics(userId, query).then(extractData),
    getAnalyticsSummary: (query?: any) => OurbrideApi.getWalletGetWalletAnalyticsSummary(query).then(extractData),
    getTransactions: (walletId: number, query?: any) => OurbrideApi.getWalletGetWalletTransactions(walletId, query).then(extractData),
    
    // Reports
    generateStatement: (walletId: number, data?: any) => OurbrideApi.postWalletGenerateWalletStatement(walletId, data || {}).then(extractData),
    generateUserStatement: (userId: string, data?: any) => OurbrideApi.postWalletGenerateUserWalletStatement(userId, data || {}).then(extractData),
    generateSummaryReport: (data?: any) => OurbrideApi.postWalletGenerateWalletSummaryReport(data || {}).then(extractData),
    
    // Validation
    validateOperation: (data?: any) => OurbrideApi.postWalletValidateWalletOperation(data || {}).then(extractData),
    checkBalance: (walletId: number, data?: any) => OurbrideApi.postWalletCheckWalletBalance(walletId, data || {}).then(extractData),
  },

  // ==================== PAYOUT MANAGEMENT ====================
  payouts: {
    // Request management
    createRequest: (data: CreatePayoutRequestRequest) => OurbrideApi.postPayoutCreatePayoutRequest(data).then(extractData),
    getRequest: (requestId: number) => OurbrideApi.getPayoutGetPayoutRequest(requestId).then(extractData),
    getRequestsByGuide: (guideProfileId: number, query?: any) => OurbrideApi.getPayoutGetPayoutRequestsByGuide(guideProfileId, query).then(extractData),
    getRequestsByProvider: (providerId: number, query?: any) => OurbrideApi.getPayoutGetPayoutRequestsByProvider(providerId, query).then(extractData),
    getAllRequests: (query?: any) => OurbrideApi.getPayoutGetAllPayoutRequests(query).then(extractData),
    updateRequest: (requestId: number, data: UpdatePayoutRequestRequest) => OurbrideApi.putPayoutUpdatePayoutRequest(requestId, data).then(extractData),
    cancelRequest: (requestId: number) => OurbrideApi.postPayoutCancelPayoutRequest(requestId).then(extractData),
    
    // Processing
    approve: (requestId: number, data?: any) => OurbrideApi.postPayoutApprovePayoutRequest(requestId, data || {}).then(extractData),
    reject: (requestId: number, data?: any) => OurbrideApi.postPayoutRejectPayoutRequest(requestId, data || {}).then(extractData),
    process: (requestId: number) => OurbrideApi.postPayoutProcessPayout(requestId).then(extractData),
    complete: (requestId: number) => OurbrideApi.postPayoutCompletePayout(requestId).then(extractData),
    fail: (requestId: number, data?: any) => OurbrideApi.postPayoutFailPayout(requestId, data || {}).then(extractData),
    
    // Methods management
    addMethod: (data: AddPayoutMethodRequest) => OurbrideApi.postPayoutAddPayoutMethod(data).then(extractData),
    updateMethod: (methodId: number, data?: any) => OurbrideApi.putPayoutUpdatePayoutMethod(methodId, data || {}).then(extractData),
    deleteMethod: (methodId: number) => OurbrideApi.deletePayoutDeletePayoutMethod(methodId).then(extractData),
    getMethodsByGuide: (guideProfileId: number) => OurbrideApi.getPayoutGetPayoutMethodsByGuide(guideProfileId).then(extractData),
    getMethod: (methodId: number) => OurbrideApi.getPayoutGetPayoutMethod(methodId).then(extractData),

  // Analytics
    getAnalytics: (query?: any) => OurbrideApi.getPayoutGetPayoutAnalytics(query).then(extractData),
    getGuideAnalytics: (guideProfileId: number, query?: any) => OurbrideApi.getPayoutGetGuidePayoutAnalytics(guideProfileId, query).then(extractData),
    getProviderAnalytics: (providerId: number, query?: any) => OurbrideApi.getPayoutGetProviderPayoutAnalytics(providerId, query).then(extractData),
    getPerformance: (query?: any) => OurbrideApi.getPayoutGetPayoutPerformance(query).then(extractData),
    
    // Reports
    generateSummaryReport: (data?: any) => OurbrideApi.postPayoutGeneratePayoutSummaryReport(data || {}).then(extractData),
    generateGuideReport: (guideProfileId: number, data?: any) => OurbrideApi.postPayoutGenerateGuidePayoutReport(guideProfileId, data || {}).then(extractData),
    generateProviderReport: (providerId: number, data?: any) => OurbrideApi.postPayoutGenerateProviderPayoutReport(providerId, data || {}).then(extractData),
    
    // Validation
    validateRequest: (data?: any) => OurbrideApi.postPayoutValidatePayoutRequest(data || {}).then(extractData),
    checkEligibility: (data?: any) => OurbrideApi.postPayoutCheckPayoutEligibility(data || {}).then(extractData),
    validateConfiguration: (data?: any) => OurbrideApi.postPayoutValidatePayoutConfiguration(data || {}).then(extractData),
    
    // Notifications
    sendNotification: (data?: any) => OurbrideApi.postPayoutSendPayoutNotification(data || {}).then(extractData),
    getNotifications: (guideProfileId: number) => OurbrideApi.getPayoutGetPayoutNotifications(guideProfileId).then(extractData),
    markNotificationRead: (notificationId: number) => OurbrideApi.putPayoutMarkPayoutNotificationAsRead(notificationId).then(extractData),
  },

  // ==================== ATTRIBUTION MANAGEMENT ====================
  attributions: {
    // Event management
    recordEvent: (data: RecordAttributionEventRequest) => OurbrideApi.postAttributionRecordAttributionEvent(data).then(extractData),
    getEventsByUser: (userId: string, query?: any) => OurbrideApi.getAttributionGetAttributionEventsByUser(userId, query).then(extractData),
    getAllEvents: (query?: any) => OurbrideApi.getAttributionGetAllAttributionEvents(query).then(extractData),
    getEvent: (eventId: number) => OurbrideApi.getAttributionGetAttributionEvent(eventId).then(extractData),
    updateEvent: (eventId: number, data?: any) => OurbrideApi.putAttributionUpdateAttributionEvent(eventId, data || {}).then(extractData),
    deleteEvent: (eventId: number) => OurbrideApi.deleteAttributionDeleteAttributionEvent(eventId).then(extractData),
    
    // Tracking
    trackAction: (data: TrackUserActionRequest) => OurbrideApi.postAttributionTrackUserAction(data).then(extractData),
    trackConversion: (data: TrackConversionRequest) => OurbrideApi.postAttributionTrackConversion(data).then(extractData),
    trackCampaign: (data: TrackCampaignAttributionRequest) => OurbrideApi.postAttributionTrackCampaignAttribution(data).then(extractData),
    trackReferral: (data: TrackReferralAttributionRequest) => OurbrideApi.postAttributionTrackReferralAttribution(data).then(extractData),
    
    // Analytics
    getAnalytics: (query?: any) => OurbrideApi.getAttributionGetAttributionAnalytics(query).then(extractData),
    getUserAnalytics: (userId: string, query?: any) => OurbrideApi.getAttributionGetUserAttributionAnalytics(userId, query).then(extractData),
    getPerformance: (query?: any) => OurbrideApi.getAttributionGetAttributionPerformance(query).then(extractData),
    getTrends: (query?: any) => OurbrideApi.getAttributionGetAttributionTrends(query).then(extractData),
    
    // Reports
    generateSummaryReport: (data?: any) => OurbrideApi.postAttributionGenerateAttributionSummaryReport(data || {}).then(extractData),
    generateUserReport: (userId: string, data?: any) => OurbrideApi.postAttributionGenerateUserAttributionReport(userId, data || {}).then(extractData),
    generatePerformanceReport: (data?: any) => OurbrideApi.postAttributionGenerateAttributionPerformanceReport(data || {}).then(extractData),
    
    // Validation
    validateOperation: (userId: string, data?: any) => OurbrideApi.postAttributionValidateAttributionOperation(userId, data || {}).then(extractData),
    validateConfiguration: (data?: any) => OurbrideApi.postAttributionValidateAttributionConfiguration(data || {}).then(extractData),
    checkEligibility: (userId: string, data?: any) => OurbrideApi.postAttributionCheckAttributionEligibility(userId, data || {}).then(extractData),
    
    // Notifications
    sendNotification: (data?: any) => OurbrideApi.postAttributionSendAttributionNotification(data || {}).then(extractData),
    getUserNotifications: (userId: string) => OurbrideApi.getAttributionGetUserAttributionNotifications(userId).then(extractData),
    markNotificationRead: (notificationId: number) => OurbrideApi.putAttributionMarkAttributionNotificationAsRead(notificationId).then(extractData),
  },

  // ==================== LOCAL GUIDER ONBOARDING ====================
  onboarding: {
    create: (data: OnboardingLocalGuiderRequest) => OurbrideApi.postLocalGuiderOnboardingCreate(data).then(extractData),
    approveAreaManager: (onboardingId: number, comment: string, managerId?: string) => 
      OurbrideApi.postLocalGuiderOnboardingApproveAreaManager(onboardingId, comment, { managerId }).then(extractData),
    approveAdmin: (onboardingId: number, comment: string, adminId?: string) => 
      OurbrideApi.postLocalGuiderOnboardingApproveAdmin(onboardingId, comment, { adminId }).then(extractData),
    reject: (onboardingId: number, comment: string, reviewerId?: string) => 
      OurbrideApi.postLocalGuiderOnboardingReject(onboardingId, comment, { reviewerId }).then(extractData),
  },
};
