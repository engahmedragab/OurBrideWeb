'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import {
  Grid3x3,
  List,
  X,
  SlidersHorizontal,
  Store,
  Package,
  TrendingUp,
  Tag,
  CheckCircle2,
  Percent,
  Calendar,
  CreditCard,
  Gift,
  Crown,
  Globe,
  ExternalLink,
  ImageIcon,
  Video,
  UserPlus,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import {
  Button,
  Typography,
  CardWrapper,
  SearchInput,
  ProductGrid,
  ProductList,
  Badge,
  RatingDisplay,
  LoadingSpinner,
  ErrorDisplay,
  SelectPopover,
  EmptyState,
  Pagination,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { useProviderPublicStore } from '@/hooks/providers/useProviderPublicStore'
import { useProductsHome } from '@/hooks/products/useProductsHome'
import { useStoreHomeByProvider } from '@/hooks/home/useHome'
import { extractStoreHomeData } from '@/utils/home-data.utils'
import { useLocale } from '@/i18n'
import { OfferBanner } from '@/components/ui/OfferBanner'
import type { ProductHeaderResponse } from '@/types/responses/product-header-response'
import type { CategoryResponse } from '@/types/responses/category-response'
import type { ProductBrandResponse } from '@/types/responses/product-brand-response'
import type { ProviderCategoryResponse } from '@/types/responses/provider-category-response'
import type { ProviderProductBrandResponse } from '@/types/responses/provider-product-brand-response'
import type { Visibility } from '@/types/responses/common'

interface ProviderStoreClientProps {
  providerId: string
}

type ViewMode = 'grid' | 'list'
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'name'

const PAGE_SIZE = 8

export function ProviderStoreClient({ providerId }: ProviderStoreClientProps) {
  const router = useRouter()
  const locale = useLocale()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch provider store data
  const { data: storeData, isLoading: storeLoading, error: storeError } = useProviderPublicStore(
    providerId,
    { page: 1, pageSize: 1000 }
  )

  // Fetch products home data for filters
  const { data: productsHomeData, isLoading: homeLoading } = useProductsHome()

  // Extract providerId number
  const providerIdNumber = useMemo(() => {
    if (storeData?.providerId) {
      return storeData.providerId
    }
    const parsed = parseInt(providerId, 10)
    return isNaN(parsed) ? undefined : parsed
  }, [storeData?.providerId, providerId])

  const { data: storeHomeData, isLoading: storeHomeLoading } = useStoreHomeByProvider(
    providerIdNumber ? { providerId: providerIdNumber } : undefined,
    !!providerIdNumber
  )

  // Extract store home data
  const storeHomeExtracted = useMemo(() => {
    if (storeHomeData) {
      return extractStoreHomeData(storeHomeData, locale)
    }
    return {}
  }, [storeHomeData, locale])

  const isLoading = storeLoading || homeLoading || storeHomeLoading

  // Get available filters
  const availableCategories = productsHomeData?.categories || storeData?.providerCategories || []
  const availableBrands = productsHomeData?.brands || storeData?.providerProductBrands || []

  // Convert products to ProductHeaderResponse format
  const products = useMemo(() => {
    if (!storeData?.products) return []
    return storeData.products.map(p => {
      const productId = p.productId || 0
      const nameEn = p.nameEn || ''
      const nameAr = p.nameAr || ''
      const rate = p.rate?.toString() || '0'
      const price = p.price || 0
      const salePrice = p.salePrice || null
      const regularPrice = p.hasDiscount && p.price ? p.price : null
      const image = p.image || p.url || ''
      const tags = p.tagsString || ''
      const categoryId = p.categoryId || 0
      const subCategoryId = p.subCategoryId || 0
      const inStock = p.inStock ?? true
      const stockQuantity = p.stock || null
      const hasDiscount = p.hasDiscount || false

      return {
        id: productId,
        productId,
        nameEn,
        nameAr,
        name: nameEn || nameAr,
        bioAr: '',
        bioEn: '',
        bio: p.bio || '',
        slug: '',
        isActive: p.isActive ?? true,
        rate,
        ratingCount: 0,
        likes: p.likes || null,
        url: p.url || '',
        price,
        amount: p.amount || null,
        stockQuantity,
        sku: '',
        shortDescriptionAr: p.shortDescriptionAr || '',
        shortDescriptionEn: p.shortDescriptionEn || '',
        shortDescription: p.shortDescriptionEn || p.shortDescriptionAr || '',
        isFeatured: p.isFeatured || false,
        published: p.published ?? true,
        visibility: (p.visibility as unknown as Visibility) || (0 as unknown as Visibility),
        buttonText: '',
        youtubeUrl: p.youtubeUrl || '',
        image,
        hasDiscount,
        discountDateStart: p.discountDateStart || null,
        discountDateEnd: p.discountDateEnd || null,
        isTaagerProduct: p.isTaagerProduct || null,
        inStock,
        tags,
        attributes: '',
        categories: '',
        categoryId,
        subCategoryId,
        providerId: p.providerId || storeData?.providerId || 0,
        provider: p.provider || null,
        providerProductAttributes: storeData?.providerProductAttributes || [],
        providerProductTags: storeData?.providerProductTags || [],
        providerCategories: storeData?.providerCategories || [],
        providerSubCategories: [],
        regularPrice,
        salePrice,
        dateOnSaleFrom: null,
        dateOnSaleFromGmt: null,
        dateOnSaleTo: null,
        dateOnSaleToGmt: null,
        priceHtml: '',
        onSale: null,
        purchasable: null,
        totalSales: null,
        conflictInfo: null,
      } as ProductHeaderResponse
    })
  }, [storeData?.products, storeData?.providerProductAttributes, storeData?.providerProductTags, storeData?.providerCategories, storeData?.providerId])

  // Get flash sale products (products with discount dates or on sale)
  const flashSaleProducts = useMemo(() => {
    if (!storeData?.products || storeData.products.length === 0) return []
    const now = new Date()
    return storeData.products
      .filter(p => {
        // Include products with discounts
        if (p.hasDiscount) {
          // If product has discount dates, check if they're active
          if (p.discountDateStart && p.discountDateEnd) {
            try {
              const startDate = new Date(p.discountDateStart)
              const endDate = new Date(p.discountDateEnd)
              return now >= startDate && now <= endDate
            } catch {
              // If date parsing fails, include it if hasDiscount is true
              return true
            }
          }
          // If hasDiscount but no dates, include it
          return true
        }
        // Also include products that are on sale
        if (p.onSale) return true
        return false
      })
      .slice(0, 8) // Limit to 8 products
  }, [storeData?.products])

  // Get active memberships
  const activeMemberships = useMemo(() => {
    if (!storeData?.memberships || storeData.memberships.length === 0) return []
    return storeData.memberships.filter(m => m.isActive)
  }, [storeData?.memberships])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let productsList = products

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      productsList = productsList.filter(
        p =>
          (p.nameEn?.toLowerCase().includes(query) ||
            p.nameAr?.toLowerCase().includes(query) ||
            p.shortDescription?.toLowerCase().includes(query) ||
            p.tags?.toLowerCase().includes(query)) &&
          p.isActive
      )
    } else {
      productsList = productsList.filter(p => p.isActive)
    }

    // Apply category filter
    if (selectedCategory) {
      productsList = productsList.filter(p => p.categoryId === selectedCategory)
    }

    // Apply brand filter
    if (selectedBrand) {
      productsList = productsList.filter(p => {
        // Check if product has matching brand attribute
        const brandAttribute = p.providerProductAttributes?.find(
          attr => attr.productAttributeId === selectedBrand
        )
        return !!brandAttribute
      })
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        productsList.sort((a, b) => ((a.salePrice ?? a.price) || 0) - ((b.salePrice ?? b.price) || 0))
        break
      case 'price-desc':
        productsList.sort((a, b) => ((b.salePrice ?? b.price) || 0) - ((a.salePrice ?? a.price) || 0))
        break
      case 'rating':
        productsList.sort((a, b) => parseFloat(b.rate || '0') - parseFloat(a.rate || '0'))
        break
      case 'name':
        productsList.sort((a, b) => (a.nameEn || a.nameAr || '').localeCompare(b.nameEn || b.nameAr || ''))
        break
      default:
        // Keep original order
        break
    }

    return productsList
  }, [products, searchQuery, selectedCategory, selectedBrand, sortOption])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedBrand, sortOption])

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    return filteredAndSortedProducts.slice(startIndex, endIndex)
  }, [filteredAndSortedProducts, currentPage])

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PAGE_SIZE)

  // Error state
  if (storeError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-12">
          <ErrorDisplay
            title="Failed to load store"
            message={storeError.message || 'An error occurred while loading the store.'}
            onAction={() => window.location.reload()}
            actionLabel="Retry"
          />
        </div>
        <Footer />
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading store..." fullScreen={true} />
        </main>
        <Footer />
      </div>
    )
  }

  if (!storeData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-12">
          <EmptyState
            title="Store not found"
            description="The store you're looking for doesn't exist or has been removed."
          />
        </div>
        <Footer />
      </div>
    )
  }

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedBrand ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <div className="relative bg-brand-600 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            />
          </div>

          <div className="container-custom py-12 md:py-16 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Provider Logo */}
              {storeData?.providerPublicLogoImageUrl ? (
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl bg-white flex-shrink-0">
                  <Image
                    src={storeData.providerPublicLogoImageUrl}
                    alt={storeData?.providerNameEn || storeData?.providerNameAr || 'Provider Logo'}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              ) : (
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl bg-white/20 backdrop-blur-sm flex-shrink-0 flex items-center justify-center">
                  <Store className="h-12 w-12 md:h-16 md:w-16 text-white/80" />
                </div>
              )}

              {/* Provider Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Typography variant="h2" className="text-white font-bold">
                    {storeData?.providerNameEn || storeData?.providerNameAr || 'Provider Store'}
                  </Typography>
                  {storeData?.providerIsVerified && (
                    <Badge variant="default" className="bg-white/20 text-white border-white/30">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {storeData?.providerDescriptionEn || storeData?.providerDescriptionAr ? (
                  <Typography variant="body" className="text-white/95 mb-6 max-w-2xl leading-relaxed">
                    {storeData?.providerDescriptionEn || storeData?.providerDescriptionAr}
                  </Typography>
                ) : null}

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6">
                  {storeData?.providerRate && storeData.providerRate > 0 && (
                    <CardWrapper padding="sm" className="bg-white/10 backdrop-blur-sm border-white/20">
                      <div className="flex items-center gap-2">
                        <RatingDisplay
                          rating={storeData.providerRate}
                          size="sm"
                          format="stars-only"
                          variant="compact"
                          starColor="brand"
                        />
                      </div>
                    </CardWrapper>
                  )}
                  <CardWrapper padding="sm" className="bg-white/10 backdrop-blur-sm border-white/20">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      <Typography variant="bodySmall" className="text-white font-semibold">
                        {storeData?.totalProducts || 0} Products
                      </Typography>
                    </div>
                  </CardWrapper>
                  <CardWrapper padding="sm" className="bg-white/10 backdrop-blur-sm border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                      <Typography variant="bodySmall" className="text-white font-semibold">
                        {storeData?.totalProductsInStock || 0} In Stock
                      </Typography>
                    </div>
                  </CardWrapper>
                  <CardWrapper padding="sm" className="bg-white/10 backdrop-blur-sm border-white/20">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      <Typography variant="bodySmall" className="text-white font-semibold">
                        {storeData?.totalProductsOnSale || 0} On Sale
                      </Typography>
                    </div>
                  </CardWrapper>
                  {storeData?.totalViews && storeData.totalViews > 0 && (
                    <CardWrapper padding="sm" className="bg-white/10 backdrop-blur-sm border-white/20">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        <Typography variant="bodySmall" className="text-white font-semibold">
                          {storeData.totalViews} Views
                        </Typography>
                      </div>
                    </CardWrapper>
                  )}
                  <CardWrapper padding="sm" className="bg-white/10 backdrop-blur-sm border-white/20">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      <Typography variant="bodySmall" className="text-white font-semibold">
                        {storeData?.totalFollowers || 0} Followers
                      </Typography>
                    </div>
                  </CardWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banners Section */}
        {storeHomeExtracted.banners && storeHomeExtracted.banners.length > 0 && (
          <div className="bg-white border-b border-gray-200">
            <div className="container-custom py-6">
              <OfferBanner
                offers={storeHomeExtracted.banners}
                autoPlayInterval={5000}
              />
            </div>
          </div>
        )}

        {/* Flash Sale Section */}
        {flashSaleProducts.length > 0 && (
          <>
            {/* Flash Sale Header with Pattern Background */}
            <div className="relative bg-brand-600 border-b border-gray-200 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                  }}
                />
              </div>

              <div className="container-custom py-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h4" className="text-white font-bold">
                      Flash Sale
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90">
                      Limited time offers - Don&apos;t miss out!
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Flash Sale Products - Outside Pattern Background */}
            <div className="bg-white border-b border-gray-200">
              <div className="container-custom py-8">
                <ProductGrid
                  products={flashSaleProducts.map((p, index) => {
                    const productId = p.productId || 0
                    const nameEn = p.nameEn || ''
                    const nameAr = p.nameAr || ''
                    const rate = p.rate?.toString() || '0'
                    const price = p.price || 0
                    const salePrice = p.salePrice || null
                    const regularPrice = p.hasDiscount && p.price ? p.price : null
                    const image = p.image || p.url || ''
                    const tags = p.tagsString || ''
                    const categoryId = p.categoryId || 0
                    const inStock = p.inStock ?? true
                    const providerIdValue = storeData?.providerId || providerId

                    return {
                      id: productId > 0 ? `${providerIdValue}-${productId}` : `flash-sale-${providerIdValue}-${index}`,
                      title: nameEn || nameAr || 'Product',
                      description: p.shortDescriptionEn || p.shortDescriptionAr || '',
                      provider: {
                        id: storeData?.providerId?.toString() || providerId,
                        name: storeData?.providerNameEn || storeData?.providerNameAr || 'Provider',
                        verified: storeData?.providerIsVerified || false,
                      },
                      price: {
                        original: regularPrice || price,
                        discounted: salePrice || price,
                        currency: 'EGP',
                      },
                      rating: {
                        value: parseFloat(rate || '0'),
                        count: 0,
                      },
                      category: {
                        id: categoryId.toString(),
                        name: '',
                        slug: '',
                      },
                      images: image ? [image] : [],
                      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                      inStock: inStock ?? true,
                      isWishlisted: false,
                      showTopOfferBadge: p.hasDiscount || false,
                    }
                  })}
                  columns={4}
                />
              </div>
            </div>
          </>
        )}

        {/* Memberships Section */}
        {activeMemberships.length > 0 && (
          <div className="bg-white border-b border-gray-200">
            <div className="container-custom py-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-brand-100 rounded-lg p-2">
                  <Crown className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <Typography variant="h4" className="font-bold">
                    Membership Plans
                  </Typography>
                  <Typography variant="bodySmall" textColor="secondary">
                    Choose the perfect plan for your needs
                  </Typography>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeMemberships.map((membership) => (
                  <CardWrapper
                    key={membership.id}
                    padding="lg"
                    className="hover:shadow-xl transition-all border-2 hover:border-brand-300 group"
                  >
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Typography variant="h5" className="flex-1 font-bold">
                            {membership.name}
                          </Typography>
                          {membership.discountPercent && (
                            <Badge
                              variant="default"
                              className="bg-red-500 text-white border-0 flex-shrink-0"
                            >
                              <Percent className="h-3 w-3 mr-1" />
                              {membership.discountPercent}% OFF
                            </Badge>
                          )}
                        </div>
                        {membership.description && (
                          <Typography variant="bodySmall" textColor="secondary" className="line-clamp-2">
                            {membership.description}
                          </Typography>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex-1 space-y-3 mb-6">
                        {membership.discountPercent && (
                          <div className="flex items-center gap-3">
                            <div className="bg-brand-100 rounded-lg p-2">
                              <Percent className="h-4 w-4 text-brand-600 flex-shrink-0" />
                            </div>
                            <Typography variant="bodySmall" className="flex-1">
                              {membership.discountPercent}% discount on all services
                            </Typography>
                          </div>
                        )}
                        {membership.includedSessions && (
                          <div className="flex items-center gap-3">
                            <div className="bg-brand-100 rounded-lg p-2">
                              <Gift className="h-4 w-4 text-brand-600 flex-shrink-0" />
                            </div>
                            <Typography variant="bodySmall" className="flex-1">
                              {membership.includedSessions} included sessions
                            </Typography>
                          </div>
                        )}
                        {membership.creditAmount && (
                          <div className="flex items-center gap-3">
                            <div className="bg-brand-100 rounded-lg p-2">
                              <CreditCard className="h-4 w-4 text-brand-600 flex-shrink-0" />
                            </div>
                            <Typography variant="bodySmall" className="flex-1">
                              {membership.creditAmount.toLocaleString()} EGP credit
                            </Typography>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div className="bg-brand-100 rounded-lg p-2">
                            <Calendar className="h-4 w-4 text-brand-600 flex-shrink-0" />
                          </div>
                          <Typography variant="bodySmall" className="flex-1">
                            Valid for {membership.durationDays} days
                          </Typography>
                        </div>
                      </div>

                      {/* Price and Button */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <Typography variant="h4" className="text-brand-600 font-bold">
                              {membership.price.toLocaleString()} EGP
                            </Typography>
                            {membership.durationDays && (
                              <Typography variant="bodyTiny" textColor="secondary">
                                {Math.round(membership.price / membership.durationDays).toLocaleString()} EGP/day
                              </Typography>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="brand"
                          size="md"
                          className="w-full !text-white font-semibold"
                          onClick={() => {
                            router.push(`/provider/${providerId}/membership/${membership.id}`)
                          }}
                        >
                          Get Membership
                        </Button>
                      </div>
                    </div>
                  </CardWrapper>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
          <div className="container-custom py-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              {/* Search */}
              <div className="flex-1 min-w-0">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'h-9 w-9 rounded-md transition-all',
                    viewMode === 'grid'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'h-9 w-9 rounded-md transition-all',
                    viewMode === 'list'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort */}
              <SelectPopover
                value={sortOption}
                onChange={(value) => setSortOption(value as SortOption)}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' },
                  { value: 'rating', label: 'Highest Rated' },
                  { value: 'name', label: 'Name A-Z' },
                ]}
                placeholder="Sort by"
                className="w-full lg:w-48"
              />

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'relative whitespace-nowrap',
                  showFilters && 'bg-brand-50 border-brand-300 text-brand-600'
                )}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="default"
                    size="sm"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-10 bg-brand-500 text-white border-0"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <CardWrapper padding="md" className="mt-4 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Filter */}
                  {availableCategories.length > 0 && (
                    <div>
                      <Typography variant="bodySmall" className="font-semibold mb-2 text-gray-900">
                        Category
                      </Typography>
                      <SelectPopover
                        value={selectedCategory?.toString() || ''}
                        onChange={(value) =>
                          setSelectedCategory(value ? parseInt(value, 10) : null)
                        }
                        options={[
                          { value: '', label: 'All Categories' },
                          ...availableCategories.map((cat) => {
                            // Handle both CategoryResponse and ProviderCategoryResponse
                            const name = 'nameEn' in cat
                              ? (cat as CategoryResponse).nameEn || (cat as CategoryResponse).nameAr
                              : (cat as ProviderCategoryResponse).customName
                            return {
                              value: cat.id.toString(),
                              label: name || 'Category',
                            }
                          }),
                        ]}
                        placeholder="Select category"
                      />
                    </div>
                  )}

                  {/* Brand Filter */}
                  {availableBrands.length > 0 && (
                    <div>
                      <Typography variant="bodySmall" className="font-semibold mb-2 text-gray-900">
                        Brand
                      </Typography>
                      <SelectPopover
                        value={selectedBrand?.toString() || ''}
                        onChange={(value) =>
                          setSelectedBrand(value ? parseInt(value, 10) : null)
                        }
                        options={[
                          { value: '', label: 'All Brands' },
                          ...availableBrands.map((brand) => {
                            // Handle both ProductBrandResponse and ProviderProductBrandResponse
                            const name = 'nameEn' in brand
                              ? (brand as ProductBrandResponse).nameEn || (brand as ProductBrandResponse).nameAr
                              : (brand as ProviderProductBrandResponse).customName || (brand as ProviderProductBrandResponse).providerCreatedName
                            return {
                              value: brand.id.toString(),
                              label: name || 'Brand',
                            }
                          }),
                        ]}
                        placeholder="Select brand"
                      />
                    </div>
                  )}
                </div>

                {/* Active Filters Display */}
                {(selectedCategory || selectedBrand) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <Typography variant="bodySmall" className="font-semibold text-gray-700">
                        Active filters:
                      </Typography>
                      {selectedCategory && (
                        <Badge variant="secondary" className="gap-1">
                          {(() => {
                            const cat = availableCategories.find(c => c.id === selectedCategory)
                            if (!cat) return 'Category'
                            // Handle both CategoryResponse and ProviderCategoryResponse
                            if ('nameEn' in cat) {
                              return (cat as CategoryResponse).nameEn || (cat as CategoryResponse).nameAr || 'Category'
                            }
                            return (cat as ProviderCategoryResponse).customName || 'Category'
                          })()}
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {selectedBrand && (
                        <Badge variant="secondary" className="gap-1">
                          {(() => {
                            const brand = availableBrands.find(b => b.id === selectedBrand)
                            if (!brand) return 'Brand'
                            // Handle both ProductBrandResponse and ProviderProductBrandResponse
                            if ('nameEn' in brand) {
                              return (brand as ProductBrandResponse).nameEn || (brand as ProductBrandResponse).nameAr || 'Brand'
                            }
                            return (brand as ProviderProductBrandResponse).customName || (brand as ProviderProductBrandResponse).providerCreatedName || 'Brand'
                          })()}
                          <button
                            onClick={() => setSelectedBrand(null)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(null)
                        setSelectedBrand(null)
                      }}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear all filters
                    </Button>
                  </div>
                )}
              </CardWrapper>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="container-custom py-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4">
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'Product' : 'Products'}
            </Typography>
          </div>

          {/* Products Grid/List */}
          {filteredAndSortedProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <ProductGrid
                products={paginatedProducts.map((p, index) => ({
                  id: p.id > 0 ? `${p.providerId || storeData?.providerId || providerId}-${p.id}` : `product-${p.providerId || storeData?.providerId || providerId}-${index}`,
                  title: p.nameEn || p.nameAr || 'Product',
                  description: p.shortDescription || p.bio || '',
                  provider: {
                    id: (p.providerId ?? storeData?.providerId ?? 0).toString(),
                    name: storeData?.providerNameEn || storeData?.providerNameAr || 'Provider',
                    verified: storeData?.providerIsVerified || false,
                  },
                  price: {
                    original: p.regularPrice ?? p.price ?? 0,
                    discounted: p.salePrice ?? p.price ?? 0,
                    currency: 'EGP',
                  },
                  rating: {
                    value: parseFloat(p.rate || '0'),
                    count: p.ratingCount || 0,
                  },
                  category: {
                    id: p.categoryId.toString(),
                    name: '',
                    slug: '',
                  },
                  images: p.image ? [p.image] : [],
                  tags: p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                  inStock: p.inStock ?? true,
                  stockQuantity: p.stockQuantity || undefined,
                  isWishlisted: false,
                  showTopOfferBadge: p.hasDiscount || false,
                }))}
                columns={4}
              />
            ) : (
              <ProductList
                products={paginatedProducts.map((p, index) => ({
                  id: p.id > 0 ? `${p.providerId || storeData?.providerId || providerId}-${p.id}` : `product-${p.providerId || storeData?.providerId || providerId}-${index}`,
                  title: p.nameEn || p.nameAr || 'Product',
                  description: p.shortDescription || p.bio || '',
                  provider: {
                    id: (p.providerId ?? storeData?.providerId ?? 0).toString(),
                    name: storeData?.providerNameEn || storeData?.providerNameAr || 'Provider',
                    verified: storeData?.providerIsVerified || false,
                  },
                  price: {
                    original: p.regularPrice ?? p.price ?? 0,
                    discounted: p.salePrice ?? p.price ?? 0,
                    currency: 'EGP',
                  },
                  rating: {
                    value: parseFloat(p.rate || '0'),
                    count: p.ratingCount || 0,
                  },
                  category: {
                    id: p.categoryId.toString(),
                    name: '',
                    slug: '',
                  },
                  images: p.image ? [p.image] : [],
                  tags: p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                  inStock: p.inStock ?? true,
                  stockQuantity: p.stockQuantity || undefined,
                  isWishlisted: false,
                  showTopOfferBadge: p.hasDiscount || false,
                }))}
              />
            )
          ) : (
            <EmptyState
              title="No products found"
              description={
                searchQuery || selectedCategory || selectedBrand
                  ? 'Try adjusting your filters or search query.'
                  : 'This store doesn\'t have any products yet.'
              }
            />
          )}

          {/* Pagination */}
          {filteredAndSortedProducts.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        {/* Gift Cards Section */}
        {storeData?.giftCards && storeData.giftCards.length > 0 ? (
          <div className="container-custom py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-100 rounded-lg p-2">
                <Gift className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <Typography variant="h4" className="font-bold">
                  Gift Cards
                </Typography>
                <Typography variant="bodySmall" textColor="secondary">
                  Perfect gifts for your loved ones
                </Typography>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storeData.giftCards.map((giftCard) => (
                <CardWrapper
                  key={giftCard.id}
                  padding="lg"
                  className="hover:shadow-xl transition-all border-2 hover:border-brand-300 group relative overflow-hidden"
                >
                  {giftCard.backgroundImageUrl && (
                    <div className="absolute inset-0 opacity-10">
                      <Image
                        src={giftCard.backgroundImageUrl}
                        alt={giftCard.name || 'Gift Card'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <Typography variant="h5" className="font-bold flex-1">
                        {giftCard.name || 'Gift Card'}
                      </Typography>
                      {giftCard.isActive && (
                        <Badge variant="success" size="sm">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-brand-600">
                      <Gift className="h-5 w-5" />
                      <Typography variant="bodySmall" className="font-medium">
                        Available Gift Card Template
                      </Typography>
                    </div>
                  </div>
                </CardWrapper>
              ))}
            </div>
          </div>
        ) : (
          <div className="container-custom py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-100 rounded-lg p-2">
                <Gift className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <Typography variant="h4" className="font-bold">
                  Gift Cards
                </Typography>
              </div>
            </div>
            <EmptyState
              title="No gift cards available"
              description="This store doesn't have any gift cards available at the moment."
            />
          </div>
        )}

        {/* Links Section */}
        {storeData?.providerLinks && storeData.providerLinks.length > 0 ? (
          <div className="container-custom py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-100 rounded-lg p-2">
                <Globe className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <Typography variant="h4" className="font-bold">
                  Links
                </Typography>
                <Typography variant="bodySmall" textColor="secondary">
                  Connect with us on social media and other platforms
                </Typography>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storeData.providerLinks
                .filter(link => link.isPublic && link.url)
                .map((link) => (
                  <CardWrapper
                    key={link.id}
                    padding="md"
                    className="hover:shadow-lg transition-all border-2 hover:border-brand-300 group"
                  >
                    <a
                      href={link.url || '#'}
                      target={link.openInNewTab ? '_blank' : '_self'}
                      rel={link.isExternal ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4"
                    >
                      <div className="bg-brand-100 rounded-lg p-3 flex-shrink-0">
                        <Globe className="h-5 w-5 text-brand-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Typography variant="body" className="font-semibold mb-1 group-hover:text-brand-600 transition-colors">
                          {link.displayName || link.nameEn || link.nameAr || 'Link'}
                        </Typography>
                        {link.displayDescription && (
                          <Typography variant="bodySmall" textColor="secondary" className="line-clamp-1">
                            {link.displayDescription}
                          </Typography>
                        )}
                        {link.url && (
                          <Typography variant="bodyTiny" textColor="secondary" className="mt-1 flex items-center gap-1">
                            {link.url}
                            {link.isExternal && <ExternalLink className="h-3 w-3" />}
                          </Typography>
                        )}
                      </div>
                    </a>
                  </CardWrapper>
                ))}
            </div>
          </div>
        ) : (
          <div className="container-custom py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-100 rounded-lg p-2">
                <Globe className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <Typography variant="h4" className="font-bold">
                  Links
                </Typography>
              </div>
            </div>
            <EmptyState
              title="No links available"
              description="This store doesn't have any public links available."
            />
          </div>
        )}

        {/* Media Section */}
        {storeData?.providerMedia && storeData.providerMedia.length > 0 ? (
          <div className="container-custom py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-100 rounded-lg p-2">
                <ImageIcon className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <Typography variant="h4" className="font-bold">
                  Media Gallery
                </Typography>
                <Typography variant="bodySmall" textColor="secondary">
                  Photos and videos from our store
                </Typography>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {storeData.providerMedia
                .filter(media => media.isPublic)
                .map((media) => {
                  const imageUrl = media.url || media.thumbnailUrl || media.previewUrl
                  const isVideo = media.mediaType === 2 // Assuming 2 is video type
                  return (
                    <CardWrapper
                      key={media.id}
                      className="relative aspect-square overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
                    >
                      {imageUrl ? (
                        <>
                          <Image
                            src={imageUrl}
                            alt={media.alt || media.nameEn || media.nameAr || 'Media'}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                          {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Video className="h-8 w-8 text-white" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          {isVideo ? (
                            <Video className="h-8 w-8 text-gray-400" />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                      )}
                    </CardWrapper>
                  )
                })}
            </div>
          </div>
        ) : (
          <div className="container-custom py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-100 rounded-lg p-2">
                <ImageIcon className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <Typography variant="h4" className="font-bold">
                  Media Gallery
                </Typography>
              </div>
            </div>
            <EmptyState
              title="No media available"
              description="This store doesn't have any media available at the moment."
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
