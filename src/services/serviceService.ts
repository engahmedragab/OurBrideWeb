import { OurbrideApi } from '../common/api/ourbride-http-client';
import { Source } from '../common/api/gen/ourbride-api';
import { SERVICES_CONFIG, DEFAULT_SERVICE_QUERY } from '../config/services.config';

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
 * Service Service
 * All API calls related to services
 */
export const serviceService = {
  // Search services with filters
  search: async (params: {
    Search?: string;
    ServiceClass?: number;
    ServiceType?: number;
    MinPrice?: number;
    MaxPrice?: number;
    MinRating?: number;
    IsOurBrideService?: boolean;
    HasPackages?: boolean;
    HasInstallment?: boolean;
    Page?: number;
    PageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    // Merge with default query parameters
    const apiParams: any = {
      ...DEFAULT_SERVICE_QUERY,
      ...params,
      Page: params.Page ?? DEFAULT_SERVICE_QUERY.Page,
      PageSize: params.PageSize ?? DEFAULT_SERVICE_QUERY.PageSize,
      Search: params.Search ?? DEFAULT_SERVICE_QUERY.Search,
      MinPrice: params.MinPrice ?? DEFAULT_SERVICE_QUERY.MinPrice,
      MinRating: params.MinRating ?? DEFAULT_SERVICE_QUERY.MinRating,
      sortBy: params.sortBy ?? DEFAULT_SERVICE_QUERY.sortBy,
      sortOrder: params.sortOrder ?? DEFAULT_SERVICE_QUERY.sortOrder,
    };
    
    const response = await OurbrideApi.api.getServicesSearch(apiParams);
    return extractData(response);
  },

  // Get all services with pagination
  getAll: async (page: number = SERVICES_CONFIG.PAGINATION.DEFAULT_PAGE, pageSize: number = SERVICES_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE) => {
    const response = await OurbrideApi.api.getServicesGetAll({ page, pageSize });
    return extractData(response);
  },

  // Get service by ID
  getById: async (id: number) => {
    const response = await OurbrideApi.api.getServicesGet(id);
    return extractData(response);
  },

  // Get service reviews
  getReviews: async (
    id: number,
    page: number = SERVICES_CONFIG.REVIEWS.DEFAULT_PAGE,
    pageSize: number = SERVICES_CONFIG.REVIEWS.DEFAULT_PAGE_SIZE,
    rating?: number,
    sortBy?: string
  ) => {
    const query: any = {
      Page: page,
      PageSize: pageSize,
    };
    if (rating !== undefined) query.Rating = rating;
    if (sortBy) query.SortBy = sortBy;
    
    const response = await OurbrideApi.api.getServicesGetReviews(id, query);
    return extractData(response);
  },

  // Get review summary
  getReviewSummary: async (id: number) => {
    const response = await OurbrideApi.api.getServicesReviewSummary(id);
    return extractData(response);
  },

  // Get service packages
  getPackages: async (id: number) => {
    const response = await OurbrideApi.api.getServicesPackages(id);
    return extractData(response);
  },

  // Compare services
  compare: async (serviceIds: number[]) => {
    const response = await OurbrideApi.api.postServicesCompare(serviceIds);
    return extractData(response);
  },

  // Get services map
  getMap: async (params: {
    Latitude?: number;
    Longitude?: number;
    Radius?: number;
  } = {}) => {
    const response = await OurbrideApi.api.getServicesMap(params);
    return extractData(response);
  },

  // Add to wishlist
  addToWishlist: async (serviceId: number) => {
    const response = await OurbrideApi.api.postServicesAddToWishlists(serviceId);
    return extractData(response);
  },

  // Add to favorites
  addToFavorites: async (serviceId: number) => {
    const response = await OurbrideApi.api.postServicesAddToFavorites(serviceId);
    return extractData(response);
  },

  // Add review
  addReview: async (serviceId: number, reviewData: {
    rating: number;
    comment?: string;
    images?: string[];
    sourceId?: number;
    source?: Source;
    providerId?: number;
    branchId?: number;
    staffId?: string;
    userId?: string;
    nameEn?: string;
    nameAr?: string;
    descriptionEn?: string;
    descriptionAr?: string;
  }) => {
    const response = await OurbrideApi.api.postServicesAddReviews(serviceId, {
      sourceId: reviewData.sourceId || serviceId,
      source: reviewData.source || Source.Service,
      rating: reviewData.rating,
      nameEn: reviewData.nameEn || reviewData.comment,
      nameAr: reviewData.nameAr || reviewData.comment,
      descriptionEn: reviewData.descriptionEn || reviewData.comment,
      descriptionAr: reviewData.descriptionAr || reviewData.comment,
      providerId: reviewData.providerId,
      branchId: reviewData.branchId,
      staffId: reviewData.staffId,
      userId: reviewData.userId,
    });
    return extractData(response);
  },

  // Filter services
  filter: async (term?: string) => {
    const response = await OurbrideApi.api.getServicesFilter({ term });
    return extractData(response);
  },

  // Get services by preparation ID
  getByPreparationId: async (preparationId: number) => {
    const response = await OurbrideApi.api.getServicesGetByPreparationId(preparationId);
    return extractData(response);
  },

  // Get services by preparation ID (paged)
  getByPreparationIdPaged: async (preparationId: number, page: number = 1, pageSize: number = 10) => {
    const response = await OurbrideApi.api.getServicesGetByPreparationIdPaged(preparationId, { page, pageSize });
    return extractData(response);
  },

  // Get services by provider ID
  getByProviderId: async (providerId: number) => {
    const response = await OurbrideApi.api.getServicesGeByProviderId(providerId);
    return extractData(response);
  },

  // Search services by term
  searchByTerm: async (term?: string, page: number = 1, pageSize: number = 10) => {
    const response = await OurbrideApi.api.getServicesSearchByTerm({ term, page, pageSize });
    return extractData(response);
  },
};

export default serviceService;

