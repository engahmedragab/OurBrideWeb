'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ProductGrid,
  ProductList,
  ProductFilters,
  ProductSort,
  HeroCarousel,
  Button,
  OfferBanner,
  LoadingSpinner,
} from '@/components/ui'
import { Grid3x3, List } from 'lucide-react'
import flowersImage from '@/assets/images/flowers.png'
import type { ProductFilter, ProductViewMode } from '@/types/product'
import {
  useProductsHome,
  useFilteredProducts,
  useProducts,
  useProductSearch,
} from '@/hooks/products'
import { ProductPageLayout } from '../components/ProductPageLayout'
import {
  PRODUCT_SORT_OPTIONS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PRODUCT_GRID_COLUMNS,
  DEFAULT_PAGE_SIZE,
} from '../constants'
import { buildProductQueryParams, applyClientSideFilters } from '../utils'

/**
 * ProductsContent - Main content component
 * Uses useSearchParams, so must be wrapped in Suspense
 */
function ProductsContent() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ProductViewMode>('grid')
  const [filters, setFilters] = useState<ProductFilter>({})
  const [sortBy, setSortBy] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')

  // Read search query from URL params
  useEffect(() => {
    const query = searchParams.get('search') || ''
    setSearchQuery(query)
  }, [searchParams])

  // Fetch categories from products home endpoint
  const { data: productsHomeData, isLoading: categoriesLoading } = useProductsHome()
  
  // Map categories to ProductCategory format (id as string)
  const categories = useMemo(() => {
    if (!productsHomeData?.categories) return []
    return productsHomeData.categories.map(cat => ({
      id: String(cat.id),
      name: cat.name,
      slug: cat.slug || '',
    }))
  }, [productsHomeData?.categories])

  // Build API query params from filters
  const apiQueryParams = useMemo(
    () => buildProductQueryParams(filters, sortBy),
    [filters, sortBy]
  )

  // Fetch search results if search query exists
  const { data: searchResults = [], isLoading: searchLoading } = useProductSearch(
    searchQuery || null,
    { enabled: !!searchQuery && searchQuery.trim().length > 0 }
  )

  // Fetch filtered products from API
  const { data: apiProducts = [], isLoading: productsLoading } =
    useFilteredProducts({
      ...apiQueryParams,
      enabled: !searchQuery || searchQuery.trim().length === 0,
    })

  // Fallback to regular products if filtered products endpoint doesn't work
  const { data: allProducts = [] } = useProducts({
    pageSize: DEFAULT_PAGE_SIZE,
    enabled:
      apiProducts.length === 0 &&
      !productsLoading &&
      (!searchQuery || searchQuery.trim().length === 0),
  })

  // Use search results if search query exists, otherwise use API products or all products
  const products = searchQuery && searchQuery.trim().length > 0
    ? searchResults
    : apiProducts.length > 0
    ? apiProducts
    : allProducts

  // Apply client-side filtering for filters not supported by API
  const filteredAndSortedProducts = useMemo(
    () => applyClientSideFilters(products, filters, sortBy),
    [products, filters, sortBy]
  )

  const handleWishlistToggle = (_productId: string) => {
    // TODO: Implement wishlist toggle
  }

  const handleAddToCart = (_productId: string) => {
    // TODO: Implement add to cart
  }

  return (
    <ProductPageLayout
      isLoading={categoriesLoading}
      loadingText="Loading products..."
    >
        {/* Hero Carousel */}
        <HeroCarousel
          slides={DEFAULT_HERO_SLIDES}
          autoPlay={true}
          autoPlayInterval={5000}
          showBackground={false}
        />

        <div className="container-custom py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar: Filters */}
            <aside className="lg:col-span-1">
              <ProductFilters
                categories={categories}
                filters={filters}
                onFiltersChange={setFilters}
                onReset={() => setFilters({})}
              />
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-14 text-gray-600">
                    {filteredAndSortedProducts.length} products found
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ProductSort
                    sortOptions={PRODUCT_SORT_OPTIONS}
                    currentSort={sortBy}
                    onSortChange={setSortBy}
                  />
                  <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {productsLoading || searchLoading ? (
                <div className="py-12">
                  <LoadingSpinner
                    size="lg"
                    text="Loading products..."
                  />
                </div>
              ) : viewMode === 'grid' ? (
                <ProductGrid
                  products={filteredAndSortedProducts}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  columns={DEFAULT_PRODUCT_GRID_COLUMNS}
                />
              ) : (
                <ProductList
                  products={filteredAndSortedProducts}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                />
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Banner */}
        <div className="mb-12">
          <OfferBanner
            offers={[
              {
                heading: 'Ready To Get Our News ?',
                description:
                  'OurBride is your all-in-one platform for wedding planning and shopping. Find everything you need to create your perfect day.',
                variant: 'newsletter',
                ctaText: 'Submit',
                productImage: flowersImage,
              },
            ]}
            onSubscribe={_email => {
              // TODO: Implement newsletter subscription
            }}
          />
        </div>
    </ProductPageLayout>
  )
}

/**
 * Products - Product category page
 * Wrapped in Suspense for useSearchParams compatibility
 * Route: /products/category
 */
export default function Products() {
  return (
    <Suspense
      fallback={
        <ProductPageLayout isLoading={true} loadingText="Loading products..." />
      }
    >
      <ProductsContent />
    </Suspense>
  )
}
