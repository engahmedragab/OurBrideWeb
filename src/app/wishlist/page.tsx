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
} from '@/components/ui'
import type { Service } from '@/types/service'
import type { Product } from '@/types/product'
import { useWishlists, useDeleteWishlist } from '@/Hooks'
import type { WishlistResponse } from '@/types/responses'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

export default function WishlistPage() {
  const [wishlistType, setWishlistType] = useState<'services' | 'products'>('services')

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

  // Filter wishlists by type (services or products)
  // Note: WishlistResponse doesn't contain items array, so we filter by wishlistType field
  const filteredWishlists = useMemo(() => {
    if (!wishlists.length) return []

    // Filter wishlists based on type field or category
    // Since WishlistResponse doesn't have items, we'll work with wishlist metadata
    return wishlists.filter((wishlist: WishlistResponse) => {
      const type = wishlist.wishlistType || wishlist.type || ''
      const category = wishlist.category || ''

      if (wishlistType === 'services') {
        // Filter for service-related wishlists
        return (
          type.toLowerCase().includes('service') ||
          category.toLowerCase().includes('service') ||
          wishlist.itemCount > 0 // If it has items, assume it might have services
        )
      } else {
        // Filter for product-related wishlists
        return (
          type.toLowerCase().includes('product') ||
          category.toLowerCase().includes('product') ||
          wishlist.itemCount > 0 // If it has items, assume it might have products
        )
      }
    })
  }, [wishlists, wishlistType])

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

  const handleAddToCart = (_productId: string) => {
    // TODO: Implement add to cart
  }

  // Calculate total items from wishlists
  // NOTE: This hook must be called before any conditional returns to follow Rules of Hooks
  const totalItems = useMemo(() => {
    return filteredWishlists.reduce((sum, wishlist) => sum + (wishlist.itemCount || 0), 0)
  }, [filteredWishlists])

  // Show loading state
  if (isLoadingWishlists) {
    return (
      <UserPageLayout>
        <PageHeader
          title="Wishlist"
          rightContent={
            <ServicesProductsFilter value={wishlistType} onChange={setWishlistType} />
          }
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
          rightContent={
            <ServicesProductsFilter value={wishlistType} onChange={setWishlistType} />
          }
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
        rightContent={
          <ServicesProductsFilter value={wishlistType} onChange={setWishlistType} />
        }
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

