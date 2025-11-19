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
 * Preparation Service
 * All API calls related to preparations
 */
export const preparationService = {
  // Get all preparations
  getAll: async () => {
    const response = await OurbrideApi.api.getPreparationsGetAll();
    return extractData(response);
  },

  // Get featured preparations
  getFeatured: async () => {
    const response = await OurbrideApi.api.getPreparationsGetAllFeaturesPreparations();
    return extractData(response);
  },

  // Get preparation by ID
  getById: async (preparationId: number) => {
    const response = await OurbrideApi.api.getPreparationsGet(preparationId);
    return extractData(response);
  },

  // Get last services
  getLastServices: async () => {
    const response = await OurbrideApi.api.getPreparationsGetLastServices();
    return extractData(response);
  },

  // Get preparation statistics
  getStatistics: async (preparationId: number) => {
    const response = await OurbrideApi.api.getPreparationsGetPreparationStatistics(preparationId);
    return extractData(response);
  },

  // Get provider count for preparation
  getProviderCount: async (preparationId: number) => {
    const response = await OurbrideApi.api.getPreparationsGetPreparationProvidersCount(preparationId);
    return extractData(response);
  },

  // Get services by preparation (using serviceService search with preparation filter)
  getServicesByPreparation: async (preparationId: number) => {
    // Note: This might need to use serviceService.search with preparationId filter
    // For now, returning empty array as placeholder
    // The actual implementation depends on how services are linked to preparations
    return [];
  },

  // Get services by preparation with pagination
  getServicesByPreparationPaged: async (preparationId: number, page: number = 1, pageSize: number = 10) => {
    // Note: This might need to use serviceService.search with preparationId filter
    // For now, returning empty array as placeholder
    return [];
  },

  // Create preparation
  create: async (data: any) => {
    const response = await OurbrideApi.api.postPreparationsCreate(data);
    return extractData(response);
  },

  // Update preparation
  update: async (preparationId: number, data: any) => {
    const response = await OurbrideApi.api.putPreparationsUpdate(preparationId, data);
    return extractData(response);
  },

  // Delete preparation
  delete: async (preparationId: number) => {
    const response = await OurbrideApi.api.deletePreparationsDelete(preparationId);
    return extractData(response);
  },
};

export default preparationService;

