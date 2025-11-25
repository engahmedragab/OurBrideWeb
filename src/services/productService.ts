import { OurbrideApi } from '../common/api/ourbride-http-client';
import { PRODUCTS_CONFIG, DEFAULT_PRODUCT_QUERY } from '../config/products.config';

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
 * Product Service
 * All API calls related to products
 */
export const productService = {
  // Get all products with filters
  getAll: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    categoryId?: number;
    status?: string;
    providerId?: number;
    branchId?: number;
    staffId?: string;
  } = {}) => {
    // Merge with default query parameters
    const queryParams = {
      ...DEFAULT_PRODUCT_QUERY,
      ...params,
      page: params.page ?? DEFAULT_PRODUCT_QUERY.page,
      pageSize: params.pageSize ?? DEFAULT_PRODUCT_QUERY.pageSize,
    };
    const response = await OurbrideApi.api.getProductGetProducts(queryParams);
    return extractData(response);
  },

  // Get product by ID
  getById: async (id: number, query?: {
    providerId?: number;
    branchId?: number;
    staffId?: string;
  }) => {
    const response = await OurbrideApi.api.getProductGetProductById(id, query);
    return extractData(response);
  },

  // Get product by SKU
  getBySku: async (sku: string) => {
    const response = await OurbrideApi.api.getProductGetProductSku(sku);
    return extractData(response);
  },

  // Get product detail
  getDetail: async (id: number) => {
    const response = await OurbrideApi.api.getProductGetProductDetail(id);
    return extractData(response);
  },

  // Get product header
  getHeader: async (id: number) => {
    // Note: This might need to be implemented based on actual API
    // For now, using getById as fallback
    const response = await OurbrideApi.api.getProductGetProductById(id);
    return extractData(response);
  },

  // Search products
  search: async (params: {
    query?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    categoryId?: number;
    providerId?: number;
  } = {}) => {
    // Use the search endpoint if query is provided, otherwise use getAll
    if (params.query) {
      const response = await OurbrideApi.api.getProductSearchProducts({ query: params.query });
      return extractData(response);
    }
    // Otherwise use getAll with search parameter
    const response = await OurbrideApi.api.getProductGetProducts({
      search: params.search,
      page: params.page,
      pageSize: params.pageSize,
      categoryId: params.categoryId,
      providerId: params.providerId,
    });
    return extractData(response);
  },

  // Create product
  create: async (data: any, query?: {
    providerId?: number;
    branchId?: number;
    staffId?: string;
  }) => {
    const response = await OurbrideApi.api.postProductCreateProduct(data, query);
    return extractData(response);
  },

  // Update product
  update: async (id: number, data: any, query?: {
    providerId?: number;
    branchId?: number;
    staffId?: string;
  }) => {
    const response = await OurbrideApi.api.putProductUpdateProduct(id, data, query);
    return extractData(response);
  },

  // Delete product
  delete: async (id: number, query?: {
    providerId?: number;
    branchId?: number;
    staffId?: string;
  }) => {
    const response = await OurbrideApi.api.deleteProductDeleteProduct(id, query);
    return extractData(response);
  },
};

export default productService;

