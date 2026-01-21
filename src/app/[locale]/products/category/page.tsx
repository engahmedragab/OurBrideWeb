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
  Pagination,
  Badge,
  useToast,
} from '@/components/ui'
import { Grid3x3, List } from 'lucide-react'
import flowersImage from '@/assets/images/flowers.png'
import type { ProductFilter, ProductViewMode } from '@/types/product'
import {
  useProductCategories,
  useFilteredProducts,
  useProducts,
  useAddProductToCart,
  useProductSearch,
  useProductSearchAdvanced,
} from '@/hooks/products'
import { ProductPageLayout } from '../components/ProductPageLayout'
import {
  PRODUCT_SORT_OPTIONS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PRODUCT_GRID_COLUMNS,
  DEFAULT_PAGE_SIZE,
} from '../constants'
import { buildProductQueryParams, applyClientSideFilters } from '../utils'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

/**
 * ProductsContent - Main content component
 * Uses useSearchParams, so must be wrapped in Suspense
 */
function ProductsContent() {
  const { addToast } = useToast()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ProductViewMode>('grid')
  const [filters, setFilters] = useState<ProductFilter>({})
  const [sortBy, setSortBy] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Read search query from URL params
  useEffect(() => {
    const query = searchParams.get('search') || ''
    setSearchQuery(query)
  }, [searchParams])

  // Fetch categories from backend API
  const { data: categoriesData = [] } = useProductCategories()

  // Map categories to ProductCategory format (id as string)
  const categories = useMemo(() => {
    return categoriesData.map(cat => ({
      id: String(cat.id),
      name: cat.name || '',
      slug: cat.slug || '',
    }))
  }, [categoriesData])

  // Check if we have filters applied (beyond just search)
  const hasFilters = useMemo(() => {
    return !!(
      (filters.category && filters.category.length > 0) ||
      filters.priceRange ||
      filters.rating ||
      filters.inStock !== undefined
    )
  }, [filters])

  // Build advanced search params if we have filters or search query
  const advancedSearchParams = useMemo(() => {
    if (!hasFilters && !searchQuery) return null
    
    const params: {
      searchTerm?: string
      categoryIds?: number[]
      minPrice?: number
      maxPrice?: number
      inStock?: boolean
      sortBy?: string
      sortOrder?: string
      page?: number
      pageSize?: number
    } = {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      params.searchTerm = searchQuery.trim()
    }

    if (filters.category && filters.category.length > 0) {
      params.categoryIds = filters.category
        .map(cat => parseInt(cat, 10))
        .filter(id => !isNaN(id))
    }

    if (filters.priceRange) {
      params.minPrice = filters.priceRange.min
      params.maxPrice = filters.priceRange.max
    }

    if (filters.inStock !== undefined) {
      params.inStock = filters.inStock
    }

    if (sortBy !== 'default') {
      const sortMap: Record<string, { sortBy?: string; sortOrder?: string }> = {
        'price-low': { sortBy: 'price', sortOrder: 'asc' },
        'price-high': { sortBy: 'price', sortOrder: 'desc' },
        'rating': { sortBy: 'rating', sortOrder: 'desc' },
        'popular': { sortBy: 'popularity', sortOrder: 'desc' },
      }
      const sortConfig = sortMap[sortBy]
      if (sortConfig) {
        params.sortBy = sortConfig.sortBy
        params.sortOrder = sortConfig.sortOrder
      }
    }

    return params
  }, [searchQuery, filters, sortBy, hasFilters])

  // Use advanced search if we have filters or search query
  const { data: advancedSearchResults = [], isLoading: advancedSearchLoading } =
    useProductSearchAdvanced({
      ...advancedSearchParams,
      enabled: !!advancedSearchParams,
    })

  // Fetch simple search results (fallback for simple search only)
  const { data: searchResults = [], isLoading: searchLoading } = useProductSearch(
    searchQuery || null,
    { enabled: !!searchQuery && searchQuery.trim().length > 0 && !hasFilters }
  )

  // Build API query params from filters (for filtered endpoint)
  const apiQueryParams = useMemo(
    () => buildProductQueryParams(filters, sortBy),
    [filters, sortBy]
  )

  // Fetch filtered products from API (fallback when no search and no filters)
  const { data: apiProducts = [], isLoading: productsLoading } =
    useFilteredProducts({
      ...apiQueryParams,
      enabled: !searchQuery && !hasFilters,
    })

  // Fallback to regular products if filtered products endpoint doesn't work
  const { data: allProducts = [] } = useProducts({
    pageSize: DEFAULT_PAGE_SIZE,
    enabled:
      apiProducts.length === 0 &&
      !productsLoading &&
      !searchQuery &&
      !hasFilters,
  })

  // Determine which products to use
  const products = useMemo(() => {
    if (advancedSearchParams && advancedSearchResults.length > 0) {
      return advancedSearchResults
    }
    if (searchQuery && searchQuery.trim().length > 0 && !hasFilters && searchResults.length > 0) {
      return searchResults
    }
    if (apiProducts.length > 0) {
      return apiProducts
    }
    return allProducts
  }, [advancedSearchResults, searchResults, apiProducts, allProducts, searchQuery, hasFilters, advancedSearchParams])

  // Determine loading state
  const isLoading = advancedSearchLoading || searchLoading || productsLoading

  // Apply client-side filtering only for filters not supported by API
  // (Advanced search handles most filters, so minimal client-side filtering needed)
  const filteredAndSortedProducts = useMemo(
    () => {
      // If we used advanced search, it already handled most filters
      if (advancedSearchParams) {
        return products
      }
      // Otherwise, apply client-side filters
      return applyClientSideFilters(products, filters, sortBy)
    },
    [products, filters, sortBy, advancedSearchParams]
  )

  // Get selected category name and collect all unique tags
  const selectedCategory = useMemo(() => {
    if (filters.category && filters.category.length > 0) {
      return categories.find(cat => cat.id === filters.category![0])
    }
    return null
  }, [filters.category, categories])

  // Collect all unique tags from filtered products
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    filteredAndSortedProducts.forEach(product => {
      product.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).slice(0, 10) // Limit to 10 tags
  }, [filteredAndSortedProducts])

  // Pagination
  const PRODUCTS_PER_PAGE = 12
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    const endIndex = startIndex + PRODUCTS_PER_PAGE
    return filteredAndSortedProducts.slice(startIndex, endIndex)
  }, [filteredAndSortedProducts, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, searchQuery, sortBy])

  const handleWishlistToggle = (_productId: string) => {
    // TODO: Implement wishlist toggle
  }

  const { handleAddToCart: addToCart } = useAddProductToCart()

  const handleAddToCart = async (productId: string) => {
    // Find the product from filteredAndSortedProducts
    const product = filteredAndSortedProducts.find(p => p.id === productId)
    if (!product) return

    try {
      const response = await addToCart(product, 1)
      const { message, type } = handleApiResponseForToast(
        response,
        'Product added to cart successfully!',
        'Failed to add product to cart'
      )
      addToast(message, type)
    } catch (error) {
      console.error('Failed to add product to cart:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add product to cart. Please try again.'
      addToast(errorMessage, 'error')
    }
  }

  return (
    <ProductPageLayout>
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
            {/* Category Name and Tags */}
            {(selectedCategory || allTags.length > 0) && (
              <div className="mb-6 space-y-3">
                {selectedCategory && (
                  <h2 className="text-24 md:text-28 font-semibold text-gray-900">
                    {selectedCategory.name}
                  </h2>
                )}
                {allTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {allTags.map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-14 px-3 py-1.5 border-gray-300 text-gray-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

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
            {isLoading ? (
              <div className="py-12">
                <LoadingSpinner
                  size="lg"
                  text="Loading products..."
                  fullScreen={true}
                />
              </div>
            ) : viewMode === 'grid' ? (
              <ProductGrid
                products={paginatedProducts}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
                columns={DEFAULT_PRODUCT_GRID_COLUMNS}
              />
            ) : (
              <ProductList
                products={paginatedProducts}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
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
