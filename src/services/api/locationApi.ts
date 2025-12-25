// Location API service functions

import { apiClient } from '@/services/api/apiClient'
import type { Country, City, Region } from '@/../client/common/api/gen/ourbride-api'

/**
 * Get all countries
 */
export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await apiClient.api.getLocationGetCountries()
    const responseAny = response as unknown
    // Handle different response structures
    if (Array.isArray(responseAny)) {
      return responseAny as Country[]
    }
    if (responseAny?.data) {
      return Array.isArray(responseAny.data.data) ? responseAny.data.data : responseAny.data.data.items || []
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch countries')
  }
}

/**
 * Get all cities
 */
export const getCities = async (): Promise<City[]> => {
  try {
    const response = await apiClient.api.getLocationGetCities()
    const responseAny = response as unknown
    // Handle different response structures
    if (Array.isArray(responseAny)) {
      return responseAny as City[]
    }
    if (responseAny?.data) {
      return Array.isArray(responseAny.data.data) ? responseAny.data.data : responseAny.data.data.items || []
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch cities')
  }
}

/**
 * Get cities by country ID
 */
export const getCitiesByCountry = async (countryId: number): Promise<City[]> => {
  try {
    const response = await apiClient.api.getLocationGetCitiesByCountry(countryId)
    const responseAny = response as unknown
    // Handle different response structures
    if (Array.isArray(responseAny)) {
      return responseAny as City[]
    }
    if (responseAny?.data) {
      return Array.isArray(responseAny.data.data) ? responseAny.data.data : responseAny.data.data.items || []
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch cities')
  }
}

/**
 * Get all regions
 */
export const getRegions = async (): Promise<Region[]> => {
  try {
    const response = await apiClient.api.getLocationGetRegions()
    const responseAny = response as unknown
    // Handle different response structures
    if (Array.isArray(responseAny)) {
      return responseAny as Region[]
    }
    if (responseAny?.data) {
      return Array.isArray(responseAny.data.data) ? responseAny.data.data : responseAny.data.data.items || []
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch regions')
  }
}

/**
 * Get regions by city ID
 */
export const getRegionsByCity = async (cityId: number): Promise<Region[]> => {
  try {
    const response = await apiClient.api.getLocationGetRegionsByCity(cityId)
    const responseAny = response as unknown
    // Handle different response structures
    if (Array.isArray(responseAny)) {
      return responseAny as Region[]
    }
    if (responseAny?.data) {
      return Array.isArray(responseAny.data.data) ? responseAny.data.data : responseAny.data.data.items || []
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch regions')
  }
}

