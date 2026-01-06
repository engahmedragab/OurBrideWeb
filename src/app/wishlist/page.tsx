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
  WishlistServiceCard,
  WishlistProductCard,
  WishlistProviderCard,
} from '@/components/ui'
import { RefreshCw } from 'lucide-react'
import type { Service } from '@/types/service'
import type { Product } from '@/types/product'
import { useWishlists, useDeleteWishlist, useAddProductToCart, useCartItems } from '@/hooks'
import { useToggleServiceWishlist } from '@/hooks/services/useServiceInteractions'
import { useToggleProductWishlist } from '@/hooks/products/useProductInteractions'
import { useToggleProviderFavorite } from '@/hooks/providers/useProviderInteractions'
import type { WishlistResponse, ProductResponse, ServiceResponse, FeaturedProviderResponse } from '@/types/responses'
import { Source } from '@/../client/common/api/gen/ourbride-api'
import { mapProductResponseToProduct } from '@/types/api/product.api.types'
import { mapServiceResponseToService } from '@/utils/services-category.utils'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

export default function WishlistPage() {
  const [wishlistType, setWishlistType] = useState<'services' | 'products'>('services')
  const [selectedSource, setSelectedSource] = useState<Source | 'all'>('all')

  // Fetch wishlists using WishlistResponse from API
  const {
    data: wishlistsData,
    isLoading: isLoadingWishlists,
    error: wishlistsError,
    isFetching,
    dataUpdatedAt,
    refetch: refetchWishlists,
  } = useWishlists({
    enabled: true,
    page: 1,
    pageSize: 100,
  })

  // Delete wishlist mutation
  const deleteWishlistMutation = useDeleteWishlist()

  // Toggle wishlist mutations
  const toggleServiceWishlistMutation = useToggleServiceWishlist()
  const toggleProductWishlistMutation = useToggleProductWishlist()
  const toggleProviderFavoriteMutation = useToggleProviderFavorite()

  // Extract wishlists from response (direct array, not paginated)
  const wishlists = useMemo(() => {
    return wishlistsData || []
  }, [wishlistsData])

  // Filter wishlists by type (services or products) and source
  const filteredWishlists = useMemo(() => {
    if (!wishlists.length) {
      return []
    }

    return wishlists.filter((wishlist: WishlistResponse) => {
      // First filter by source if selected
      if (selectedSource !== 'all' && wishlist.source !== selectedSource) {
        return false
      }

      // If source filter is 'all', show all wishlists (since we don't have item details)
      if (selectedSource === 'all') {
        return true
      }

      // Then filter by type (services or products) for backward compatibility
      const type = wishlist.wishlistType || wishlist.type || ''
      const category = wishlist.category || ''

      if (wishlistType === 'services') {
        // Filter for service-related wishlists
        // Check source first, then fallback to type/category
        return (
          wishlist.source === Source.Service ||
          type.toLowerCase().includes('service') ||
          category.toLowerCase().includes('service') ||
          wishlist.itemCount > 0 // If it has items, include it
        )
      } else {
        // Filter for product-related wishlists
        // Check source first, then fallback to type/category
        return (
          wishlist.source === Source.Product ||
          type.toLowerCase().includes('product') ||
          category.toLowerCase().includes('product') ||
          wishlist.itemCount > 0 // If it has items, include it
        )
      }
    })
  }, [wishlists, wishlistType, selectedSource])

  // Extract all services and products from sourceObject (regardless of wishlistType filter)
  const allWishlistServices: Service[] = useMemo(() => {
    return filteredWishlists
      .filter((wishlist) => {
        return (
          wishlist.source === Source.Service &&
          wishlist.sourceObject &&
          'serviceStatus' in wishlist.sourceObject
        )
      })
      .map((wishlist) => {
        const serviceResponse = wishlist.sourceObject as ServiceResponse
        try {
          return mapServiceResponseToService(serviceResponse)
        } catch (error) {
          return null
        }
      })
      .filter((service): service is Service => service !== null)
  }, [filteredWishlists])

  const allWishlistProducts: Product[] = useMemo(() => {
    return filteredWishlists
      .filter((wishlist) => {
        return (
          wishlist.source === Source.Product &&
          wishlist.sourceObject &&
          'productId' in wishlist.sourceObject
        )
      })
      .map((wishlist) => {
        const productResponse = wishlist.sourceObject as ProductResponse
        try {
          return mapProductResponseToProduct(productResponse)
        } catch (error) {
          return null
        }
      })
      .filter((product): product is Product => product !== null)
  }, [filteredWishlists])

  const allWishlistProviders: FeaturedProviderResponse[] = useMemo(() => {
    return filteredWishlists
      .filter((wishlist) => {
        return (
          wishlist.source === Source.Provider &&
          wishlist.sourceObject &&
          'id' in wishlist.sourceObject &&
          'nameEn' in wishlist.sourceObject
        )
      })
      .map((wishlist) => {
        return wishlist.sourceObject as FeaturedProviderResponse
      })
      .filter((provider): provider is FeaturedProviderResponse => provider !== null && provider !== undefined)
  }, [filteredWishlists])

  // Filter by wishlistType for display
  const wishlistServices = useMemo(() => {
    return wishlistType === 'services' ? allWishlistServices : []
  }, [allWishlistServices, wishlistType])

  const wishlistProducts = useMemo(() => {
    return wishlistType === 'products' ? allWishlistProducts : []
  }, [allWishlistProducts, wishlistType])

  const hasServices = allWishlistServices.length > 0
  const hasProducts = allWishlistProducts.length > 0
  const hasProviders = allWishlistProviders.length > 0
  const hasWishlistItems = hasServices || hasProducts || hasProviders
  const hasWishlists = filteredWishlists.length > 0

  const handleServiceWishlistToggle = async (serviceId: string) => {
    // Toggle wishlist for the service
    try {
      const serviceIdNum = parseInt(serviceId, 10)
      if (!isNaN(serviceIdNum)) {
        await toggleServiceWishlistMutation.mutateAsync(serviceIdNum)
      }
    } catch (error) {
      // Handle error silently
    }
  }

  const handleProductWishlistToggle = async (productId: string) => {
    // Toggle wishlist for the product
    try {
      const productIdNum = parseInt(productId, 10)
      if (!isNaN(productIdNum)) {
        // Find product to get providerId if available
        const product = allWishlistProducts.find(p => p.id === productId)
        const providerId = product?.provider?.id ? parseInt(product.provider.id, 10) : undefined

        await toggleProductWishlistMutation.mutateAsync({
          productId: productIdNum,
          query: providerId ? { providerId } : undefined,
        })
      }
    } catch (error) {
      // Handle error silently
    }
  }

  const handleProviderWishlistToggle = async (providerId: number) => {
    // Toggle favorite for the provider (providers in wishlist are typically favorites)
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
    // Find the product from wishlistProducts
    const product = wishlistProducts.find(p => p.id === productId)
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

  // Calculate total items from wishlists
  // NOTE: This hook must be called before any conditional returns to follow Rules of Hooks
  const totalItems = useMemo(() => {
    return filteredWishlists.reduce((sum, wishlist) => sum + (wishlist.itemCount || 0), 0)
  }, [filteredWishlists])

  // Source filter options - common sources for wishlists
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

  const handleRefresh = () => {
    refetchWishlists()
  }

  const headerRightContent = (
    <div className="flex items-center gap-2">
     
     
     
     
    </div>
  )

  // Show loading state
  if (isLoadingWishlists) {
    return (
      <UserPageLayout>
        <PageHeader
          title="Wishlist"
          rightContent={headerRightContent}
        />
        <LoadingOverlay
          open={true}
          title="Loading wishlists..."
          subtitle="Please wait a moment"
        />
      </UserPageLayout>
    )
  }

  // Show error state
  if (wishlistsError) {
    return (
      <UserPageLayout>
        <PageHeader
          title="Wishlist"
          rightContent={headerRightContent}
        />
        <ErrorDisplay
          title="Error loading wishlists"
          message="Please try again later"
          actionLabel="Back to Home"
          actionHref="/"
        />
      </UserPageLayout>
    )
  }

  return (
    <UserPageLayout>
    {/* ✅ Header Area */}
    <div className="flex flex-col gap-2 mt-5">
      {/* Title (left) + Filter (right) - works on mobile */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        {/* Left: PageHeader */}
        <div className="min-w-0 flex-1">
          <PageHeader
            title="Wishlist"
            subtitle={
              hasWishlistItems || hasWishlists
                ? `${totalItems > 0 ? totalItems : filteredWishlists.length} ${
                    totalItems === 1 ? 'Item' : 'Items'
                  }`
                : undefined
            }
            rightContent={null}
          />
        </div>
  
        {/* Right: Filter (always sticks to the end) */}
        <div className="ml-auto flex items-center justify-end gap-2 shrink-0">
          {headerRightContent}
  
          <ServicesProductsFilter
            className="bg-transparent border-none !text-brand-500 hover:bg-transparent hover:border-none hover:text-brand-500"
            value={wishlistType}
            onChange={setWishlistType}
          />
        </div>
      </div>
  
      {/* Refresh + Source filter row (right aligned on all screens) */}
      <div className="flex flex-wrap justify-end items-center gap-2 my-2 w-full">
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isFetching || isLoadingWishlists}
          className="h-9 w-9 shrink-0"
          aria-label="Refresh wishlists"
          title="Refresh wishlists"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching || isLoadingWishlists ? 'animate-spin' : ''}`} />
        </Button>
  
        <SelectPopover
          value={selectedSource}
          onChange={(value) => setSelectedSource(value as Source | 'all')}
          options={sourceOptions}
          placeholder="Filter by source"
          className="md:w-40 w-28 shrink-0"
        />
      </div>
    </div>
  
    {/* Content Area */}
    {hasWishlistItems ? (
      <div className="space-y-0">
        {allWishlistServices.map((service) => (
          <WishlistServiceCard
            key={service.id}
            service={service}
            onRemove={handleServiceWishlistToggle}
            onBookNow={handleBookNow}
          />
        ))}
  
        {allWishlistProducts.map((product) => (
          <WishlistProductCard
            key={product.id}
            product={product}
            onRemove={handleProductWishlistToggle}
            onBuyNow={handleAddToCart}
          />
        ))}
  
        {allWishlistProviders.map((provider) => (
          <WishlistProviderCard
            key={provider.id}
            provider={provider}
            onRemove={handleProviderWishlistToggle}
          />
        ))}
      </div>
    ) : hasWishlists ? (
      <div className="space-y-4">
        {/* ... */}
      </div>
    ) : (
      <EmptyState
        illustration={orderEmptySvg}
        title="You don't have any items in your wishlist"
        description="Start exploring services and products to begin your journey"
        actionLabel="Start Shopping"
        actionHref="/products"
      />
    )}
  
    <LoadingOverlay
      open={
        deleteWishlistMutation.isPending ||
        toggleServiceWishlistMutation.isPending ||
        toggleProductWishlistMutation.isPending ||
        toggleProviderFavoriteMutation.isPending
      }
      title="Updating wishlist..."
      subtitle="Please wait a moment"
    />
  </UserPageLayout>
  
  )
}

