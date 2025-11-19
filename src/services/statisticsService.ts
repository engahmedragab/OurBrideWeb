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
 * Statistics Service
 * All API calls related to statistics
 */
export const statisticsService = {
  // Get platform overview statistics
  getOverview: async () => {
    const response = await OurbrideApi.api.getHomeGetPlatformStatistics();
    return extractData(response);
  },

  // Get platform summary
  getSummary: async () => {
    const response = await OurbrideApi.api.getHomeGetPlatformSummary();
    return extractData(response);
  },

  // Get provider statistics
  getProviders: async () => {
    const response = await OurbrideApi.api.getHomeGetProviderStatistics();
    return extractData(response);
  },
};

export default statisticsService;

