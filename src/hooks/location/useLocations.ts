import { useQuery } from '@tanstack/react-query'
import {
  getCountries,
  getCities,
  getCitiesByCountry,
  getRegions,
  getRegionsByCity,
} from '@/services/api/locationApi'
import type {
  Country,
  City,
  Region,
} from '@/../client/common/api/gen/ourbride-api'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch all countries
 */
export const useCountries = (enabled: boolean = true) => {
  const authenticated = isAuthenticated()

  return useQuery<Country[]>({
    queryKey: ['locations', 'countries'],
    queryFn: async () => {
      return await getCountries()
    },
    enabled: enabled && authenticated,
    staleTime: 30 * 60 * 1000, // 30 minutes - countries don't change often
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch all cities
 */
export const useCities = (enabled: boolean = true) => {
  const authenticated = isAuthenticated()

  return useQuery<City[]>({
    queryKey: ['locations', 'cities'],
    queryFn: async () => {
      return await getCities()
    },
    enabled: enabled && authenticated,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch cities by country ID
 */
export const useCitiesByCountry = (
  countryId: number | null,
  enabled: boolean = true
) => {
  const authenticated = isAuthenticated()

  return useQuery<City[]>({
    queryKey: ['locations', 'cities', 'country', countryId],
    queryFn: async () => {
      if (!countryId) return []
      return await getCitiesByCountry(countryId)
    },
    enabled: enabled && authenticated && !!countryId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch all regions
 */
export const useRegions = (enabled: boolean = true) => {
  const authenticated = isAuthenticated()

  return useQuery<Region[]>({
    queryKey: ['locations', 'regions'],
    queryFn: async () => {
      return await getRegions()
    },
    enabled: enabled && authenticated,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch regions by city ID
 */
export const useRegionsByCity = (
  cityId: number | null,
  enabled: boolean = true
) => {
  const authenticated = isAuthenticated()

  return useQuery<Region[]>({
    queryKey: ['locations', 'regions', 'city', cityId],
    queryFn: async () => {
      if (!cityId) return []
      return await getRegionsByCity(cityId)
    },
    enabled: enabled && authenticated && !!cityId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  })
}
