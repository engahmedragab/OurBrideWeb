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
import flowersImageRight from '@/assets/images/flowersRight.png'
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
import { useI18nTranslations, useIsRTL } from '@/i18n'

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
  const tCommon = useI18nTranslations('common')
  const t = useI18nTranslations('products')
  const isRTL = useIsRTL()

  // Get translated hero slides
  const translatedHeroSlides = useMemo(() => {
    return DEFAULT_HERO_SLIDES.map((slide, index) => {
      const slideKey = `slide${index + 1}` as 'slide1' | 'slide2'
      return {
        ...slide,
        label: t(`productHeroSlides.${slideKey}.label`),
        title: t(`productHeroSlides.${slideKey}.title`),
        description: t(`productHeroSlides.${slideKey}.description`),
        ctaText: t(`productHeroSlides.${slideKey}.ctaText`),
      }
    })
  }, [t])
  // Read all filters from URL params on mount
  useEffect(() => {
    const category = searchParams?.get('category')
    const subCategory = searchParams?.get('subCategory')
    const priceMin = searchParams?.get('priceMin')
    const priceMax = searchParams?.get('priceMax')
    const rating = searchParams?.get('rating')
    const inStock = searchParams?.get('inStock')
    const sort = searchParams?.get('sort')
    const search = searchParams?.get('search')

    const newFilters: ProductFilter = {}

    if (category) {
      newFilters.category = category.split(',').filter(Boolean)
    }

    if (subCategory) {
      newFilters.subCategory = subCategory.split(',').filter(Boolean)
    }

    if (priceMin && priceMax) {
      newFilters.priceRange = {
        min: Number(priceMin),
        max: Number(priceMax),
      }
    }

    if (rating) {
      newFilters.rating = Number(rating)
    }

    if (inStock) {
      newFilters.inStock = inStock === 'true'
    }

    setFilters(newFilters)

    if (sort) {
      setSortBy(sort)
    }

    if (search) {
      setSearchQuery(search)
    }
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

  // Fallback to regular products - fetch all products when needed for client-side filtering
  const shouldFetchAllProducts = useMemo(() => {
    // Fetch all products if:
    // 1. No search query and no filters (normal case) - when apiProducts is empty
    if (!searchQuery && !hasFilters) {
      return apiProducts.length === 0 && !productsLoading
    }
    // 2. We have filters but advanced search returned empty - need all products to apply client-side filters
    if (hasFilters && advancedSearchParams && advancedSearchResults.length === 0 && !advancedSearchLoading) {
      return true
    }
    // 3. We have filters but advanced search is not enabled (shouldn't happen, but safety check)
    if (hasFilters && !advancedSearchParams) {
      return true
    }
    return false
  }, [searchQuery, hasFilters, apiProducts.length, productsLoading, advancedSearchParams, advancedSearchResults.length, advancedSearchLoading])

  const { data: allProducts = [], isLoading: allProductsLoading } = useProducts({
    pageSize: 1000, // Fetch more products to allow client-side filtering
    enabled: shouldFetchAllProducts,
  })

  // Determine which products to use
  const products = useMemo(() => {
    // If advanced search returned results, use them
    if (advancedSearchParams && advancedSearchResults.length > 0) {
      return advancedSearchResults
    }
    // If simple search returned results and no filters, use them
    if (searchQuery && searchQuery.trim().length > 0 && !hasFilters && searchResults.length > 0) {
      return searchResults
    }
    // If filtered API products exist, use them
    if (apiProducts.length > 0) {
      return apiProducts
    }
    // Fallback to all products (will be filtered client-side if needed)
    return allProducts
  }, [advancedSearchResults, searchResults, apiProducts, allProducts, searchQuery, hasFilters, advancedSearchParams])

  // Determine loading state
  const isLoading = advancedSearchLoading || searchLoading || productsLoading || (shouldFetchAllProducts && allProductsLoading)

  // Apply client-side filtering
  // If advanced search returned results, use them as-is (already filtered)
  // If advanced search returned empty but we have filters, apply client-side filtering to all products
  // Otherwise, apply client-side filters to the products we have
  const filteredAndSortedProducts = useMemo(
    () => {
      // If advanced search returned results, use them (already filtered by API)
      if (advancedSearchParams && advancedSearchResults.length > 0) {
        return products
      }
      // If advanced search was used but returned empty, and we have allProducts, apply client-side filtering
      if (advancedSearchParams && advancedSearchResults.length === 0 && allProducts.length > 0) {
        return applyClientSideFilters(allProducts, filters, sortBy)
      }
      // Otherwise, apply client-side filters to current products
      return applyClientSideFilters(products, filters, sortBy)
    },
    [products, filters, sortBy, advancedSearchParams, advancedSearchResults.length, allProducts]
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
          tCommon('productCommon.addToCartSuccess'),
          tCommon('productCommon.addToCartError')
        )
      addToast(message, type)
    } catch (error) {
      console.error('Failed to add product to cart:', error)
      const errorMessage = error instanceof Error ? error.message : tCommon('productCommon.addToCartErrorRetry')
      addToast(errorMessage, 'error')
    }
  }

  return (
    <ProductPageLayout>
      {/* Hero Carousel */}
      <HeroCarousel
        slides={translatedHeroSlides}
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
                  {filteredAndSortedProducts.length} {tCommon('productCommon.productsFound')}
                </span>
              </div>
              <div className="flex items-center justify-between w-full md:w-auto   md:justify-end gap-3">
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
                    aria-label={tCommon('productCommon.gridView')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('list')}
                    aria-label={tCommon('productCommon.listView')}
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
                  text={tCommon('productsLoading')}
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
                  maxVisiblePages={4}
                  className="max-w-full w-fit "
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
              heading: t('categoryBanner.heading'),
              description:
                t('categoryBanner.description'),
              variant: 'newsletter',
              ctaText: t('categoryBanner.ctaText'),
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
  const tCommon = useI18nTranslations('common')
  return (
    <Suspense
      fallback={
        <ProductPageLayout isLoading={true} loadingText={tCommon('productsLoading')} />
      }
    >
      <ProductsContent />
    </Suspense>
  )
}
