import { OurbrideApi } from '../common/api/ourbride-http-client';

/**
 * Helper function to extract data from ApiResult format
 */
const extractData = (response: any) => {
  if (!response) return null;
  
  // Handle Axios response structure
  const data = response.data || response;
  
  if (!data) return null;
  
  // If response.data has a 'data' property and 'success' property, it's ApiResult format
  if (data.data !== undefined && data.success !== undefined) {
    return data.data;
  }
  
  // Otherwise, return the data directly
  return data;
};

/**
 * Provider Service
 * All API calls related to providers
 */
export const providerService = {
  // Registration
  register: async (data: any) => {
    const response = await OurbrideApi.api.postProviderRegistration(data);
    return extractData(response);
  },

  // Create provider
  create: async (data: any) => {
    const response = await OurbrideApi.api.postProviderCreate(data);
    return extractData(response);
  },

  // Get provider by ID
  getById: async (id: number) => {
    const response = await OurbrideApi.api.getProviderGetById(id);
    return extractData(response);
  },

  // Update provider
  update: async (id: number, data: any) => {
    const response = await OurbrideApi.api.putProviderUpdate(id, data);
    return extractData(response);
  },

  // Delete provider
  delete: async (id: number) => {
    const response = await OurbrideApi.api.deleteProviderDelete(id);
    return extractData(response);
  },

  // Get featured providers
  getFeatured: async (count: number = 10) => {
    const response = await OurbrideApi.api.getProviderGetFeaturedProviders({ count });
    return extractData(response);
  },

  // Get top-rated providers
  getTopRated: async (count: number = 10) => {
    const response = await OurbrideApi.api.getProviderGetTopRatedProviders({ count });
    return extractData(response);
  },

  // Get popular providers
  getPopular: async (count: number = 10) => {
    const response = await OurbrideApi.api.getProviderGetPopularProviders({ count });
    return extractData(response);
  },

  // Get public profile by ID
  getPublicProfileById: async (providerId: number) => {
    const response = await OurbrideApi.api.getProviderGetPublicProfileById(providerId);
    return extractData(response);
  },

  // Get public profile by unique code
  getPublicProfileByCode: async (uniqueCode: string) => {
    const response = await OurbrideApi.api.getProviderGetPublicProfileByUniqueCode(uniqueCode);
    return extractData(response);
  },

  // Get public profile by slug
  getPublicProfileBySlug: async (slug: string) => {
    const response = await OurbrideApi.api.getProviderGetPublicProfileBySlug(slug);
    return extractData(response);
  },

  // Get public store
  getPublicStore: async (providerId: number) => {
    const response = await OurbrideApi.api.getProviderGetPublicStore(providerId);
    return extractData(response);
  },

  // Get providers for user
  getProvidersForUser: async () => {
    const response = await OurbrideApi.api.getProviderGetProvidersForUser();
    return extractData(response);
  },

  // Get user provider roles
  getUserProviderRoles: async (providerId: number) => {
    const response = await OurbrideApi.api.getProviderGetUserProviderRoles(providerId);
    return extractData(response);
  },

  // Get my providers
  getMyProviders: async () => {
    const response = await OurbrideApi.api.getProviderGetMyProviders();
    return extractData(response);
  },

  // Get my provider roles
  getMyProviderRoles: async (providerId: number) => {
    const response = await OurbrideApi.api.getProviderGetMyProviderRoles(providerId);
    return extractData(response);
  },

  // Follow provider
  follow: async (providerId: number, serviceId: string) => {
    const response = await OurbrideApi.api.postProviderAddToFollow(providerId, serviceId);
    return extractData(response);
  },

  // Add review
  addReview: async (providerId: number, serviceId: string, reviewData: any) => {
    const response = await OurbrideApi.api.postProviderAddReviews(providerId, serviceId, reviewData);
    return extractData(response);
  },

  // Verify provider
  verify: async (providerId: number) => {
    const response = await OurbrideApi.api.postProviderVerifyProvider(providerId);
    return extractData(response);
  },

  // Get public profile settings
  getPublicProfileSettings: async (providerId: number) => {
    const response = await OurbrideApi.api.getProviderGetPublicProfileSettings(providerId);
    return extractData(response);
  },

  // Update public profile settings
  updatePublicProfileSettings: async (providerId: number, data: any) => {
    const response = await OurbrideApi.api.putProviderUpdatePublicProfileSettings(providerId, data);
    return extractData(response);
  },
};

export default providerService;

