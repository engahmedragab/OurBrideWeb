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
 * Item Service
 * All API calls related to items
 */
export const itemService = {
  // Get all items
  getAll: async () => {
    const response = await OurbrideApi.api.getItemsGetAll();
    return extractData(response);
  },

  // Get item by ID
  getById: async (itemId: number) => {
    const response = await OurbrideApi.api.getItemsGet(itemId);
    return extractData(response);
  },

  // Get favorite items
  getFavorites: async () => {
    const response = await OurbrideApi.api.getItemsGetAllFavorite();
    return extractData(response);
  },

  // Create item
  create: async (data: any) => {
    const response = await OurbrideApi.api.postItemsCreate(data);
    return extractData(response);
  },

  // Update item
  update: async (itemId: number, data: any) => {
    const response = await OurbrideApi.api.putItemsUpdate(itemId, data);
    return extractData(response);
  },

  // Delete item
  delete: async (itemId: number) => {
    const response = await OurbrideApi.api.deleteItemsDelete(itemId);
    return extractData(response);
  },

  // Get item history
  getHistory: async (itemId: number) => {
    const response = await OurbrideApi.api.getItemsGetHistory(itemId);
    return extractData(response);
  },

  // Add to favorites
  addToFavorites: async (itemId: number) => {
    const response = await OurbrideApi.api.postItemsFavorite(itemId);
    return extractData(response);
  },

  // Remove from favorites
  removeFromFavorites: async (itemId: number) => {
    const response = await OurbrideApi.api.postItemsUnFavorite(itemId);
    return extractData(response);
  },
};

export default itemService;

