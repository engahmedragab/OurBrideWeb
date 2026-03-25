import { apiClient } from './apiClient'
import type {
  CreateProductReviewRequest,

  SearchProductsRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type { ProductResponse, ApiResult,   ProductVariationResponse,
  ProductAttributeResponse,
  ProductBrandResponse,
  ProductsHomeResponse} from '@/types/responses'

/**
 * Helper function to extract error details from API errors
 */
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === 'object') {
    // Check if it's an Axios error with response
    const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
    if (axiosError.response) {
      const status = axiosError.response.status
      const responseData = axiosError.response.data
      
      // Try to extract error message from response data
      let errorMessage = defaultMessage
      if (responseData && typeof responseData === 'object') {
        const data = responseData as { message?: string; error?: string; errors?: unknown }
        if (data.message) {
          errorMessage = data.message
        } else if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : defaultMessage
        } else if (data.errors) {
          // Handle validation errors
          errorMessage = 'Validation error'
        }
      }
      
      return `Request failed with status code ${status}: ${errorMessage}`
    }
    
    if (axiosError.message) {
      return axiosError.message
    }
  }
  
  return error instanceof Error ? error.message : defaultMessage
}

/**
 * Product API endpoints
 * All endpoints return typed data from the backend
 */

export interface GetProductsParams {
  page?: number
  pageSize?: number
  search?: string
  categoryId?: number
  status?: string
  providerId?: number
  branchId?: number
  staffId?: string
}

export interface GetFilteredProductsParams {
  page?: number
  pageSize?: number
  search?: string
  categoryId?: number
  subCategoryId?: number
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStock?: boolean
  tags?: string[]
  sortBy?: string
  providerId?: number
  branchId?: number
  staffId?: string
}

/**
 * Get products list
 */
export const getProducts = async (
  params?: GetProductsParams
): Promise<ProductResponse[]> => {
  const response = await apiClient.api.getProductGetProducts(params)
  const responseData = response as unknown as { data?: { data?: ProductResponse[] } }
  
  if (!responseData?.data?.data) {
    return []
  }
  
  return responseData.data.data
}

/**
 * Get product by ID
 */
export const getProductById = async (
  id: number
): Promise<ProductResponse | null> => {
  try {
    const response = await apiClient.api.getProductGetProductById(id)
    const responseData = response as unknown as { data?: { data?: ProductResponse } }
    
    if (!responseData?.data?.data) {
      return null
    }
    
    return responseData.data.data
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Failed to fetch product by ID')
    // Return null to allow the cart page to continue working even if some products fail to load
    return null
  }
}

/**
 * Get product by slug
 */
export const getProductBySlug = async (
  slug: string
): Promise<ProductResponse | null> => {
  try {
    const response = await apiClient.api.getProductGetProductBySlug(slug)
    const responseData = response as unknown as { data?: { data?: ProductResponse } }
    
    if (!responseData?.data?.data) {
      return null
    }
    
    return responseData.data.data
  } catch (error) {
    return null
  }
}

/**
 * Get filtered products
 */
export const getFilteredProducts = async (
  params?: {
    search?: string
    categoryId?: number
    minPrice?: number
    maxPrice?: number
    rating?: number
    sortBy?: string
  }
): Promise<ApiResult<unknown>> => {
  const response = await apiClient.api.getProductGetFilteredProducts(params)
  const responseData = response as unknown as { data?: ApiResult<unknown> } | ApiResult<unknown>
  if (responseData && typeof responseData === 'object') {
    if ('data' in responseData && responseData.data && typeof responseData.data === 'object' && 'success' in responseData.data) {
      return responseData.data as ApiResult<unknown>
    }
    if ('success' in responseData) {
      return responseData as ApiResult<unknown>
    }
  }
  return { data: null, success: false, statusCode: 0, message: '' } as ApiResult<unknown>
}

/**
 * Get products for home page
 */
