'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import {
  ProductGrid,
  ProductList,
  ProductFilters,
  ProductSort,
  HeroCarousel,
  Button,
  OfferBanner,
} from '@/components/ui'
import { Grid3x3, List } from 'lucide-react'
import flowersImage from '@/assets/images/flowers.png'
import type {
  ProductFilter,
  ProductSortOption,
  ProductViewMode,
} from '@/types/product'
import {
  useProductsHome,
  useFilteredProducts,
  useProducts,
} from '@/hooks/products'

const sortOptions: ProductSortOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
]

// Hero Carousel Slides
const heroSlides = [
  {
    id: '1',
    label: 'New Arrival',
    title: 'Avca Sun Cream',
    description:
      'OurBride is your all-in-one platform for wedding planning and shopping. Find everything you need to create your perfect day.',
    ctaText: 'Buy Now',
    ctaLink: '/products/1',
    productImage:
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600',
    discountText: '50% OFF',
  },
  {
    id: '2',
    label: 'Top Seller',
    title: 'Essential Wedding Cream',
    description:
      'Premium quality products for your special day. Discover our curated collection of wedding essentials.',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    productImage:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600',
    discountText: '30% OFF',
  },
]

export default function Products() {
  const [viewMode, setViewMode] = useState<ProductViewMode>('grid')
  const [filters, setFilters] = useState<ProductFilter>({})
  const [sortBy, setSortBy] = useState('default')

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
  const apiQueryParams = useMemo(() => {
    const params: {
      categoryId?: number
      minPrice?: number
      maxPrice?: number
      rating?: number
      sortBy?: string
    } = {}

    if (filters.category && filters.category.length > 0) {
      // Use first category ID (API might need adjustment for multiple categories)
      const categoryId = parseInt(filters.category[0], 10)
      if (!isNaN(categoryId)) {
        params.categoryId = categoryId
      }
    }

    if (filters.priceRange) {
      params.minPrice = filters.priceRange.min
      params.maxPrice = filters.priceRange.max
    }

    if (filters.rating) {
      params.rating = filters.rating
    }

    // Map sortBy to API sortBy format
    if (sortBy !== 'default') {
      const sortMap: Record<string, string> = {
        'price-low': 'price_asc',
        'price-high': 'price_desc',
        rating: 'rating_desc',
        newest: 'date_desc',
        popular: 'popularity_desc',
      }
      params.sortBy = sortMap[sortBy] || sortBy
    }

    return params
  }, [filters, sortBy])

  // Fetch filtered products from API
  const { data: apiProducts = [], isLoading: productsLoading } =
    useFilteredProducts({
      ...apiQueryParams,
      enabled: true,
    })

  // Fallback to regular products if filtered products endpoint doesn't work
  const { data: allProducts = [] } = useProducts({
    pageSize: 100,
    enabled: apiProducts.length === 0 && !productsLoading,
  })

  // Use API products if available, otherwise use all products
  const products = apiProducts.length > 0 ? apiProducts : allProducts

  // Apply client-side filtering for filters not supported by API
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Apply inStock filter (if API doesn't support it)
    if (filters.inStock !== undefined) {
      result = result.filter(p => p.inStock === filters.inStock)
    }

    // Apply additional client-side sorting if needed
    // (Most sorting should be done by API, but we can refine here)
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price.discounted - b.price.discounted)
        break
      case 'price-high':
        result.sort((a, b) => b.price.discounted - a.price.discounted)
        break
      case 'rating':
        result.sort((a, b) => b.rating.value - a.rating.value)
        break
      case 'popular':
        result.sort((a, b) => b.rating.count - a.rating.count)
        break
      default:
        // Keep API order
        break
    }

    return result
  }, [products, filters, sortBy])

  const handleWishlistToggle = (_productId: string) => {
    // TODO: Implement wishlist toggle
  }

  const handleAddToCart = (_productId: string) => {
    // TODO: Implement add to cart
  }

  // Show loading state
  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-18 text-gray-600">Loading products...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Carousel */}
        <HeroCarousel
          slides={heroSlides}
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
                    sortOptions={sortOptions}
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
              {viewMode === 'grid' ? (
                <ProductGrid
                  products={filteredAndSortedProducts}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  columns={3}
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
      </main>
      <Footer />
    </div>
  )
}
