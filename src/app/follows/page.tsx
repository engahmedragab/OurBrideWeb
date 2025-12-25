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
import { useFollows, useDeleteFollow, useAddProductToCart } from '@/Hooks'
import type { FollowResponse } from '@/types/responses'
import { Source } from '@/../client/common/api/gen/ourbride-api'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

export default function FollowsPage() {
  const [followType, setFollowType] = useState<'services' | 'products'>('services')
  const [selectedSource, setSelectedSource] = useState<Source | 'all'>('all')

  // Fetch follows using FollowResponse from API
  const {
    data: followsData,
    isLoading: isLoadingFollows,
    error: followsError,
  } = useFollows({
    enabled: true,
    page: 1,
    pageSize: 100,
    source: selectedSource !== 'all' ? selectedSource : undefined,
  })

  // Delete follow mutation
  const deleteFollowMutation = useDeleteFollow()

  // Extract follows from paginated response
  const follows = useMemo(() => {
    return followsData?.items || []
  }, [followsData])

  // Filter follows by type (services or products) and source
  const filteredFollows = useMemo(() => {
    if (!follows.length) return []

    return follows.filter((follow: FollowResponse) => {
      // First filter by source if selected
      if (selectedSource !== 'all' && follow.source !== selectedSource) {
        return false
      }

      // Then filter by type (services or products) for backward compatibility
      const type = follow.followType || follow.category || ''

      if (followType === 'services') {
        // Filter for service-related follows
        // Check source first, then fallback to type/category
        return (
          follow.source === Source.Service ||
          type.toLowerCase().includes('service') ||
          (follow.interactionCount > 0 && selectedSource === 'all') // If it has interactions and no source filter, assume it might have services
        )
      } else {
        // Filter for product-related follows
        // Check source first, then fallback to type/category
        return (
          follow.source === Source.Product ||
          type.toLowerCase().includes('product') ||
          (follow.interactionCount > 0 && selectedSource === 'all') // If it has interactions and no source filter, assume it might have products
        )
      }
    })
  }, [follows, followType, selectedSource])

  // For now, since FollowResponse doesn't contain items array,
  // we'll use empty arrays for services and products
  // TODO: Implement follow items API or extend FollowResponse to include items
  const followServices: Service[] = []
  const followProducts: Product[] = []

  const hasServices = followServices.length > 0
  const hasProducts = followProducts.length > 0
  const hasFollowItems =
    (followType === 'services' && hasServices) ||
    (followType === 'products' && hasProducts)
  const hasFollows = filteredFollows.length > 0

  const handleServiceFollowToggle = async (serviceId: string) => {
    // TODO: Find the follow containing this service and remove it
    // For now, this would require follow items API
    try {
      // Find follow by service ID (would need follow items API)
      // await deleteFollowMutation.mutateAsync({ id: followId })
      console.log('Remove service from follows:', serviceId)
    } catch (error) {
      console.error('Failed to remove service from follows:', error)
    }
  }

  const handleProductFollowToggle = async (productId: string) => {
    // TODO: Find the follow containing this product and remove it
    // For now, this would require follow items API
    try {
      // Find follow by product ID (would need follow items API)
      // await deleteFollowMutation.mutateAsync({ id: followId })
      console.log('Remove product from follows:', productId)
    } catch (error) {
      console.error('Failed to remove product from follows:', error)
    }
  }

  const handleBookNow = (_serviceId: string) => {
    // TODO: Implement book now
  }

  const { handleAddToCart: addToCart } = useAddProductToCart()

  const handleAddToCart = async (productId: string) => {
    // Find the product from followProducts
    const product = followProducts.find(p => p.id === productId)
    if (!product) return

    try {
      await addToCart(product, 1)
      // Optionally show success message
    } catch (error) {
      console.error('Failed to add product to cart:', error)
    }
  }

  // Calculate total items from follows
  // NOTE: This hook must be called before any conditional returns to follow Rules of Hooks
  const totalItems = useMemo(() => {
    return filteredFollows.reduce((sum, follow) => sum + (follow.interactionCount || 0), 0)
  }, [filteredFollows])

  // Source filter options - common sources for follows
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
      <ServicesProductsFilter value={followType} onChange={setFollowType} />
    </div>
  )

  // Show loading state
  if (isLoadingFollows) {
    return (
      <UserPageLayout>
        <PageHeader
          title="Follows"
          rightContent={headerRightContent}
        />
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
        <PageHeader
          title="Follows"
          rightContent={headerRightContent}
        />
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
      {followType === 'services' && hasServices ? (
        <ServiceGrid
          services={followServices}
          onWishlistToggle={handleServiceFollowToggle}
          onBookNow={handleBookNow}
          columns={3}
        />
      ) : followType === 'products' && hasProducts ? (
        <ProductGrid
          products={followProducts}
          onWishlistToggle={handleProductFollowToggle}
          onAddToCart={handleAddToCart}
          columns={3}
        />
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
        open={deleteFollowMutation.isPending}
        title="Updating follows..."
        subtitle="Please wait a moment"
      />
    </UserPageLayout>
  )
}
