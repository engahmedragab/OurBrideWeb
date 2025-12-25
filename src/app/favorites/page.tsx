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
} from '@/components/ui'
import type { Service } from '@/types/service'
import type { Product } from '@/types/product'
import { useFavorites, useDeleteFavorite, useAddProductToCart } from '@/hooks'
import type { FavoriteResponse } from '@/types/responses'
import { Source } from '@/../client/common/api/gen/ourbride-api'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

export default function FavoritesPage() {
  const [favoriteType, setFavoriteType] = useState<'services' | 'products'>('services')
  const [selectedSource, setSelectedSource] = useState<Source | 'all'>('all')

  // Fetch favorites using FavoriteResponse from API
  const {
    data: favoritesData,
    isLoading: isLoadingFavorites,
    error: favoritesError,
  } = useFavorites({
    enabled: true,
    page: 1,
    pageSize: 100,
    source: selectedSource !== 'all' ? selectedSource : undefined,
  })

  // Delete favorite mutation
  const deleteFavoriteMutation = useDeleteFavorite()

  // Extract favorites from paginated response
  const favorites = useMemo(() => {
    return favoritesData?.items || []
  }, [favoritesData])

  // Filter favorites by type (services or products) and source
  const filteredFavorites = useMemo(() => {
    if (!favorites.length) return []

    return favorites.filter((favorite: FavoriteResponse) => {
      // First filter by source if selected
      if (selectedSource !== 'all' && favorite.source !== selectedSource) {
        return false
      }

      // Then filter by type (services or products) for backward compatibility
      const type = favorite.favoriteType || favorite.category || ''

      if (favoriteType === 'services') {
        // Filter for service-related favorites
        // Check source first, then fallback to type/category
        return (
          favorite.source === Source.Service ||
          type.toLowerCase().includes('service') ||
          (favorite.viewCount > 0 && selectedSource === 'all') // If it has views and no source filter, assume it might have services
        )
      } else {
        // Filter for product-related favorites
        // Check source first, then fallback to type/category
        return (
          favorite.source === Source.Product ||
          type.toLowerCase().includes('product') ||
          (favorite.viewCount > 0 && selectedSource === 'all') // If it has views and no source filter, assume it might have products
        )
      }
    })
  }, [favorites, favoriteType, selectedSource])

  // For now, since FavoriteResponse doesn't contain items array,
  // we'll use empty arrays for services and products
  // TODO: Implement favorite items API or extend FavoriteResponse to include items
  const favoriteServices: Service[] = []
  const favoriteProducts: Product[] = []

  const hasServices = favoriteServices.length > 0
  const hasProducts = favoriteProducts.length > 0
  const hasFavoriteItems =
    (favoriteType === 'services' && hasServices) ||
    (favoriteType === 'products' && hasProducts)
  const hasFavorites = filteredFavorites.length > 0

  const handleServiceFavoriteToggle = async (serviceId: string) => {
    // TODO: Find the favorite containing this service and remove it
    // For now, this would require favorite items API
    try {
      // Find favorite by service ID (would need favorite items API)
      // await deleteFavoriteMutation.mutateAsync({ id: favoriteId })
      console.log('Remove service from favorites:', serviceId)
    } catch (error) {
      console.error('Failed to remove service from favorites:', error)
    }
  }

  const handleProductFavoriteToggle = async (productId: string) => {
    // TODO: Find the favorite containing this product and remove it
    // For now, this would require favorite items API
    try {
      // Find favorite by product ID (would need favorite items API)
      // await deleteFavoriteMutation.mutateAsync({ id: favoriteId })
      console.log('Remove product from favorites:', productId)
    } catch (error) {
      console.error('Failed to remove product from favorites:', error)
    }
  }

  const router = useRouter()
  const handleBookNow = (serviceId: string) => {
    router.push(`/services/category/${serviceId}`)
  }

  const { handleAddToCart: addToCart } = useAddProductToCart()

  const handleAddToCart = async (productId: string) => {
    // Find the product from favoriteProducts
    const product = favoriteProducts.find(p => p.id === productId)
    if (!product) return

    try {
      await addToCart(product, 1)
      // Optionally show success message
    } catch (error) {
      console.error('Failed to add product to cart:', error)
    }
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
      {favoriteType === 'services' && hasServices ? (
        <ServiceGrid
          services={favoriteServices}
          onWishlistToggle={handleServiceFavoriteToggle}
          onBookNow={handleBookNow}
          columns={3}
        />
      ) : favoriteType === 'products' && hasProducts ? (
        <ProductGrid
          products={favoriteProducts}
          onWishlistToggle={handleProductFavoriteToggle}
          onAddToCart={handleAddToCart}
          columns={3}
        />
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
        open={deleteFavoriteMutation.isPending}
        title="Updating favorites..."
        subtitle="Please wait a moment"
      />
    </UserPageLayout>
  )
}