export const getProductsHome = async (): Promise<ApiResult<ProductsHomeResponse>> => {
  const response = await apiClient.api.getProductGetProductsHome()
  const responseData = response as unknown as { data?: ApiResult<ProductsHomeResponse> } | ApiResult<ProductsHomeResponse> | ProductsHomeResponse
  if (responseData && typeof responseData === 'object') {
    if ('data' in responseData && responseData.data && typeof responseData.data === 'object' && 'success' in responseData.data) {
      return responseData.data as ApiResult<ProductsHomeResponse>
    }
    if ('success' in responseData) {
      return responseData as ApiResult<ProductsHomeResponse>
    }
    // If response is directly ProductsHomeResponse
    if ('headers' in responseData || 'tags' in responseData) {
      return {
        data: responseData as ProductsHomeResponse,
        success: true,
        statusCode: 200,
        message: '',
        errors: undefined,
      }
    }
  }
  return { data: null, success: false, statusCode: 0, message: '', errors: undefined } as unknown as ApiResult<ProductsHomeResponse>
}

/**
 * Get product offers
 */
export const getProductOffers = async (): Promise<ApiResult<unknown>> => {
  const response = await apiClient.api.getProductGetOffers()
  const responseData = response as unknown as { data?: ApiResult<unknown> } | ApiResult<unknown>
  if (responseData && typeof responseData === 'object') {
    if ('data' in responseData && responseData.data && typeof responseData.data === 'object' && 'success' in responseData.data) {
      return responseData.data as ApiResult<unknown>
    }
    if ('success' in responseData) {
      return responseData as ApiResult<unknown>
    }
  }
  return { data: null, success: false, statusCode: 0, message: '' } as ApiResult<unknown>
}

/**
 * Get product categories
 */
export const getProductCategories = async (): Promise<ApiResult<unknown>> => {
  const response = await apiClient.api.getProductGetCategories()
  const responseData = response as unknown as { data?: ApiResult<unknown> } | ApiResult<unknown>
  if (responseData && typeof responseData === 'object') {
    if ('data' in responseData && responseData.data && typeof responseData.data === 'object' && 'success' in responseData.data) {
      return responseData.data as ApiResult<unknown>
    }
    if ('success' in responseData) {
      return responseData as ApiResult<unknown>
    }
  }
  return { data: null, success: false, statusCode: 0, message: '' } as ApiResult<unknown>
}

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  categoryId: number,
  params?: {
    page?: number
    pageSize?: number
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ProductResponse[]> => {
  try {
    const response = await apiClient.api.getProductGetProductsByCategory(
      categoryId,
      params
    )
    const responseData = response as unknown as { data?: { data?: ProductResponse[] } }
    
    if (!responseData?.data?.data) {
      return []
    }
    
    return responseData.data.data
  } catch (error) {
    return []
  }
}

/**
 * Get related products
 */
export const getRelatedProducts = async (
  productId: number,
  _limit?: number
): Promise<ProductResponse[]> => {
  try {
    // Note: The API endpoint expects both productId (number) and id (string)
    const response = await apiClient.api.getProductGetRelatedProducts(
      productId,
      { providerId: undefined, branchId: undefined, staffId: undefined }
    )
    const responseData = response as unknown as { data?: { data?: ProductResponse[] } | ApiResult<ProductResponse[]> }
    
    // The endpoint returns ApiResult, extract data from it
    // Adjust based on actual API response structure
    if (responseData?.data) {
      if ('data' in responseData.data && Array.isArray(responseData.data.data)) {
        return responseData.data.data
      }
      if (Array.isArray(responseData.data)) {
        return responseData.data
      }
    }
    
    return []
  } catch (error) {
    return []
  }
}

/**
 * Get product reviews
 */
export const getProductReviews = async (
  productId: number,
  params?: {
    page?: number
    pageSize?: number
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ApiResult<unknown>> => {
  const response = await apiClient.api.getProductGetProductReviews(
    String(productId),
    { productId, ...params }
  )
  const responseData = response as unknown as { data?: ApiResult<unknown> } | ApiResult<unknown>
  if (responseData && typeof responseData === 'object') {
    if ('data' in responseData && responseData.data && typeof responseData.data === 'object' && 'success' in responseData.data) {
      return responseData.data as ApiResult<unknown>
    }
    if ('success' in responseData) {
      return responseData as ApiResult<unknown>
    }
  }
  return { data: null, success: false, statusCode: 0, message: '' } as ApiResult<unknown>
}

/**
 * Submit a review for a product
 * POST /api/v1/products/{id}/review
 */
export const submitProductReview = async (
  productId: number,
  data: CreateProductReviewRequest,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ApiResult<unknown>> => {
  try {
    const response = await apiClient.api.postProductSubmitProductReview(
      productId,
      String(productId),
      data,
      query
    )
    const responseData = response as unknown as { data?: { data?: ApiResult<unknown> } | ApiResult<unknown> } | ApiResult<unknown>
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData) {
        const nested = responseData.data
        if (nested && typeof nested === 'object' && 'data' in nested) {
          return nested.data as ApiResult<unknown>
        }
        return nested as ApiResult<unknown>
      }
      return responseData as ApiResult<unknown>
    }
    return responseData as ApiResult<unknown>
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to submit product review'
    )
  }
}

/**
 * Toggle favorite for a product
 * POST /api/v1/products/{productId}/toggle-favorite
 */
export const toggleProductFavorite = async (
  productId: number,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<boolean> => {
  try {
    const response = await apiClient.api.postProductToggleFavorite(productId, query)
    const responseData = response as unknown as { data?: { data?: boolean } | { success?: boolean } | boolean } | { success?: boolean } | boolean
    if (typeof responseData === 'boolean') {
      return responseData
    }
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data) {
        if (typeof responseData.data === 'boolean') {
          return responseData.data
        }
        if (typeof responseData.data === 'object' && 'data' in responseData.data) {
          return responseData.data.data ?? true
        }
        if (typeof responseData.data === 'object' && 'success' in responseData.data) {
          return responseData.data.success ?? true
        }
      }
      if ('success' in responseData) {
        return responseData.success ?? true
      }
    }
    return true
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to toggle product favorite'
    )
  }
}

