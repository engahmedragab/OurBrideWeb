import { apiClient } from './apiClient'
import type {
  ProductResponse,
  ProductResponseApiResult,
  ProductResponseListApiResult,
  ApiResult,
} from '@/../client/common/api/gen/ourbride-api'

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
  
  if (!response.data?.data) {
    return []
  }
  
  return response.data.data
}

/**
 * Get product by ID
 */
export const getProductById = async (
  id: number
): Promise<ProductResponse | null> => {
  try {
    const response = await apiClient.api.getProductGetProductById(id)
    
    if (!response.data?.data) {
      return null
    }
    
    return response.data.data
  } catch (error) {
    console.error('Error fetching product by ID:', error)
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
    
    if (!response.data?.data) {
      return null
    }
    
    return response.data.data
  } catch (error) {
    console.error('Error fetching product by slug:', error)
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
): Promise<ApiResult> => {
    const response = await apiClient.api.getProductGetFilteredProducts(params)
  return response.data
}

/**
 * Get products for home page
 */
export const getProductsHome = async (): Promise<ApiResult> => {
  const response = await apiClient.api.getProductGetProductsHome()
  return response.data
}

/**
 * Get product offers
 */
export const getProductOffers = async (): Promise<ApiResult> => {
  const response = await apiClient.api.getProductGetOffers()
  return response.data
}

/**
 * Get product categories
 */
export const getProductCategories = async (): Promise<ApiResult> => {
  const response = await apiClient.api.getProductGetCategories()
  return response.data
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
    
    if (!response.data?.data) {
      return []
    }
    
    return response.data.data
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

/**
 * Get related products
 */
export const getRelatedProducts = async (
  productId: number,
  limit?: number
): Promise<ProductResponse[]> => {
  try {
    // Note: The API endpoint expects both productId (number) and id (string)
    const response = await apiClient.api.getProductGetRelatedProducts(
      productId,
      String(productId)
    )
    
    // The endpoint returns ApiResult, extract data from it
    // Adjust based on actual API response structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const data = (response.data as any).data
      if (Array.isArray(data)) {
        return data
      }
    }
    
    return []
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

/**
 * Get product reviews
 */
export const getProductReviews = async (
  productId: number
): Promise<ApiResult> => {
  const response = await apiClient.api.getProductGetProductReviews(
    String(productId),
    { productId }
  )
  return response.data
}

