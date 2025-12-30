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
import { useFavorites, useDeleteFavorite, useAddProductToCart, useCartItems } from '@/hooks'
import type { FavoriteResponse, ProductResponse, ServiceResponse, FeaturedProviderResponse } from '@/types/responses'
import { Source } from '@/../client/common/api/gen/ourbride-api'
import { mapProductResponseToProduct } from '@/types/api/product.api.types'
import { mapServiceResponseToService } from '@/utils/services-category.utils'
import { useToggleServiceFavorite } from '@/hooks/services/useServiceInteractions'
import { useToggleProductFavorite } from '@/hooks/products/useProductInteractions'
import { useToggleProviderFavorite } from '@/hooks/providers/useProviderInteractions'
import { WishlistServiceCard, WishlistProductCard, WishlistProviderCard } from '@/components/ui'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

export default function FavoritesPage() {
  const [favoriteType, setFavoriteType] = useState<'services' | 'products'>('services')
  const [selectedSource, setSelectedSource] = useState<Source | 'all'>('all')

  // Fetch favorites using FavoriteResponse from API
  const {
    data: favoritesData,
    isLoading: isLoadingFavorites,
    error: favoritesError,
    isFetching,
    refetch: refetchFavorites,
  } = useFavorites({
    enabled: true,
    page: 1,
    pageSize: 100,
  })

  // Delete favorite mutation
  const deleteFavoriteMutation = useDeleteFavorite()

  // Toggle mutations
  const toggleServiceFavoriteMutation = useToggleServiceFavorite()
  const toggleProductFavoriteMutation = useToggleProductFavorite()
  const toggleProviderFavoriteMutation = useToggleProviderFavorite()

  // Extract favorites from response (handle both array and paginated response)
  const favorites: FavoriteResponse[] = useMemo(() => {
    if (!favoritesData) return []
    // Check if it's already an array
    if (Array.isArray(favoritesData)) {
      return favoritesData
    }
    // If it's a paginated response, extract the items array
    if ('items' in favoritesData && Array.isArray(favoritesData.items)) {
      return favoritesData.items
    }
    // Fallback: try to extract data array
    if ('data' in favoritesData && Array.isArray(favoritesData.data)) {
      return favoritesData.data
    }
    return []
  }, [favoritesData])

  // Filter favorites by type (services or products) and source
  const filteredFavorites = useMemo(() => {
    if (!favorites.length) {
      return []
    }

    return favorites.filter((favorite: FavoriteResponse) => {
      // First filter by source if selected
      if (selectedSource !== 'all' && favorite.source !== selectedSource) {
        return false
      }

      // If source filter is 'all', show all favorites that have sourceObject
      if (selectedSource === 'all') {
        // Show all favorites that have sourceObject (services, products, providers)
        return !!favorite.sourceObject
      }

      // When a specific source is selected, show that source
      // Providers are always shown when source is Provider
      if (favorite.source === Source.Provider) {
        return true
      }

      // Then filter by type (services or products) for backward compatibility
      const type = favorite.favoriteType || favorite.category || ''

      if (favoriteType === 'services') {
        // Filter for service-related favorites
        // Check source first, then fallback to type/category
        return (
          favorite.source === Source.Service ||
          type.toLowerCase().includes('service') ||
          favorite.viewCount > 0 // If it has views, include it
        )
      } else {
        // Filter for product-related favorites
        // Check source first, then fallback to type/category
        return (
          favorite.source === Source.Product ||
          type.toLowerCase().includes('product') ||
          favorite.viewCount > 0 // If it has views, include it
        )
      }
    })
  }, [favorites, favoriteType, selectedSource])

  // Extract all services, products, and providers from sourceObject
  const allFavoriteServices: Service[] = useMemo(() => {
    return filteredFavorites
      .filter((favorite) => {
        return (
          favorite.source === Source.Service &&
          favorite.sourceObject &&
          'serviceStatus' in favorite.sourceObject
        )
      })
      .map((favorite) => {
        const serviceResponse = favorite.sourceObject as ServiceResponse
        try {
          return mapServiceResponseToService(serviceResponse)
        } catch (error) {
          return null
        }
      })
      .filter((service): service is Service => service !== null)
  }, [filteredFavorites])

  const allFavoriteProducts: Product[] = useMemo(() => {
    return filteredFavorites
      .filter((favorite) => {
        return (
          favorite.source === Source.Product &&
          favorite.sourceObject &&
          'productId' in favorite.sourceObject
        )
      })
      .map((favorite) => {
        const productResponse = favorite.sourceObject as ProductResponse
        try {
          return mapProductResponseToProduct(productResponse)
        } catch (error) {
          return null
        }
      })
      .filter((product): product is Product => product !== null)
  }, [filteredFavorites])

  const allFavoriteProviders: FeaturedProviderResponse[] = useMemo(() => {
    return filteredFavorites
      .filter((favorite) => {
        return (
          favorite.source === Source.Provider &&
          favorite.sourceObject &&
          typeof favorite.sourceObject === 'object' &&
          'id' in favorite.sourceObject &&
          ('nameEn' in favorite.sourceObject || 'nameAr' in favorite.sourceObject)
        )
      })
      .map((favorite) => {
        // Map the sourceObject to FeaturedProviderResponse format
        const sourceObj = favorite.sourceObject as any
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
          publicProfileSlug: sourceObj.publicProfileSlug || `/providers/${sourceObj.id}`,
          uniqueCode: sourceObj.uniqueCode || `PROV-${sourceObj.id}`,
          topRatedService: sourceObj.topRatedService || null,
        } as FeaturedProviderResponse
      })
      .filter((provider): provider is FeaturedProviderResponse =>
        provider !== null &&
        provider !== undefined &&
        provider.id !== undefined &&
        provider.id !== null
      )
  }, [filteredFavorites])

  const hasServices = allFavoriteServices.length > 0
  const hasProducts = allFavoriteProducts.length > 0
  const hasProviders = allFavoriteProviders.length > 0
  const hasFavoriteItems = hasServices || hasProducts || hasProviders
  const hasFavorites = filteredFavorites.length > 0

  const handleServiceFavoriteToggle = async (serviceId: string) => {
    // Toggle favorite for the service
    try {
      const serviceIdNum = parseInt(serviceId, 10)
      if (!isNaN(serviceIdNum)) {
        await toggleServiceFavoriteMutation.mutateAsync(serviceIdNum)
      }
    } catch (error) {
      // Handle error silently
    }
  }

  const handleProductFavoriteToggle = async (productId: string) => {
    // Toggle favorite for the product
    try {
      const productIdNum = parseInt(productId, 10)
      if (!isNaN(productIdNum)) {
        const product = allFavoriteProducts.find(p => p.id === productId)
        const providerId = product?.provider?.id ? parseInt(product.provider.id, 10) : undefined

        await toggleProductFavoriteMutation.mutateAsync({
          productId: productIdNum,
          query: providerId ? { providerId } : undefined,
        })
      }
    } catch (error) {
      // Handle error silently
    }
  }

  const handleProviderFavoriteToggle = async (providerId: number) => {
    // Toggle favorite for the provider
    try {
      await toggleProviderFavoriteMutation.mutateAsync(providerId)
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
    // Find the product from allFavoriteProducts
    const product = allFavoriteProducts.find(p => p.id === productId)
    if (!product) return

    try {
      // Add to cart if not already in cart
      const productIdNum = parseInt(product.id, 10)
      const providerId = product.provider?.id ? parseInt(product.provider.id, 10) : undefined
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
    refetchFavorites()
  }

  // Calculate total items from favorites
  // NOTE: This hook must be called before any conditional returns to follow Rules of Hooks
  const totalItems = useMemo(() => {
    return filteredFavorites.reduce((sum, favorite) => sum + (favorite.viewCount || 0), 0)
  }, [filteredFavorites])

  // Source filter options - common sources for favorites
  const sourceOptions = useMemo(() => [
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
  ], [])

  const headerRightContent = (
    <div className="flex items-center gap-2">
      <SelectPopover
        value={selectedSource}
        onChange={(value) => setSelectedSource(value as Source | 'all')}
        options={sourceOptions}
        placeholder="Filter by source"
        className="w-40"
      />
      <ServicesProductsFilter value={favoriteType} onChange={setFavoriteType} />
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
  if (isLoadingFavorites) {
    return (
      <UserPageLayout>
        <PageHeader
          title="Favorites"
          rightContent={headerRightContent}
        />
        <LoadingOverlay
          open={true}
          title="Loading favorites..."
          subtitle="Please wait a moment"
        />
      </UserPageLayout>
    )
  }

  // Show error state
  if (favoritesError) {
    return (
      <UserPageLayout>
        <PageHeader
          title="Favorites"
          rightContent={headerRightContent}
        />
        <ErrorDisplay
          title="Error loading favorites"
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
        title="Favorites"
        subtitle={
          hasFavoriteItems || hasFavorites
            ? `${totalItems > 0 ? totalItems : filteredFavorites.length} ${totalItems === 1 ? 'Item' : 'Items'}`
            : undefined
        }
        rightContent={headerRightContent}
      />

      {/* Content Area */}
      {hasFavoriteItems ? (
        <div className="space-y-0">
          {/* Show all services with sourceObject */}
          {allFavoriteServices.length > 0 && allFavoriteServices.map((service) => (
            <WishlistServiceCard
              key={`service-${service.id}`}
              service={service}
              onRemove={handleServiceFavoriteToggle}
              onBookNow={handleBookNow}
            />
          ))}

          {/* Show all products with sourceObject */}
          {allFavoriteProducts.length > 0 && allFavoriteProducts.map((product) => (
            <WishlistProductCard
              key={`product-${product.id}`}
              product={product}
              onRemove={handleProductFavoriteToggle}
              onBuyNow={handleAddToCart}
            />
          ))}

          {/* Show all providers with sourceObject */}
          {allFavoriteProviders.length > 0 && allFavoriteProviders.map((provider) => (
            <WishlistProviderCard
              key={`provider-${provider.id}`}
              provider={provider}
              onRemove={handleProviderFavoriteToggle}
            />
          ))}
        </div>
      ) : hasFavorites ? (
        // Show favorites list when we have favorites but no items to display
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Favorites ({filteredFavorites.length})
            </h3>
            <div className="space-y-3">
              {filteredFavorites.map((favorite: FavoriteResponse) => (
                <div
                  key={favorite.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-16 font-medium text-gray-900">
                        {favorite.displayName || favorite.nameEn || favorite.nameAr || `Favorite #${favorite.id}`}
                      </h4>
                      {favorite.source && (
                        <span className="text-12 px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {favorite.source}
                        </span>
                      )}
                      {favorite.sourceId && (
                        <span className="text-12 px-2 py-1 bg-blue-100 text-blue-600 rounded">
                          ID: {favorite.sourceId}
                        </span>
                      )}
                    </div>
                    {favorite.displayDescription && (
                      <p className="text-14 text-gray-600 mb-2">
                        {favorite.displayDescription}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-12 text-gray-500">
                      <span>{favorite.viewCount || 0} views</span>
                      {favorite.lastModifiedDate && (
                        <span>
                          Updated {new Date(favorite.lastModifiedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Navigate to favorite detail or delete
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
          title="You don't have any items in your favorites"
          description="Start exploring services and products to begin your journey"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      )}

      {/* Loading Overlay for Mutations */}
      <LoadingOverlay
        open={deleteFavoriteMutation.isPending || toggleServiceFavoriteMutation.isPending || toggleProductFavoriteMutation.isPending || toggleProviderFavoriteMutation.isPending}
        title="Updating favorites..."
        subtitle="Please wait a moment"
      />
    </UserPageLayout>
  )
}