/**
 * Search products (GET)
 * GET /api/v1/products/search
 */
export const searchProducts = async (
  query: string,
  _params?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ProductResponse[]> => {
  try {
    const response = await apiClient.api.getProductSearchProducts(
      { query }
    )
    const responseData = response as unknown as { data?: { data?: ProductResponse[] } | ApiResult<ProductResponse[]> }
    
    // Handle ApiResult response structure
    if (responseData?.data) {
      if (typeof responseData.data === 'object' && 'data' in responseData.data) {
        const apiResult = responseData.data as { data?: unknown }
        const data = apiResult.data
        if (Array.isArray(data)) {
          return data as ProductResponse[]
        }
      }
      if (Array.isArray(responseData.data)) {
        return responseData.data
      }
    }
    
    return []
  } catch (error) {
    return []
  }
}

/**
 * Advanced search products (POST)
 * POST /api/v1/products/search
 */
export const searchProductsAdvanced = async (
  data: SearchProductsRequest,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ApiResult<unknown>> => {
  try {
    const response = await apiClient.api.postProductSearchProducts(data, query)
    const responseData = response as unknown as { data?: { data?: ApiResult<unknown> } | ApiResult<unknown> } | ApiResult<unknown>
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData) {
        const nested = responseData.data
        if (nested && typeof nested === 'object' && 'data' in nested) {
          return nested.data as ApiResult<unknown>
        }
        return nested as ApiResult<unknown>
      }
      return responseData as ApiResult<unknown>
    }
    return responseData as ApiResult<unknown>
  } catch (error) {
    throw error
  }
}

/**
 * Toggle wishlist for a product
 * POST /api/v1/products/{productId}/toggle-wishlist
 */
export const toggleProductWishlist = async (
  productId: number,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<boolean> => {
  try {
    const response = await apiClient.api.postProductToggleWishlist(productId, query)
    const responseData = response as unknown as { data?: { data?: boolean } | { success?: boolean } | boolean } | { success?: boolean } | boolean
    if (typeof responseData === 'boolean') {
      return responseData
    }
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data) {
        if (typeof responseData.data === 'boolean') {
          return responseData.data
        }
        if (typeof responseData.data === 'object' && 'data' in responseData.data) {
          return responseData.data.data ?? true
        }
        if (typeof responseData.data === 'object' && 'success' in responseData.data) {
          return responseData.data.success ?? true
        }
      }
      if ('success' in responseData) {
        return responseData.success ?? true
      }
    }
    return true
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to toggle product wishlist'
    )
  }
}

