'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import {
  ServiceGrid,
  ServiceList,
  ProductFilters,
  ProductSort,
  Button,
  OfferBanner,
  SearchInput,
  Pagination,
  LoadingOverlay,
} from '@/components/ui'
import { Grid3x3, List } from 'lucide-react'
import flowersImage from '@/assets/images/flowers.png'
import type {
  Service,
  ServiceSortOption,
  ServiceViewMode,
} from '@/types/service'
import type { ProductCategory, ProductFilter } from '@/types/product'

// Mock data - Replace with API calls
const mockCategories: ProductCategory[] = [
  { id: '1', name: 'Makeup', slug: 'makeup', productCount: 45 },
  { id: '2', name: 'Hair Care', slug: 'hair-care', productCount: 32 },
  { id: '3', name: 'Skin Care', slug: 'skin-care', productCount: 28 },
  { id: '4', name: 'Spa & Massage', slug: 'spa-massage', productCount: 20 },
  { id: '5', name: 'Photography', slug: 'photography', productCount: 15 },
  { id: '6', name: 'Videography', slug: 'videography', productCount: 12 },
]

const mockServices: Service[] = [
  {
    id: '1',
    title: 'Wedding Makeup Service',
    description: 'Professional bridal makeup for your special day.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    ],
    provider: {
      id: '1',
      name: 'Beauty Studio Pro',
      verified: true,
    },
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 128 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Makeup', 'Bridal'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    showTopOfferBadge: true,
  },
  {
    id: '2',
    title: 'Hair Styling Service',
    description: 'Expert hair styling and hairdo for weddings.',
    images: ['https://images.unsplash.com/photo-1560066984-10d1eeb6b2a5?w=400'],
    provider: {
      id: '2',
      name: 'Hair Studio Elite',
      verified: true,
    },
    price: { original: 4000, discounted: 3500, currency: 'egp' },
    rating: { value: 4.8, count: 89 },
    category: { id: '2', name: 'Hair Care', slug: 'hair-care' },
    tags: ['Hair', 'Styling'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
  },
  {
    id: '3',
    title: 'Bridal Skincare Treatment',
    description: 'Complete skincare routine for glowing bridal skin.',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    ],
    provider: {
      id: '3',
      name: 'Skincare Co',
      verified: true,
    },
    price: { original: 6000, discounted: 5000, currency: 'egp' },
    rating: { value: 4.6, count: 67 },
    category: { id: '3', name: 'Skin Care', slug: 'skin-care' },
    tags: ['Skin', 'Care', 'Treatment'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
  },
  {
    id: '4',
    title: 'Spa & Relaxation Package',
    description: 'Full body spa treatment for pre-wedding relaxation.',
    images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'],
    provider: {
      id: '4',
      name: 'Luxury Spa',
      verified: true,
    },
    price: { original: 8000, discounted: 6500, currency: 'egp' },
    rating: { value: 4.9, count: 94 },
    category: { id: '4', name: 'Spa & Massage', slug: 'spa-massage' },
    tags: ['Spa', 'Massage', 'Relaxation'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    showTopOfferBadge: true,
  },
  {
    id: '5',
    title: 'Wedding Photography',
    description: 'Professional wedding photography services.',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    ],
    provider: {
      id: '5',
      name: 'Photo Studio Pro',
      verified: true,
    },
    price: { original: 15000, discounted: 12000, currency: 'egp' },
    rating: { value: 4.7, count: 156 },
    category: { id: '5', name: 'Photography', slug: 'photography' },
    tags: ['Photography', 'Wedding'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: true,
    },
  },
  {
    id: '6',
    title: 'Wedding Videography',
    description: 'Cinematic wedding videography services.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=400',
    ],
    provider: {
      id: '6',
      name: 'Video Production Co',
      verified: true,
    },
    price: { original: 18000, discounted: 15000, currency: 'egp' },
    rating: { value: 4.8, count: 112 },
    category: { id: '6', name: 'Videography', slug: 'videography' },
    tags: ['Videography', 'Wedding'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: true,
    },
  },
  // Add more services for pagination
  {
    id: '7',
    title: 'Professional Nail Art Service',
    description: 'Beautiful nail art designs for your wedding day.',
    images: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    ],
    provider: {
      id: '7',
      name: 'Nail Art Studio',
      verified: true,
    },
    price: { original: 3000, discounted: 2500, currency: 'egp' },
    rating: { value: 4.4, count: 78 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Nails', 'Art'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
  },
  {
    id: '8',
    title: 'Bridal Hair Extension Service',
    description: 'Premium hair extensions for voluminous bridal hair.',
    images: ['https://images.unsplash.com/photo-1560066984-10d1eeb6b2a5?w=400'],
    provider: {
      id: '8',
      name: 'Hair Extensions Pro',
      verified: true,
    },
    price: { original: 7000, discounted: 6000, currency: 'egp' },
    rating: { value: 4.7, count: 95 },
    category: { id: '2', name: 'Hair Care', slug: 'hair-care' },
    tags: ['Hair', 'Extensions'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
  },
  {
    id: '9',
    title: 'Facial Treatment Service',
    description: 'Deep cleansing facial for radiant bridal skin.',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    ],
    provider: {
      id: '9',
      name: 'Beauty Spa Center',
      verified: true,
    },
    price: { original: 4500, discounted: 3800, currency: 'egp' },
    rating: { value: 4.6, count: 112 },
    category: { id: '3', name: 'Skin Care', slug: 'skin-care' },
    tags: ['Facial', 'Treatment'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
  },
  {
    id: '10',
    title: 'Hot Stone Massage',
    description: 'Relaxing hot stone massage for pre-wedding stress relief.',
    images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'],
    provider: {
      id: '10',
      name: 'Wellness Spa',
      verified: true,
    },
    price: { original: 5500, discounted: 4800, currency: 'egp' },
    rating: { value: 4.8, count: 134 },
    category: { id: '4', name: 'Spa & Massage', slug: 'spa-massage' },
    tags: ['Massage', 'Relaxation'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
  },
  {
    id: '11',
    title: 'Engagement Photography',
    description: 'Beautiful engagement photo sessions.',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    ],
    provider: {
      id: '11',
      name: 'Photo Memories',
      verified: true,
    },
    price: { original: 12000, discounted: 10000, currency: 'egp' },
    rating: { value: 4.9, count: 167 },
    category: { id: '5', name: 'Photography', slug: 'photography' },
    tags: ['Photography', 'Engagement'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: true,
    },
  },
  {
    id: '12',
    title: 'Pre-Wedding Videography',
    description: 'Cinematic pre-wedding video production.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=400',
    ],
    provider: {
      id: '12',
      name: 'Cinema Studio',
      verified: true,
    },
    price: { original: 16000, discounted: 14000, currency: 'egp' },
    rating: { value: 4.7, count: 98 },
    category: { id: '6', name: 'Videography', slug: 'videography' },
    tags: ['Videography', 'Pre-Wedding'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: true,
    },
  },
  {
    id: '13',
    title: 'Bridal Makeup & Hair Package',
    description: 'Complete bridal beauty package with makeup and hair.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    ],
    provider: {
      id: '13',
      name: 'Complete Beauty',
      verified: true,
    },
    price: { original: 9000, discounted: 7500, currency: 'egp' },
    rating: { value: 4.9, count: 201 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Makeup', 'Hair', 'Package'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    showTopOfferBadge: true,
  },
  {
    id: '14',
    title: 'Hair Color Service',
    description: 'Professional hair coloring for your special day.',
    images: ['https://images.unsplash.com/photo-1560066984-10d1eeb6b2a5?w=400'],
    provider: {
      id: '14',
      name: 'Color Studio',
      verified: true,
    },
    price: { original: 5000, discounted: 4200, currency: 'egp' },
    rating: { value: 4.5, count: 87 },
    category: { id: '2', name: 'Hair Care', slug: 'hair-care' },
    tags: ['Hair', 'Color'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
  },
  {
    id: '15',
    title: 'Body Scrub Treatment',
    description: 'Exfoliating body scrub for smooth, glowing skin.',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    ],
    provider: {
      id: '15',
      name: 'Body Care Spa',
      verified: true,
    },
    price: { original: 4000, discounted: 3500, currency: 'egp' },
    rating: { value: 4.6, count: 76 },
    category: { id: '3', name: 'Skin Care', slug: 'skin-care' },
    tags: ['Body', 'Scrub'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
  },
  {
    id: '16',
    title: 'Aromatherapy Massage',
    description: 'Relaxing aromatherapy massage with essential oils.',
    images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'],
    provider: {
      id: '16',
      name: 'Aroma Wellness',
      verified: true,
    },
    price: { original: 6000, discounted: 5200, currency: 'egp' },
    rating: { value: 4.7, count: 103 },
    category: { id: '4', name: 'Spa & Massage', slug: 'spa-massage' },
    tags: ['Massage', 'Aromatherapy'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
  },
  {
    id: '17',
    title: 'Wedding Album Photography',
    description: 'Professional wedding album photography services.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=400',
    ],
    provider: {
      id: '17',
      name: 'Album Studio',
      verified: true,
    },
    price: { original: 18000, discounted: 15000, currency: 'egp' },
    rating: { value: 4.8, count: 145 },
    category: { id: '5', name: 'Photography', slug: 'photography' },
    tags: ['Photography', 'Album'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: true,
    },
  },
  {
    id: '18',
    title: 'Drone Videography',
    description: 'Aerial wedding videography with drone technology.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=400',
    ],
    provider: {
      id: '18',
      name: 'Aerial Video Pro',
      verified: true,
    },
    price: { original: 20000, discounted: 17000, currency: 'egp' },
    rating: { value: 4.9, count: 178 },
    category: { id: '6', name: 'Videography', slug: 'videography' },
    tags: ['Videography', 'Drone'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: true,
    },
    showTopOfferBadge: true,
  },
]

const sortOptions: ServiceSortOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
]

