import { useMemo } from 'react'
import { useMainIds } from '@/hooks/home'
import type { FollowIdItem } from '@/types/responses'
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
  const { data: mainIds, isLoading } = useMainIds(
    {
      page: 1,
      pageSize: 1000,
    },
    enabled
  )

  // Extract all follows from response (direct array, not paginated)
  const follows = useMemo(() => {
    return mainIds?.follows || []
  }, [mainIds])

  // Extract product IDs from follows
  const productIds = useMemo(() => {
    return new Set<number>(
      follows
        .filter((follow: FollowIdItem) => String(follow.source) === Source.Product)
        .map((follow: FollowIdItem) => follow.sourceId)
    )
  }, [follows])

  // Extract service IDs from follows
  const serviceIds = useMemo(() => {
    return new Set<number>(
      follows
        .filter((follow: FollowIdItem) => String(follow.source) === Source.Service)
        .map((follow: FollowIdItem) => follow.sourceId)
    )
  }, [follows])

  // Extract provider IDs from follows
  const providerIds = useMemo(() => {
    return new Set<number>(
      follows
        .filter((follow: FollowIdItem) => String(follow.source) === Source.Provider)
        .map((follow: FollowIdItem) => follow.sourceId)
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
    isLoading,
    follows,
  }
}

