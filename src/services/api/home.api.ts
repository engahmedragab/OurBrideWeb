import { apiClient } from './apiClient'

/**
 * Home API endpoints
 */

/**
 * Get home page data
 * GET /api/v1/home
 * @returns Home page data including products, services, testimonials, etc.
 */
export const getHomeData = async (): Promise<unknown> => {
  try {
    const response = await apiClient.api.getHomeGetHomeData()
    // The API endpoint returns void, any, so we need to handle the response data
    // The actual data might be in response.data or directly in response
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching home data:', error)
    throw error
  }
}

/**
 * Get store home page data
 * @returns Store home page data including products, categories, offers, etc.
 */
export const getStoreHomeData = async (): Promise<unknown> => {
  try {
    const response = await apiClient.api.getHomeGetStoreHome()
    // The API endpoint returns void, any, so we need to handle the response data
    // The actual data might be in response.data or directly in response
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching store home data:', error)
    throw error
  }
}

/**
 * Get services home page data
 * @returns Services home page data including services, categories, banners, providers, hero slides, etc.
 */
export const getServicesHome = async (): Promise<unknown> => {
  try {
    const response = await apiClient.api.getHomeGetServiceHome()
    // The API endpoint returns void, any, so we need to handle the response data
    // The actual data might be in response.data or directly in response
    const responseData = response as { data?: unknown }
    return responseData.data ?? response
  } catch (error) {
    console.error('Error fetching services home data:', error)
    throw error
  }
}

