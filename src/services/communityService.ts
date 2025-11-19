import { OurbrideApi } from '../common/api/ourbride-http-client';

/**
 * Helper to extract data from ApiResult format
 * ApiResult<T> = { success, statusCode, data: T, message?, errors? }
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
 * Community Service
 * Wraps all community-related API calls
 */
export const communityService = {
  // ==================== ARTICLES ====================
  articles: {
    getAll: (page = 1, pageSize = 20) =>
      OurbrideApi.getArticlesGetAll({ page, pageSize }).then(extractData),
    
    getById: (id) =>
      OurbrideApi.getArticlesGetById(id).then(extractData),
    
    getPublished: (page = 1, pageSize = 20) =>
      OurbrideApi.getArticlesGetPublished({ page, pageSize }).then(extractData),
    
    getFeatured: (page = 1, pageSize = 20) =>
      OurbrideApi.getArticlesGetFeatured({ page, pageSize }).then(extractData),
    
    getApproved: (page = 1, pageSize = 20) =>
      OurbrideApi.getArticlesGetApproved({ page, pageSize }).then(extractData),
    
    getByUserId: (userId) =>
      OurbrideApi.getArticlesGetByUserId(userId).then(extractData),
    
    getBySlug: (slug) =>
      OurbrideApi.getArticlesGetBySlug(slug).then(extractData),
    
    search: (searchTerm, page = 1, pageSize = 20) =>
      OurbrideApi.getArticlesSearch({ searchTerm, page, pageSize }).then(extractData),
    
    create: (data) =>
      OurbrideApi.postArticlesCreate(data).then(extractData),
    
    update: (id, data) =>
      OurbrideApi.putArticlesUpdate(id, data).then(extractData),
    
    delete: (id) =>
      OurbrideApi.deleteArticlesDelete(id).then(extractData),
    
    approve: (id) =>
      OurbrideApi.postArticlesApprove(id).then(extractData),
    
    addReview: (id, rating, comment) =>
      OurbrideApi.postArticlesAddReview(id, { rating, comment }).then(extractData),
    
    toggleLike: (id) =>
      OurbrideApi.postArticlesToggleLike(id).then(extractData),
    
    isLiked: (id) =>
      OurbrideApi.getArticlesIsLiked(id).then(extractData),
    
    toggleFavorite: (id) =>
      OurbrideApi.postArticlesToggleFavorite(id).then(extractData),
    
    isFavorite: (id) =>
      OurbrideApi.getArticlesIsFavorite(id).then(extractData),
    
    addMedia: (id, mediaId) =>
      OurbrideApi.postArticlesAddMedia(id, mediaId).then(extractData),
    
    removeMedia: (id, mediaId) =>
      OurbrideApi.deleteArticlesRemoveMedia(id, mediaId).then(extractData),
    
    getMedia: (id) =>
      OurbrideApi.getArticlesGetMedia(id).then(extractData),
    
    incrementView: (id) =>
      OurbrideApi.postArticlesIncrementView(id).then(extractData),
  },

  // ==================== POSTS ====================
  posts: {
    getAll: (page = 1, pageSize = 20) =>
      OurbrideApi.getPostsGetAll({ page, pageSize }).then(extractData),
    
    getById: (id) =>
      OurbrideApi.getPostsGetById(id).then(extractData),
    
    getPublished: (page = 1, pageSize = 20) =>
      OurbrideApi.getPostsGetPublished({ page, pageSize }).then(extractData),
    
    getFeatured: (page = 1, pageSize = 20) =>
      OurbrideApi.getPostsGetFeatured({ page, pageSize }).then(extractData),
    
    getByUserId: (userId) =>
      OurbrideApi.getPostsGetByUserId(userId).then(extractData),
    
    getByCategory: (categoryId, page = 1, pageSize = 20) =>
      OurbrideApi.getPostsGetByCategory(categoryId, { page, pageSize }).then(extractData),
    
    getByItem: (itemId, page = 1, pageSize = 20) =>
      OurbrideApi.getPostsGetByItem(itemId, { page, pageSize }).then(extractData),
    
    getByPreparation: (preparationId, page = 1, pageSize = 20) =>
      OurbrideApi.getPostsGetByPreparation(preparationId, { page, pageSize }).then(extractData),
    
    getByTag: (tagId, page = 1, pageSize = 20) =>
      OurbrideApi.getPostsGetByTag(tagId, { page, pageSize }).then(extractData),
    
    search: (searchTerm, page = 1, pageSize = 20) =>
      OurbrideApi.getPostsSearch({ searchTerm, page, pageSize }).then(extractData),
    
    create: (data) =>
      OurbrideApi.postPostsCreate(data).then(extractData),
    
    update: (id, data) =>
      OurbrideApi.putPostsUpdate(id, data).then(extractData),
    
    delete: (id) =>
      OurbrideApi.deletePostsDelete(id).then(extractData),
    
    toggleLike: (id) =>
      OurbrideApi.postPostsToggleLike(id).then(extractData),
    
    isLiked: (id) =>
      OurbrideApi.getPostsIsLiked(id).then(extractData),
    
    toggleFavorite: (id) =>
      OurbrideApi.postPostsToggleFavorite(id).then(extractData),
    
    isFavorite: (id) =>
      OurbrideApi.getPostsIsFavorite(id).then(extractData),
    
    incrementView: (id) =>
      OurbrideApi.postPostsIncrementView(id).then(extractData),
  },

  // ==================== BLOGS ====================
  blogs: {
    getAll: (page = 1, pageSize = 20) =>
      OurbrideApi.getBlogsGetAll({ page, pageSize }).then(extractData),
    
    getById: (id) =>
      OurbrideApi.getBlogsGetById(id).then(extractData),
    
    getPublished: (page = 1, pageSize = 20) =>
      OurbrideApi.getBlogsGetPublished({ page, pageSize }).then(extractData),
    
    getFeatured: (page = 1, pageSize = 20) =>
      OurbrideApi.getBlogsGetFeatured({ page, pageSize }).then(extractData),
    
    getByUserId: (userId) =>
      OurbrideApi.getBlogsGetByUserId(userId).then(extractData),
    
    getBySlug: (slug) =>
      OurbrideApi.getBlogsGetBySlug(slug).then(extractData),
    
    search: (searchTerm) =>
      OurbrideApi.getBlogsSearch({ searchTerm }).then(extractData),
    
    create: (data) =>
      OurbrideApi.postBlogsCreate(data).then(extractData),
    
    update: (id, data) =>
      OurbrideApi.putBlogsUpdate(id, data).then(extractData),
    
    delete: (id) =>
      OurbrideApi.deleteBlogsDelete(id).then(extractData),
    
    toggleLike: (id) =>
      OurbrideApi.postBlogsToggleLike(id).then(extractData),
    
    isLiked: (id) =>
      OurbrideApi.getBlogsIsLiked(id).then(extractData),
    
    toggleFavorite: (id) =>
      OurbrideApi.postBlogsToggleFavorite(id).then(extractData),
    
    isFavorite: (id) =>
      OurbrideApi.getBlogsIsFavorite(id).then(extractData),
    
    incrementView: (id) =>
      OurbrideApi.postBlogsIncrementView(id).then(extractData),
  },

  // ==================== REELS ====================
  reels: {
    getAll: (page = 1, pageSize = 20) =>
      OurbrideApi.getReelsGetAll({ page, pageSize }).then(extractData),
    
    getById: (id) =>
      OurbrideApi.getReelsGetById(id).then(extractData),
    
    getPublished: (page = 1, pageSize = 20) =>
      OurbrideApi.getReelsGetPublished({ page, pageSize }).then(extractData),
    
    getFeatured: (page = 1, pageSize = 20) =>
      OurbrideApi.getReelsGetFeatured({ page, pageSize }).then(extractData),
    
    getTrending: (page = 1, pageSize = 20) =>
      OurbrideApi.getReelsGetTrending({ page, pageSize }).then(extractData),
    
    getByUserId: (userId) =>
      OurbrideApi.getReelsGetByUserId(userId).then(extractData),
    
    search: (searchTerm) =>
      OurbrideApi.getReelsSearch({ searchTerm }).then(extractData),
    
    create: (data) =>
      OurbrideApi.postReelsCreate(data).then(extractData),
    
    update: (id, data) =>
      OurbrideApi.putReelsUpdate(id, data).then(extractData),
    
    delete: (id) =>
      OurbrideApi.deleteReelsDelete(id).then(extractData),
    
    toggleLike: (id) =>
      OurbrideApi.postReelsToggleLike(id).then(extractData),
    
    isLiked: (id) =>
      OurbrideApi.getReelsIsLiked(id).then(extractData),
    
    toggleFavorite: (id) =>
      OurbrideApi.postReelsToggleFavorite(id).then(extractData),
    
    isFavorite: (id) =>
      OurbrideApi.getReelsIsFavorite(id).then(extractData),
    
    incrementView: (id) =>
      OurbrideApi.postReelsIncrementView(id).then(extractData),
  },

  // ==================== DECISION GROUPS (POLLS) ====================
  decisionGroups: {
    getAll: (page = 1, pageSize = 20) =>
      OurbrideApi.getDecisionGroupsGetAll({ page, pageSize }).then(extractData),
    
    getById: (id) =>
      OurbrideApi.getDecisionGroupsGetById(id).then(extractData),
    
    getWithOptions: (id) =>
      OurbrideApi.getDecisionGroupsGetWithOptions(id).then(extractData),
    
    getPublished: (page = 1, pageSize = 20) =>
      OurbrideApi.getDecisionGroupsGetPublished({ page, pageSize }).then(extractData),
    
    getActive: (page = 1, pageSize = 20) =>
      OurbrideApi.getDecisionGroupsGetActive({ page, pageSize }).then(extractData),
    
    getByUserId: (userId) =>
      OurbrideApi.getDecisionGroupsGetByUserId(userId).then(extractData),
    
    search: (searchTerm) =>
      OurbrideApi.getDecisionGroupsSearch({ searchTerm }).then(extractData),
    
    create: (data) =>
      OurbrideApi.postDecisionGroupsCreate(data).then(extractData),
    
    update: (id, data) =>
      OurbrideApi.putDecisionGroupsUpdate(id, data).then(extractData),
    
    delete: (id) =>
      OurbrideApi.deleteDecisionGroupsDelete(id).then(extractData),
    
    addOption: (id, optionData) =>
      OurbrideApi.postDecisionGroupsAddOption(id, optionData).then(extractData),
    
    castVote: (id, optionId, comment) =>
      OurbrideApi.postDecisionGroupsCastVote(id, { optionId, comment }).then(extractData),
    
    toggleLike: (id) =>
      OurbrideApi.postDecisionGroupsToggleLike(id).then(extractData),
    
    isLiked: (id) =>
      OurbrideApi.getDecisionGroupsIsLiked(id).then(extractData),
    
    incrementView: (id) =>
      OurbrideApi.postDecisionGroupsIncrementView(id).then(extractData),
  },

  // ==================== CONTESTS ====================
  contests: {
    getAll: (page = 1, pageSize = 20) =>
      OurbrideApi.getContestsGetAll({ page, pageSize }).then(extractData),
    
    getById: (id) =>
      OurbrideApi.getContestsGetById(id).then(extractData),
    
    getWithLeaderboard: (id) =>
      OurbrideApi.getContestsGetWithLeaderboard(id).then(extractData),
    
    getPublished: (page = 1, pageSize = 20) =>
      OurbrideApi.getContestsGetPublished({ page, pageSize }).then(extractData),
    
    getActive: (page = 1, pageSize = 20) =>
      OurbrideApi.getContestsGetActive({ page, pageSize }).then(extractData),
    
    getByUserId: (userId) =>
      OurbrideApi.getContestsGetByUserId(userId).then(extractData),
    
    search: (searchTerm) =>
      OurbrideApi.getContestsSearch({ searchTerm }).then(extractData),
    
    create: (data) =>
      OurbrideApi.postContestsCreate(data).then(extractData),
    
    update: (id, data) =>
      OurbrideApi.putContestsUpdate(id, data).then(extractData),
    
    delete: (id) =>
      OurbrideApi.deleteContestsDelete(id).then(extractData),
    
    approve: (id) =>
      OurbrideApi.postContestsApprove(id).then(extractData),
    
    register: (id, displayName, bio) =>
      OurbrideApi.postContestsRegister(id, { displayName, bio }).then(extractData),
    
    submitEntry: (id, entryData) =>
      OurbrideApi.postContestsSubmitEntry(id, entryData).then(extractData),
    
    getLeaderboardStandings: (id) =>
      OurbrideApi.getContestsGetLeaderboardStandings(id).then(extractData),
    
    toggleLike: (id) =>
      OurbrideApi.postContestsToggleLike(id).then(extractData),
    
    isLiked: (id) =>
      OurbrideApi.getContestsIsLiked(id).then(extractData),
    
    incrementView: (id) =>
      OurbrideApi.postContestsIncrementView(id).then(extractData),
  },

  // ==================== TAGS ====================
  tags: {
    getAll: () =>
      OurbrideApi.getTagsGetAll().then(extractData),
    
    getById: (id) =>
      OurbrideApi.getTagsGetById(id).then(extractData),
    
    getBySlug: (slug) =>
      OurbrideApi.getTagsGetBySlug(slug).then(extractData),
    
    search: (searchTerm) =>
      OurbrideApi.getTagsSearch({ searchTerm }).then(extractData),
    
    create: (data) =>
      OurbrideApi.postTagsCreate(data).then(extractData),
    
    update: (id, data) =>
      OurbrideApi.putTagsUpdate(id, data).then(extractData),
    
    delete: (id) =>
      OurbrideApi.deleteTagsDelete(id).then(extractData),
  },

  // ==================== UNIFIED CONTENT ====================
  unified: {
    getByCategory: (categoryId, page = 1, pageSize = 20) =>
      OurbrideApi.getUnifiedContentGetByCategory(categoryId, { page, pageSize }).then(extractData),
    
    getByItem: (itemId, page = 1, pageSize = 20) =>
      OurbrideApi.getUnifiedContentGetByItem(itemId, { page, pageSize }).then(extractData),
    
    getByPreparation: (preparationId, page = 1, pageSize = 20) =>
      OurbrideApi.getUnifiedContentGetByPreparation(preparationId, { page, pageSize }).then(extractData),
    
    getByProvider: (providerId, page = 1, pageSize = 20) =>
      OurbrideApi.getUnifiedContentGetByProvider(providerId, { page, pageSize }).then(extractData),
    
    getByBazaarEvent: (bazaarEventId, page = 1, pageSize = 20) =>
      OurbrideApi.getUnifiedContentGetByBazaarEvent(bazaarEventId, { page, pageSize }).then(extractData),
  },

  // ==================== PROFILES ====================
  profiles: {
    getUserProfile: (userId) =>
      OurbrideApi.getCommunityProfileGetUserProfile(userId).then(extractData),
    
    getProviderProfile: (providerId) =>
      OurbrideApi.getCommunityProfileGetProviderProfile(providerId).then(extractData),
    
    getBazaarEventProfile: (bazaarEventId) =>
      OurbrideApi.getCommunityProfileGetBazaarEventProfile(bazaarEventId).then(extractData),
    
    toggleLike: (profileType, profileId, profileUserId) =>
      OurbrideApi.postCommunityProfileToggleLike({ profileType, profileId, profileUserId }).then(extractData),
    
    isLiked: (profileType, profileId, profileUserId) =>
      OurbrideApi.getCommunityProfileIsLiked({ profileType, profileId, profileUserId }).then(extractData),
    
    toggleFollow: (profileType, profileId, profileUserId) =>
      OurbrideApi.postCommunityProfileToggleFollow({ profileType, profileId, profileUserId }).then(extractData),
    
    isFollowing: (profileType, profileId, profileUserId) =>
      OurbrideApi.getCommunityProfileIsFollowing({ profileType, profileId, profileUserId }).then(extractData),
    
    toggleFavorite: (profileType, profileId, profileUserId) =>
      OurbrideApi.postCommunityProfileToggleFavorite({ profileType, profileId, profileUserId }).then(extractData),
    
    isFavorite: (profileType, profileId, profileUserId) =>
      OurbrideApi.getCommunityProfileIsFavorite({ profileType, profileId, profileUserId }).then(extractData),
  },
};

export default communityService;




