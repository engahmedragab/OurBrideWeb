import { useMemo } from 'react'
import { useFollows } from './useFollow'
import type { FollowResponse } from '@/types/responses'
import { Source } from '@/../client/common/api/gen/ourbride-api'

/**
 * Hook to check if items are being followed
 * Returns helper functions to check follow status
 * 
 * Note: This hook fetches all follows and extracts product/service/provider IDs
 * from the sourceId field. Since the API doesn't expose follow items directly,
 * we rely on the sourceId matching the product/service/provider ID.
 */
export const useFollowItems = (enabled = true) => {
  const { data: followsData } = useFollows({
    enabled,
    page: 1,
    pageSize: 1000, // Fetch a large number to get all follows
  })

  // Extract all follows from response (direct array, not paginated)
  const follows = useMemo(() => {
    return followsData || []
  }, [followsData])

  // Extract product IDs from follows
  const productIds = useMemo(() => {
    return new Set<number>(
      follows
        .filter((follow: FollowResponse) => follow.source === Source.Product)
        .map((follow: FollowResponse) => follow.sourceId)
    )
  }, [follows])

  // Extract service IDs from follows
  const serviceIds = useMemo(() => {
    return new Set<number>(
      follows
        .filter((follow: FollowResponse) => follow.source === Source.Service)
        .map((follow: FollowResponse) => follow.sourceId)
    )
  }, [follows])

  // Extract provider IDs from follows
  const providerIds = useMemo(() => {
    return new Set<number>(
      follows
        .filter((follow: FollowResponse) => follow.source === Source.Provider)
        .map((follow: FollowResponse) => follow.sourceId)
    )
  }, [follows])

  /**
   * Check if a product is being followed
   */
  const isProductFollowed = useMemo(() => {
    return (productId: number): boolean => {
      return productIds.has(productId)
    }
  }, [productIds])

  /**
   * Check if a service is being followed
   */
  const isServiceFollowed = useMemo(() => {
    return (serviceId: number): boolean => {
      return serviceIds.has(serviceId)
    }
  }, [serviceIds])

  /**
   * Check if a provider is being followed
   */
  const isProviderFollowed = useMemo(() => {
    return (providerId: number): boolean => {
      return providerIds.has(providerId)
    }
  }, [providerIds])

  return {
    isProductFollowed,
    isServiceFollowed,
    isProviderFollowed,
    isLoading: !followsData,
    follows,
  }
}