/**
 * Get product by SKU
 */
export const getProductBySku = async (
  sku: string,
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ProductResponse | null> => {
  try {
    const response = await apiClient.api.getProductGetProductBySku(sku, params)
    const responseData = response as unknown as { data?: { data?: ProductResponse } }
    
    if (!responseData?.data?.data) {
      return null
    }
    
    return responseData.data.data
  } catch (error) {
    return null
  }
}

/**
 * Get product variations
 */
export const getProductVariations = async (
  productId: number | string,
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ProductVariationResponse[]> => {
  try {
    const response = await apiClient.api.getProductGetProductVariations(
      String(productId),
      { productId: typeof productId === 'number' ? productId : parseInt(productId, 10), ...params }
    )
    const responseData = response as unknown as { data?: { data?: ProductVariationResponse[] } }
    
    if (!responseData?.data?.data) {
      return []
    }
    
    return responseData.data.data
  } catch (error) {
    return []
  }
}

/**
 * Get product attributes
 */
export const getProductAttributes = async (
  productId: number,
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ProductAttributeResponse[]> => {
  try {
    const response = await apiClient.api.getProductGetProductAttributes(
      productId,
      params
    )
    const responseData = response as unknown as { data?: { data?: ProductAttributeResponse[] } }
    
    if (!responseData?.data?.data) {
      return []
    }
    
    return responseData.data.data
  } catch (error) {
    return []
  }
}

/**
 * Get all product brands
 */
export const getProductBrands = async (
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ProductBrandResponse[]> => {
  try {
    const response = await apiClient.api.getProductGetAllBrands(params)
    const responseData = response as unknown as { data?: { data?: ProductBrandResponse[] } | ApiResult<ProductBrandResponse[]> } | { data?: ProductBrandResponse[] }
    
    // Handle ApiResult response structure
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      const data = responseData.data
      if (data && typeof data === 'object') {
        if ('data' in data && Array.isArray(data.data)) {
          return data.data as ProductBrandResponse[]
        }
        if (Array.isArray(data)) {
          return data as ProductBrandResponse[]
        }
      }
    }
    
    return []
  } catch (error) {
    return []
  }
}

/**
 * Get flash sale grouped products
 */
export const getFlashSaleGrouped = async (
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ApiResult<unknown>> => {
  try {
    const response = await apiClient.api.getProductGetFlashSaleGrouped(params)
    const responseData = response as unknown as { data?: ApiResult<unknown> } | ApiResult<unknown>
    if (responseData && typeof responseData === 'object') {
      if ('data' in responseData && responseData.data && typeof responseData.data === 'object' && 'success' in responseData.data) {
        return responseData.data as ApiResult<unknown>
      }
      if ('success' in responseData && 'statusCode' in responseData) {
        return responseData as ApiResult<unknown>
      }
    }
    const defaultResult: ApiResult<unknown> = { data: null, success: false, statusCode: 0, message: '' }
    return defaultResult
  } catch (error) {
    throw error
  }
}

/**
 * Get related category products
 */
export const getRelatedCategoryProducts = async (
  productId: number,
  categoryId: number | string,
  params?: {
    providerId?: number
    branchId?: number
    staffId?: string
  }
): Promise<ProductResponse[]> => {
  try {
    // The API expects query object with providerId/branchId/staffId, not categoryId
    // categoryId might need to be passed differently or this API doesn't support it
    const query = params ? {
      providerId: params.providerId,
      branchId: params.branchId,
      staffId: params.staffId,
    } : undefined
    const response = await apiClient.api.getProductGetRelatedCategoryProducts(
      productId,
      query,
      {}
    )
    const responseData = response as unknown as { data?: { data?: ProductResponse[] } | ApiResult<ProductResponse[]> }
    
    // Handle ApiResult response structure
    if (responseData?.data) {
      if (typeof responseData.data === 'object' && 'data' in responseData.data) {
        const apiResult = responseData.data as { data?: unknown }
        const data = apiResult.data
        if (Array.isArray(data)) {
          return data as ProductResponse[]
        }
      }
      if (Array.isArray(responseData.data)) {
        return responseData.data
      }
    }
    
    return []
  } catch (error) {
    return []
  }
}

