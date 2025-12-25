'use client'

import { useState, useMemo } from 'react'
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
} from '@/components/ui'
import type { Service } from '@/types/service'
import type { Product } from '@/types/product'
import { useWishlists, useDeleteWishlist, useAddProductToCart } from '@/hooks'
import type { WishlistResponse } from '@/types/responses'
import { Source } from '@/../client/common/api/gen/ourbride-api'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

export default function WishlistPage() {
  const [wishlistType, setWishlistType] = useState<'services' | 'products'>('services')
  const [selectedSource, setSelectedSource] = useState<Source | 'all'>('all')

  // Fetch wishlists using WishlistResponse from API
  const {
    data: wishlistsData,
    isLoading: isLoadingWishlists,
    error: wishlistsError,
  } = useWishlists({
    enabled: true,
    page: 1,
    pageSize: 100,
  })

  // Delete wishlist mutation
  const deleteWishlistMutation = useDeleteWishlist()

  // Extract wishlists from paginated response
  const wishlists = useMemo(() => {
    return wishlistsData?.items || []
  }, [wishlistsData])

  // Filter wishlists by type (services or products) and source
  const filteredWishlists = useMemo(() => {
    if (!wishlists.length) return []

    return wishlists.filter((wishlist: WishlistResponse) => {
      // First filter by source if selected
      if (selectedSource !== 'all' && wishlist.source !== selectedSource) {
        return false
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
          (wishlist.itemCount > 0 && selectedSource === 'all') // If it has items and no source filter, assume it might have services
        )
      } else {
        // Filter for product-related wishlists
        // Check source first, then fallback to type/category
        return (
          wishlist.source === Source.Product ||
          type.toLowerCase().includes('product') ||
          category.toLowerCase().includes('product') ||
          (wishlist.itemCount > 0 && selectedSource === 'all') // If it has items and no source filter, assume it might have products
        )
      }
    })
  }, [wishlists, wishlistType, selectedSource])

  // For now, since WishlistResponse doesn't contain items array,
  // we'll use empty arrays for services and products
  // TODO: Implement wishlist items API or extend WishlistResponse to include items
  const wishlistServices: Service[] = []
  const wishlistProducts: Product[] = []

  const hasServices = wishlistServices.length > 0
  const hasProducts = wishlistProducts.length > 0
  const hasWishlistItems =
    (wishlistType === 'services' && hasServices) ||
    (wishlistType === 'products' && hasProducts)
  const hasWishlists = filteredWishlists.length > 0

  const handleServiceWishlistToggle = async (serviceId: string) => {
    // TODO: Find the wishlist containing this service and remove it
    // For now, this would require wishlist items API
    // Using deleteWishlist as placeholder - should be remove item from wishlist
    try {
      // Find wishlist by service ID (would need wishlist items API)
      // await deleteWishlistMutation.mutateAsync({ id: wishlistId })
      console.log('Remove service from wishlist:', serviceId)
    } catch (error) {
      console.error('Failed to remove service from wishlist:', error)
    }
  }

  const handleProductWishlistToggle = async (productId: string) => {
    // TODO: Find the wishlist containing this product and remove it
    // For now, this would require wishlist items API
    // Using deleteWishlist as placeholder - should be remove item from wishlist
    try {
      // Find wishlist by product ID (would need wishlist items API)
      // await deleteWishlistMutation.mutateAsync({ id: wishlistId })
      console.log('Remove product from wishlist:', productId)
    } catch (error) {
      console.error('Failed to remove product from wishlist:', error)
    }
  }

  const handleBookNow = (_serviceId: string) => {
    // TODO: Implement book now
  }

  const { handleAddToCart: addToCart } = useAddProductToCart()

  const handleAddToCart = async (productId: string) => {
    // Find the product from wishlistProducts
    const product = wishlistProducts.find(p => p.id === productId)
    if (!product) return

    try {
      await addToCart(product, 1)
      // Optionally show success message
    } catch (error) {
      console.error('Failed to add product to cart:', error)
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

  const headerRightContent = (
    <div className="flex items-center gap-2">
      <SelectPopover
        value={selectedSource}
        onChange={(value) => setSelectedSource(value as Source | 'all')}
        options={sourceOptions}
        placeholder="Filter by source"
        className="w-40"
      />
      <ServicesProductsFilter value={wishlistType} onChange={setWishlistType} />
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
      {/* Page Header */}
      <PageHeader
        title="Wishlist"
        subtitle={
          hasWishlistItems || hasWishlists
            ? `${totalItems > 0 ? totalItems : filteredWishlists.length} ${totalItems === 1 ? 'Item' : 'Items'}`
            : undefined
        }
        rightContent={headerRightContent}
      />

      {/* Content Area */}
      {wishlistType === 'services' && hasServices ? (
        <ServiceGrid
          services={wishlistServices}
          onWishlistToggle={handleServiceWishlistToggle}
          onBookNow={handleBookNow}
          columns={3}
        />
      ) : wishlistType === 'products' && hasProducts ? (
        <ProductGrid
          products={wishlistProducts}
          onWishlistToggle={handleProductWishlistToggle}
          onAddToCart={handleAddToCart}
          columns={3}
        />
      ) : (
        <EmptyState
          illustration={orderEmptySvg}
          title="You don't have any items in your wishlist"
          description="Start exploring services and products to begin your journey"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      )}

      {/* Loading Overlay for Mutations */}
      <LoadingOverlay
        open={deleteWishlistMutation.isPending}
        title="Updating wishlist..."
        subtitle="Please wait a moment"
      />
    </UserPageLayout>
  )
}

