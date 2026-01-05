'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { UserPageLayout } from '@/components/layout'
import {
  EmptyState,
  ServiceGrid,
  ProductGrid,
  ServicesProductsFilter,
  PageHeader,
  ErrorDisplay,
  LoadingOverlay,
  SelectPopover,
  Button,
} from '@/components/ui'
import { RefreshCw } from 'lucide-react'
import type { Service } from '@/types/service'
import type { Product } from '@/types/product'
import {
  useFollows,
  useDeleteFollow,
  useAddProductToCart,
  useCartItems,
} from '@/hooks'
import type {
  FollowResponse,
  ProductResponse,
  ServiceResponse,
  FeaturedProviderResponse,
} from '@/types/responses'
import { Source } from '@/../client/common/api/gen/ourbride-api'
import { mapProductResponseToProduct } from '@/types/api/product.api.types'
import { mapServiceResponseToService } from '@/utils/services-category.utils'
import { useToggleServiceWishlist } from '@/hooks/services/useServiceInteractions'
import { useToggleProductWishlist } from '@/hooks/products/useProductInteractions'
import { useToggleProviderFollow } from '@/hooks/providers/useProviderInteractions'
import {
  WishlistServiceCard,
  WishlistProductCard,
  WishlistProviderCard,
} from '@/components/ui'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

