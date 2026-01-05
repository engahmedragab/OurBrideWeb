import { useMemo } from 'react'
import { useFavorites } from './useFavorite'
import type { FavoriteResponse } from '@/types/responses'
import { Source } from '@/../client/common/api/gen/ourbride-api'

/**
 * Hook to check if items are in favorites
 * Returns helper functions to check favorite status
 *
 * Note: This hook fetches all favorites and extracts product/service/provider IDs
 * from the sourceId field. Since the API doesn't expose favorite items directly,
 * we rely on the sourceId matching the product/service/provider ID.
 */
export const useFavoriteItems = (enabled = true) => {
  const { data: favoritesData } = useFavorites({
    enabled,
    page: 1,
    pageSize: 1000, // Fetch a large number to get all favorites
  })

  // Extract all favorites from response (PaginatedList has items property)
  const favorites = useMemo(() => {
    if (!favoritesData) return []
    // Handle both array and PaginatedList types
    return Array.isArray(favoritesData)
      ? favoritesData
      : favoritesData.items || []
  }, [favoritesData])

  // Extract product IDs from favorites
  const productIds = useMemo(() => {
    return new Set<number>(
      favorites
        .filter(
          (favorite: FavoriteResponse) => favorite.source === Source.Product
        )
        .map((favorite: FavoriteResponse) => favorite.sourceId)
    )
  }, [favorites])

  // Extract service IDs from favorites
  const serviceIds = useMemo(() => {
    return new Set<number>(
      favorites
        .filter(
          (favorite: FavoriteResponse) => favorite.source === Source.Service
        )
        .map((favorite: FavoriteResponse) => favorite.sourceId)
    )
  }, [favorites])

  // Extract provider IDs from favorites
  const providerIds = useMemo(() => {
    return new Set<number>(
      favorites
        .filter(
          (favorite: FavoriteResponse) => favorite.source === Source.Provider
        )
        .map((favorite: FavoriteResponse) => favorite.sourceId)
    )
  }, [favorites])

  /**
   * Check if a product is in any favorite
   */
  const isProductInFavorite = useMemo(() => {
    return (productId: number): boolean => {
      return productIds.has(productId)
    }
  }, [productIds])

  /**
   * Check if a service is in any favorite
   */
  const isServiceInFavorite = useMemo(() => {
    return (serviceId: number): boolean => {
      return serviceIds.has(serviceId)
    }
  }, [serviceIds])

  /**
   * Check if a provider is in any favorite
   */
  const isProviderInFavorite = useMemo(() => {
    return (providerId: number): boolean => {
      return providerIds.has(providerId)
    }
  }, [providerIds])

  return {
    isProductInFavorite,
    isServiceInFavorite,
    isProviderInFavorite,
    isLoading: !favoritesData,
    favorites,
  }
}