/**
 * ServicesCategoryPageContent - Main content component
 * Reads filters from URL query params and syncs changes back to URL
 */
function ServicesCategoryPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ServiceViewMode>('grid')
  const [filters, setFilters] = useState<ProductFilter>({})
  const [sortBy, setSortBy] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const servicesPerPage = 9

  // Read filters from URL on mount and when URL changes
  useEffect(() => {
    const category = searchParams.get('category')
    const subCategory = searchParams.get('subCategory')
    const priceMin = searchParams.get('priceRangeMin')
    const priceMax = searchParams.get('priceRangeMax')
    const rating = searchParams.get('rating')
    const availability = searchParams.get('availability')
    const sort = searchParams.get('sort')
    const page = searchParams.get('page')
    const search = searchParams.get('search')

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

    if (availability !== null) {
      newFilters.inStock = availability === 'true'
    }

    setFilters(newFilters)

    if (sort) {
      setSortBy(sort)
    }

    if (page) {
      setCurrentPage(Number(page))
    }

    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams])

  // Update URL when filters, sort, page, or search change
  const updateURL = (
    newFilters: ProductFilter,
    newSort: string,
    newPage: number,
    newSearch: string
  ) => {
    const params = new URLSearchParams()

    if (newFilters.category && newFilters.category.length > 0) {
      params.set('category', newFilters.category.join(','))
    }

    if (newFilters.subCategory && newFilters.subCategory.length > 0) {
      params.set('subCategory', newFilters.subCategory.join(','))
    }

    if (newFilters.priceRange) {
      params.set('priceRangeMin', String(newFilters.priceRange.min))
      params.set('priceRangeMax', String(newFilters.priceRange.max))
    }

    if (newFilters.rating !== undefined) {
      params.set('rating', String(newFilters.rating))
    }

    if (newFilters.inStock !== undefined) {
      params.set('availability', String(newFilters.inStock))
    }

    if (newSort && newSort !== 'default') {
      params.set('sort', newSort)
    }

    if (newPage > 1) {
      params.set('page', String(newPage))
    }

    if (newSearch.trim()) {
      params.set('search', newSearch.trim())
    }

    const queryString = params.toString()
    router.push(`/services/category${queryString ? `?${queryString}` : ''}`)
  }

  // Filter and sort services
  const filteredAndSortedServices = useMemo(() => {
    let result = [...mockServices]

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tags.some(tag => tag.toLowerCase().includes(query)) ||
          s.provider.name.toLowerCase().includes(query)
      )
    }

    // Apply filters
    if (filters.category && filters.category.length > 0) {
      result = result.filter(s => filters.category!.includes(s.category.id))
    }

    if (filters.priceRange) {
      result = result.filter(
        s =>
          s.price.discounted >= filters.priceRange!.min &&
          s.price.discounted <= filters.priceRange!.max
      )
    }

    if (filters.rating) {
      result = result.filter(s => s.rating.value >= filters.rating!)
    }

    if (filters.inStock !== undefined) {
      result = result.filter(s => s.available === filters.inStock)
    }

    // Apply sorting
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
      case 'newest':
        result.reverse()
        break
      case 'popular':
        result.sort((a, b) => b.rating.count - a.rating.count)
        break
      default:
        break
    }

    return result
  }, [filters, sortBy, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(
    filteredAndSortedServices.length / servicesPerPage
  )
  const startIndex = (currentPage - 1) * servicesPerPage
  const endIndex = startIndex + servicesPerPage
  const paginatedServices = filteredAndSortedServices.slice(
    startIndex,
    endIndex
  )

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: ProductFilter) => {
    setFilters(newFilters)
    setCurrentPage(1)
    updateURL(newFilters, sortBy, 1, searchQuery)
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    updateURL(filters, newSort, currentPage, searchQuery)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch)
    setCurrentPage(1)
    updateURL(filters, sortBy, 1, newSearch)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    updateURL(filters, sortBy, newPage, searchQuery)
  }

  const handleWishlistToggle = (_serviceId: string) => {
    // TODO: Implement wishlist toggle
  }

  const handleBookNow = (_serviceId: string) => {
    // TODO: Implement book now
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar: Filters */}
            <aside className="lg:col-span-1">
              <ProductFilters
                categories={mockCategories}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={() => {
                  setFilters({})
                  setCurrentPage(1)
                  updateURL({}, sortBy, 1, searchQuery)
                }}
              />
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <div className="mb-6">
                <SearchInput
                  placeholder="Search for a Service..."
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  size="lg"
                  className="w-full rounded-full"
                />
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-14 text-gray-600">
                    {filteredAndSortedServices.length} services found
                    {totalPages > 1 && (
                      <span className="ml-2 text-gray-500">
                        (Page {currentPage} of {totalPages})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ProductSort
                    sortOptions={sortOptions}
                    currentSort={sortBy}
                    onSortChange={handleSortChange}
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

              {/* Services */}
              {viewMode === 'grid' ? (
                <>
                  <ServiceGrid
                    services={paginatedServices}
                    onWishlistToggle={handleWishlistToggle}
                    onBookNow={handleBookNow}
                    columns={3}
                  />
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 relative z-10">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <ServiceList
                    services={paginatedServices}
                    onWishlistToggle={handleWishlistToggle}
                    onBookNow={handleBookNow}
                  />
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 relative z-10">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
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

/**
 * ServicesCategoryPage - Grid page with sidebar filters
 * Wrapped in Suspense for useSearchParams compatibility
 * Route: /services/category
 */
export default function ServicesCategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingOverlay
            open={true}
            title="Loading..."
            subtitle="Please wait a moment"
          />
        </div>
      }
    >
      <ServicesCategoryPageContent />
    </Suspense>
  )
}