export default function FollowsPage() {
  const [followType, setFollowType] = useState<'services' | 'products'>(
    'services'
  )
  const [selectedSource, setSelectedSource] = useState<Source | 'all'>('all')

  // Fetch follows using FollowResponse from API
  const {
    data: followsData,
    isLoading: isLoadingFollows,
    error: followsError,
    isFetching,
    refetch: refetchFollows,
  } = useFollows({
    enabled: true,
    page: 1,
    pageSize: 100,
  })

  // Delete follow mutation
  const deleteFollowMutation = useDeleteFollow()

  // Toggle mutations
  const toggleServiceWishlistMutation = useToggleServiceWishlist()
  const toggleProductWishlistMutation = useToggleProductWishlist()
  const toggleProviderFollowMutation = useToggleProviderFollow()

  // Extract follows from response (handle both array and paginated response)
  const follows: FollowResponse[] = useMemo(() => {
    if (!followsData) {
      return []
    }
    // Check if it's already an array
    if (Array.isArray(followsData)) {
      return followsData
    }
    // If it's a paginated response, extract the items array
    const followsDataAny = followsData as any
    if ('items' in followsDataAny && Array.isArray(followsDataAny.items)) {
      return followsDataAny.items
    }
    // Fallback: try to extract data array
    if ('data' in followsDataAny && Array.isArray(followsDataAny.data)) {
      return followsDataAny.data
    }
    return []
  }, [followsData])

  // Filter follows by type (services or products) and source
  const filteredFollows = useMemo(() => {
    if (!follows.length) {
      return []
    }

    return follows.filter((follow: FollowResponse) => {
      // First filter by source if selected
      if (selectedSource !== 'all' && follow.source !== selectedSource) {
        return false
      }

      // If source filter is 'all', show all follows that have sourceObject
      if (selectedSource === 'all') {
        // Show all follows that have sourceObject (services, products, providers)
        return !!follow.sourceObject
      }

      // When a specific source is selected, show that source
      // Providers are always shown when source is Provider
      if (follow.source === Source.Provider) {
        return true
      }

      // Then filter by type (services or products) for backward compatibility
      const type = follow.followType || follow.category || ''

      if (followType === 'services') {
        // Filter for service-related follows
        // Check source first, then fallback to type/category
        return (
          follow.source === Source.Service ||
          type.toLowerCase().includes('service') ||
          follow.interactionCount > 0 // If it has interactions, include it
        )
      } else {
        // Filter for product-related follows
        // Check source first, then fallback to type/category
        return (
          follow.source === Source.Product ||
          type.toLowerCase().includes('product') ||
          follow.interactionCount > 0 // If it has interactions, include it
        )
      }
    })
  }, [follows, followType, selectedSource])

  // Extract all services, products, and providers from sourceObject
  const allFollowServices: Service[] = useMemo(() => {
    return filteredFollows
      .filter(follow => {
        return (
          follow.source === Source.Service &&
          follow.sourceObject &&
          'serviceStatus' in follow.sourceObject
        )
      })
      .map(follow => {
        const serviceResponse = follow.sourceObject as ServiceResponse
        try {
          return mapServiceResponseToService(serviceResponse)
        } catch (error) {
          return null
        }
      })
      .filter((service): service is Service => service !== null)
  }, [filteredFollows])

  const allFollowProducts: Product[] = useMemo(() => {
    return filteredFollows
      .filter(follow => {
        return (
          follow.source === Source.Product &&
          follow.sourceObject &&
          'productId' in follow.sourceObject
        )
      })
      .map(follow => {
        const productResponse = follow.sourceObject as ProductResponse
        try {
          return mapProductResponseToProduct(productResponse)
        } catch (error) {
          return null
        }
      })
      .filter((product): product is Product => product !== null)
  }, [filteredFollows])

  const allFollowProviders: FeaturedProviderResponse[] = useMemo(() => {
    return filteredFollows
      .filter(follow => {
        return (
          follow.source === Source.Provider &&
          follow.sourceObject &&
          typeof follow.sourceObject === 'object' &&
          'id' in follow.sourceObject &&
          ('nameEn' in follow.sourceObject || 'nameAr' in follow.sourceObject)
        )
      })
      .map(follow => {
        // Map the sourceObject to FeaturedProviderResponse format
        const sourceObj = follow.sourceObject as any
        const profileImage = sourceObj.profileURL || sourceObj.image || ''

        return {
          id: sourceObj.id,
          nameEn: sourceObj.nameEn || sourceObj.name || '',
          nameAr: sourceObj.nameAr || sourceObj.name || '',
          descriptionEn: sourceObj.descriptionEn || sourceObj.description || '',
          descriptionAr: sourceObj.descriptionAr || sourceObj.description || '',
          publicLogoImageUrl: profileImage,
          publicBannerImageUrl: profileImage,
          rate: sourceObj.rate ?? null,
          totalReviews: sourceObj.reviews?.length || 0,
          isVerified: sourceObj.isVerified || false,
          totalServices: sourceObj.servicesCount || 0,
          totalProducts: sourceObj.productsCount || 0,
          shortAddress: sourceObj.shortAddress || sourceObj.address || '',
          publicProfileSlug:
            sourceObj.publicProfileSlug || `/providers/${sourceObj.id}`,
          uniqueCode: sourceObj.uniqueCode || `PROV-${sourceObj.id}`,
          topRatedService: sourceObj.topRatedService || null,
        } as FeaturedProviderResponse
      })
      .filter(
        (provider): provider is FeaturedProviderResponse =>
          provider !== null &&
          provider !== undefined &&
          provider.id !== undefined &&
          provider.id !== null
      )
  }, [filteredFollows])

  const hasServices = allFollowServices.length > 0
  const hasProducts = allFollowProducts.length > 0
  const hasProviders = allFollowProviders.length > 0
  const hasFollowItems = hasServices || hasProducts || hasProviders
  const hasFollows = filteredFollows.length > 0

  const handleServiceFollowToggle = async (serviceId: string) => {
    // Toggle follow for the service (services are typically followed via wishlist toggle)
    try {
      const serviceIdNum = parseInt(serviceId, 10)
      if (!isNaN(serviceIdNum)) {
        await toggleServiceWishlistMutation.mutateAsync(serviceIdNum)
      }
    } catch (error) {
      // Handle error silently
    }
  }

  const handleProductFollowToggle = async (productId: string) => {
    // Toggle follow for the product (products are typically followed via wishlist toggle)
    try {
      const productIdNum = parseInt(productId, 10)
      if (!isNaN(productIdNum)) {
        const product = allFollowProducts.find(p => p.id === productId)
        const providerId = product?.provider?.id
          ? parseInt(product.provider.id, 10)
          : undefined

        await toggleProductWishlistMutation.mutateAsync({
          productId: productIdNum,
          query: providerId ? { providerId } : undefined,
        })
      }
    } catch (error) {
      // Handle error silently
    }
  }

  const handleProviderFollowToggle = async (providerId: number) => {
    // Toggle follow for the provider
    try {
      await toggleProviderFollowMutation.mutateAsync(providerId)
    } catch (error) {
      // Handle error silently
    }
  }

  const router = useRouter()
  const handleBookNow = (serviceId: string) => {
    router.push(`/services/category/${serviceId}`)
  }

  const { handleAddToCart: addToCart } = useAddProductToCart()
  const { isProductInCart } = useCartItems()

  const handleAddToCart = async (productId: string) => {
    // Find the product from allFollowProducts
    const product = allFollowProducts.find(p => p.id === productId)
    if (!product) return

    try {
      // Add to cart if not already in cart
      const productIdNum = parseInt(product.id, 10)
      const providerId = product.provider?.id
        ? parseInt(product.provider.id, 10)
        : undefined
      const isInCart = isProductInCart(productIdNum, providerId)

      if (!isInCart) {
        await addToCart(product, 1)
      }
      // Navigate to cart screen
      router.push('/cart')
    } catch (error) {
      // Handle error silently
    }
  }

  const handleRefresh = () => {
    refetchFollows()
  }

  // Calculate total items from follows
  // NOTE: This hook must be called before any conditional returns to follow Rules of Hooks
  const totalItems = useMemo(() => {
    return filteredFollows.reduce(
      (sum, follow) => sum + (follow.interactionCount || 0),
      0
    )
  }, [filteredFollows])

  // Source filter options - common sources for follows
  const sourceOptions = useMemo(
    () => [
      { value: 'all', label: 'All Sources' },
      { value: Source.Product, label: 'Products' },
      { value: Source.Service, label: 'Services' },
      { value: Source.Membership, label: 'Memberships' },
      { value: Source.GiftCard, label: 'Gift Cards' },
      { value: Source.ServiceReservation, label: 'Service Reservations' },
      { value: Source.Provider, label: 'Providers' },
      { value: Source.Offer, label: 'Offers' },
      { value: Source.Preparation, label: 'Preparations' },
      { value: Source.Post, label: 'Posts' },
      { value: Source.Blog, label: 'Blogs' },
      { value: Source.Article, label: 'Articles' },
      { value: Source.Reel, label: 'Reels' },
    ],
    []
  )

  const headerRightContent = (
    <div className="flex items-center gap-2">
      <SelectPopover
        value={selectedSource}
        onChange={value => setSelectedSource(value as Source | 'all')}
        options={sourceOptions}
        placeholder="Filter by source"
        className="w-40"
      />
      <ServicesProductsFilter value={followType} onChange={setFollowType} />
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isFetching}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  )

  // Show loading state
  if (isLoadingFollows) {
    return (
      <UserPageLayout>
        <PageHeader title="Follows" rightContent={headerRightContent} />
        <LoadingOverlay
          open={true}
          title="Loading follows..."
          subtitle="Please wait a moment"
        />
      </UserPageLayout>
    )
  }

  // Show error state
  if (followsError) {
    return (
      <UserPageLayout>
        <PageHeader title="Follows" rightContent={headerRightContent} />
        <ErrorDisplay
          title="Error loading follows"
          message="Please try again later"
          actionLabel="Back to Home"
          actionHref="/"
        />
      </UserPageLayout>
    )
  }

  return (
    <UserPageLayout>
      {/* Page Header */}
      <PageHeader
        title="Follows"
        subtitle={
          hasFollowItems || hasFollows
            ? `${totalItems > 0 ? totalItems : filteredFollows.length} ${totalItems === 1 ? 'Item' : 'Items'}`
            : undefined
        }
        rightContent={headerRightContent}
      />

      {/* Content Area */}
      {hasFollowItems ? (
        <div className="space-y-0">
          {/* Show all services with sourceObject */}
          {allFollowServices.length > 0 &&
            allFollowServices.map(service => (
              <WishlistServiceCard
                key={`service-${service.id}`}
                service={service}
                onRemove={handleServiceFollowToggle}
                onBookNow={handleBookNow}
              />
            ))}

          {/* Show all products with sourceObject */}
          {allFollowProducts.length > 0 &&
            allFollowProducts.map(product => (
              <WishlistProductCard
                key={`product-${product.id}`}
                product={product}
                onRemove={handleProductFollowToggle}
                onBuyNow={handleAddToCart}
              />
            ))}

          {/* Show all providers with sourceObject */}
          {allFollowProviders.length > 0 &&
            allFollowProviders.map(provider => (
              <WishlistProviderCard
                key={`provider-${provider.id}`}
                provider={provider}
                onRemove={handleProviderFollowToggle}
              />
            ))}
        </div>
      ) : hasFollows ? (
        // Show follows list when we have follows but no items to display
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Follows ({filteredFollows.length})
            </h3>
            <div className="space-y-3">
              {filteredFollows.map((follow: FollowResponse) => (
                <div
                  key={follow.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-16 font-medium text-gray-900">
                        {follow.displayName ||
                          follow.nameEn ||
                          follow.nameAr ||
                          `Follow #${follow.id}`}
                      </h4>
                      {follow.source && (
                        <span className="text-12 px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {follow.source}
                        </span>
                      )}
                      {follow.sourceId && (
                        <span className="text-12 px-2 py-1 bg-blue-100 text-blue-600 rounded">
                          ID: {follow.sourceId}
                        </span>
                      )}
                    </div>
                    {follow.displayDescription && (
                      <p className="text-14 text-gray-600 mb-2">
                        {follow.displayDescription}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-12 text-gray-500">
                      <span>{follow.interactionCount || 0} interactions</span>
                      {follow.lastModifiedDate && (
                        <span>
                          Updated{' '}
                          {new Date(
                            follow.lastModifiedDate
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Navigate to follow detail or delete
                    }}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          illustration={orderEmptySvg}
          title="You don't have any items in your follows"
          description="Start exploring services and products to begin your journey"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      )}

      {/* Loading Overlay for Mutations */}
      <LoadingOverlay
        open={
          deleteFollowMutation.isPending ||
          toggleServiceWishlistMutation.isPending ||
          toggleProductWishlistMutation.isPending ||
          toggleProviderFollowMutation.isPending
        }
        title="Updating follows..."
        subtitle="Please wait a moment"
      />
    </UserPageLayout>
  )
}
