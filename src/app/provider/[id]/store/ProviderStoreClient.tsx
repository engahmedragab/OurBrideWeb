'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    Filter,
    Grid3x3,
    List,
    Search,
    X,
    Tag,
    Package,
    Award,
    TrendingUp,
    Calendar,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, ErrorDisplay, Select } from '@/components/ui'
import { ProductGrid } from '@/components/ui/ProductGrid'
import { ProductList } from '@/components/ui/ProductList'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { RatingDisplay } from '@/components/ui/RatingDisplay'
import { cn } from '@/lib/utils'
import { useProviderPublicStore } from '@/hooks/providers/useProviderPublicStore'
import { useProductsHome } from '@/hooks/products/useProductsHome'
import { DEFAULT_CURRENCY } from '@/utils/currency'
import type { ProductHeaderResponse } from '@/types/responses/product-header-response'
import type { CategoryResponse } from '@/types/responses/category-response'
import type { ProductBrandResponse } from '@/types/responses/product-brand-response'

interface ProviderStoreClientProps {
    providerId: string
}

type ViewMode = 'grid' | 'list'
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'name'

export function ProviderStoreClient({ providerId }: ProviderStoreClientProps) {
    const router = useRouter()
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [sortOption, setSortOption] = useState<SortOption>('default')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(false)

    // Fetch provider store data
    const { data: storeData, isLoading: storeLoading, error: storeError } = useProviderPublicStore(
        parseInt(providerId),
        { page: 1, pageSize: 1000 }
    )

    // Fetch products home data for filters
    const { data: productsHomeData, isLoading: homeLoading } = useProductsHome()

    const isLoading = storeLoading || homeLoading

    // Get available filters from products home data (before conditional returns)
    const availableCategories = productsHomeData?.categories || storeData?.providerCategories || []
    const availableBrands = productsHomeData?.brands || storeData?.providerProductBrands || []
    const availableTags = productsHomeData?.tags || []
    const availableAttributes = productsHomeData?.attributes || []

    // Convert ProductResponse from storeData to ProductHeaderResponse format for filtering
    // Note: storeData.products is ProductResponse[] from ProviderPublicStoreResponse
    // This must be called before any conditional returns to maintain hook order
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
                ratingCount: 0, // Not available in ProductResponse
                likes: p.likes || null,
                url: p.url || '',
                price,
                amount: p.amount || null,
                stockQuantity,
                sku: '', // Not available in ProductResponse
                shortDescriptionAr: p.shortDescriptionAr || '',
                shortDescriptionEn: p.shortDescriptionEn || '',
                shortDescription: p.shortDescriptionEn || p.shortDescriptionAr || '',
                isFeatured: p.isFeatured || false,
                published: p.published ?? true,
                visibility: p.visibility as any, // Type compatibility issue between Visibility enums
                buttonText: '',
                youtubeUrl: p.youtubeUrl || '',
                image,
                hasDiscount,
                discountDateStart: p.discountDateStart || null,
                discountDateEnd: p.discountDateEnd || null,
                isTaagerProduct: p.isTaagerProduct || null,
                inStock,
                tags,
                attributes: '', // Not directly available
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
                        p.shortDescriptionEn?.toLowerCase().includes(query) ||
                        p.shortDescriptionAr?.toLowerCase().includes(query)) ??
                    false
            )
        }

        // Apply category filter
        if (selectedCategory) {
            productsList = productsList.filter(p => p.categoryId === selectedCategory)
        }

        // Apply brand filter
        if (selectedBrand) {
            productsList = productsList.filter(p => {
                // Check if product has the selected brand through providerProductBrands
                // This is a simplified check - in a real scenario, you'd need to link products to brands
                return storeData?.providerProductBrands?.some(
                    b => b.productBrandId === selectedBrand && b.isActive
                ) || false
            })
        }

        // Apply tag filter
        if (selectedTag) {
            productsList = productsList.filter(p =>
                p.tags?.includes(selectedTag) ||
                p.providerProductTags?.some(pt => pt.productTagId.toString() === selectedTag) ||
                false
            )
        }

        // Apply attribute filter
        if (selectedAttribute) {
            productsList = productsList.filter(p =>
                p.attributes?.includes(selectedAttribute) ||
                p.providerProductAttributes?.some(pa => pa.productAttributeId.toString() === selectedAttribute) ||
                false
            )
        }

        // Apply sorting
        switch (sortOption) {
            case 'price-asc':
                productsList.sort((a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0))
                break
            case 'price-desc':
                productsList.sort((a, b) => (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0))
                break
            case 'rating':
                productsList.sort((a, b) => {
                    const ratingA = parseFloat(a.rate || '0')
                    const ratingB = parseFloat(b.rate || '0')
                    return ratingB - ratingA
                })
                break
            case 'name':
                productsList.sort((a, b) => (a.nameEn || a.nameAr || '').localeCompare(b.nameEn || b.nameAr || ''))
                break
            default:
                // Keep original order
                break
        }

        return productsList
    }, [
        products,
        storeData?.providerProductBrands,
        searchQuery,
        selectedCategory,
        selectedBrand,
        selectedTag,
        selectedAttribute,
        sortOption,
    ])

    // Get flash sales from products home data
    const flashSales = productsHomeData?.flashSaleGrouped || {}

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedCategory(null)
        setSelectedBrand(null)
        setSelectedTag(null)
        setSelectedAttribute(null)
    }

    const hasActiveFilters =
        searchQuery.trim() !== '' ||
        selectedCategory !== null ||
        selectedBrand !== null ||
        selectedTag !== null ||
        selectedAttribute !== null

    // Show loading state (after all hooks)
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </main>
                <Footer />
            </div>
        )
    }

    // Show error state (after all hooks)
    if (storeError || !storeData) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <ErrorDisplay
                        title="Store not found"
                        message="The provider store you're looking for doesn't exist or has been removed."
                        actionLabel="Back to Provider"
                        actionHref={`/provider/${providerId}`}
                    />
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1">
                {/* Store Banner Section */}
                {storeData?.providerPublicBannerImageUrl && (
                    <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden bg-gradient-to-r from-brand-100 to-purple-100">
                        <Image
                            src={storeData.providerPublicBannerImageUrl}
                            alt={storeData?.providerNameEn || storeData?.providerNameAr || 'Store Banner'}
                            fill
                            className="object-cover"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-end">
                            <div className="container-custom pb-6">
                                <div className="flex items-center gap-3">
                                    {storeData?.providerPublicLogoImageUrl && (
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                                            <Image
                                                src={storeData.providerPublicLogoImageUrl}
                                                alt={storeData?.providerNameEn || storeData?.providerNameAr || 'Logo'}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h1 className="text-24 md:text-32 font-bold text-white mb-1 drop-shadow-lg">
                                            {storeData?.providerNameEn || storeData?.providerNameAr || 'Provider Store'}
                                        </h1>
                                        {storeData?.providerRate && (
                                            <div className="flex items-center gap-2">
                                                <RatingDisplay
                                                    rating={storeData.providerRate}
                                                    size="sm"
                                                    format="default"
                                                    variant="compact"
                                                    starColor="yellow"
                                                />
                                                <span className="text-14 text-white/90">
                                                    ({storeData.totalProducts || 0} products)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Store Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="container-custom py-4">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-14 text-gray-600 mb-3">
                            <button onClick={() => router.push('/')} className="hover:text-brand-600 transition-colors">
                                Home
                            </button>
                            <span>/</span>
                            <button onClick={() => router.push('/providers')} className="hover:text-brand-600 transition-colors">
                                Providers
                            </button>
                            <span>/</span>
                            <button onClick={() => router.push(`/provider/${providerId}`)} className="hover:text-brand-600 transition-colors">
                                {storeData?.providerNameEn || storeData?.providerNameAr || 'Provider'}
                            </button>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Store</span>
                        </div>

                        {!storeData?.providerPublicBannerImageUrl && (
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-28 md:text-36 font-bold text-gray-900 mb-2">
                                        {storeData?.providerNameEn || storeData?.providerNameAr || 'Provider Store'}
                                    </h1>
                                    <p className="text-16 text-gray-600 max-w-2xl">
                                        {storeData?.providerDescriptionEn || storeData?.providerDescriptionAr || ''}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Store Stats */}
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-brand-600" />
                                <span className="text-14 font-semibold text-gray-900">{storeData?.totalProducts || 0}</span>
                                <span className="text-14 text-gray-600">Products</span>
                            </div>
                            {(storeData?.totalProductsInStock || 0) > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-14 text-gray-600">{storeData?.totalProductsInStock || 0} In Stock</span>
                                </div>
                            )}
                            {(storeData?.totalProductsOnSale || 0) > 0 && (
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-red-600" />
                                    <span className="text-14 font-semibold text-red-600">{storeData?.totalProductsOnSale || 0} On Sale</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Statistics Section - E-commerce Style */}
                {productsHomeData?.statistics && (
                    <div className="bg-gradient-to-r from-brand-50 to-purple-50 border-b border-gray-200">
                        <div className="container-custom py-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {productsHomeData.statistics.customers && (
                                    <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="text-32 font-bold text-brand-600 mb-1">
                                            {productsHomeData.statistics.customers}
                                        </div>
                                        <div className="text-14 text-gray-600 font-medium">Happy Customers</div>
                                    </div>
                                )}
                                {productsHomeData.statistics.orders && (
                                    <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="text-32 font-bold text-brand-600 mb-1">
                                            {productsHomeData.statistics.orders}
                                        </div>
                                        <div className="text-14 text-gray-600 font-medium">Total Orders</div>
                                    </div>
                                )}
                                {productsHomeData.statistics.reviews && (
                                    <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="text-32 font-bold text-brand-600 mb-1">
                                            {productsHomeData.statistics.reviews}
                                        </div>
                                        <div className="text-14 text-gray-600 font-medium">Customer Reviews</div>
                                    </div>
                                )}
                                {productsHomeData.statistics.rating > 0 && (
                                    <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <RatingDisplay
                                                rating={productsHomeData.statistics.rating}
                                                size="md"
                                                format="value-only"
                                                variant="compact"
                                                valueClassName="text-28 font-bold text-brand-600"
                                            />
                                        </div>
                                        <div className="text-14 text-gray-600 font-medium">Average Rating</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Flash Sales Section - E-commerce Style */}
                {Object.keys(flashSales).length > 0 && (
                    <div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 border-b border-gray-200">
                        <div className="container-custom py-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-24 font-bold text-white">Flash Sales</h2>
                                    <p className="text-14 text-white/90">Limited time offers - Don't miss out!</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.entries(flashSales).slice(0, 4).map(([date, products]) => (
                                    <div key={date} className="bg-white rounded-xl p-5 border border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                            <Calendar className="h-4 w-4 text-red-600" />
                                            <span className="text-14 font-bold text-gray-900">
                                                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {products.slice(0, 3).map(product => (
                                                <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                        {product.image ? (
                                                            <Image
                                                                src={product.image}
                                                                alt={product.nameEn || product.nameAr || 'Product'}
                                                                fill
                                                                className="object-cover"
                                                                sizes="48px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                                <Package className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-13 font-semibold text-gray-900 truncate mb-1">
                                                            {product.nameEn || product.nameAr}
                                                        </p>
                                                        <PriceDisplay
                                                            original={product.regularPrice || undefined}
                                                            discounted={product.salePrice || product.price || 0}
                                                            currency={DEFAULT_CURRENCY}
                                                            size="xs"
                                                            variant="compact"
                                                            showOriginal={product.hasDiscount}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area - E-commerce Layout */}
                <div className="container-custom py-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar Filters - E-commerce Style */}
                        <aside className={cn(
                            "lg:w-64 flex-shrink-0",
                            showFilters ? "block" : "hidden lg:block"
                        )}>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-20">
                                {/* Filters Header */}
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-18 font-bold text-gray-900 flex items-center gap-2">
                                        <Filter className="h-5 w-5 text-brand-600" />
                                        Filters
                                    </h2>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-14 text-red-600 hover:text-red-700 font-medium"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Filter Content */}
                                <div className="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
                                    {/* Category Filter */}
                                    {availableCategories.length > 0 && (
                                        <div>
                                            <label className="block text-14 font-semibold text-gray-900 mb-2">
                                                <Package className="h-4 w-4 inline mr-1" />
                                                Category
                                            </label>
                                            <Select
                                                value={selectedCategory || ''}
                                                onChange={e => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                                                size="md"
                                                variant="default"
                                            >
                                                <option value="">All Categories</option>
                                                {availableCategories.map(cat => {
                                                    // Handle both CategoryResponse and ProviderCategoryResponse
                                                    const name = 'nameEn' in cat ? (cat.nameEn || cat.nameAr) : ('customName' in cat ? cat.customName : null)
                                                    return (
                                                        <option key={cat.id} value={cat.id}>
                                                            {name || `Category ${cat.id}`}
                                                        </option>
                                                    )
                                                })}
                                            </Select>
                                        </div>
                                    )}

                                    {/* Brand Filter */}
                                    {availableBrands.length > 0 && (
                                        <div>
                                            <label className="block text-14 font-semibold text-gray-900 mb-2">
                                                <Award className="h-4 w-4 inline mr-1" />
                                                Brand
                                            </label>
                                            <Select
                                                value={selectedBrand || ''}
                                                onChange={e => setSelectedBrand(e.target.value ? parseInt(e.target.value) : null)}
                                                size="md"
                                                variant="default"
                                            >
                                                <option value="">All Brands</option>
                                                {availableBrands.map(brand => {
                                                    // Handle both ProductBrandResponse and ProviderProductBrandResponse
                                                    const name = 'nameEn' in brand ? (brand.nameEn || brand.nameAr) : ('customName' in brand ? brand.customName : null)
                                                    return (
                                                        <option key={brand.id} value={brand.id}>
                                                            {name || `Brand ${brand.id}`}
                                                        </option>
                                                    )
                                                })}
                                            </Select>
                                        </div>
                                    )}

                                    {/* Tag Filter */}
                                    {availableTags.length > 0 && (
                                        <div>
                                            <label className="block text-14 font-semibold text-gray-900 mb-2">
                                                <Tag className="h-4 w-4 inline mr-1" />
                                                Tag
                                            </label>
                                            <Select
                                                value={selectedTag || ''}
                                                onChange={e => setSelectedTag(e.target.value || null)}
                                                size="md"
                                                variant="default"
                                            >
                                                <option value="">All Tags</option>
                                                {availableTags.map(tag => (
                                                    <option key={tag.id} value={tag.id.toString()}>
                                                        {tag.nameEn || tag.nameAr || `Tag ${tag.id}`}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>
                                    )}

                                    {/* Attribute Filter */}
                                    {availableAttributes.length > 0 && (
                                        <div>
                                            <label className="block text-14 font-semibold text-gray-900 mb-2">
                                                <Filter className="h-4 w-4 inline mr-1" />
                                                Attribute
                                            </label>
                                            <Select
                                                value={selectedAttribute || ''}
                                                onChange={e => setSelectedAttribute(e.target.value || null)}
                                                size="md"
                                                variant="default"
                                            >
                                                <option value="">All Attributes</option>
                                                {availableAttributes.map(attr => (
                                                    <option key={attr.id} value={attr.id.toString()}>
                                                        {attr.nameEn || attr.nameAr || `Attribute ${attr.id}`}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="flex-1 min-w-0">
                            {/* Search and Toolbar */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 p-4">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    {/* Search Bar */}
                                    <div className="flex-1 w-full relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-14"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                            >
                                                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Toolbar */}
                                    <div className="flex items-center gap-3">
                                        {/* Sort */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-14 text-gray-600 whitespace-nowrap">Sort:</span>
                                            <Select
                                                value={sortOption}
                                                onChange={e => setSortOption(e.target.value as SortOption)}
                                                size="md"
                                                variant="default"
                                                className="min-w-[160px]"
                                            >
                                                <option value="default">Default</option>
                                                <option value="price-asc">Price: Low to High</option>
                                                <option value="price-desc">Price: High to Low</option>
                                                <option value="rating">Rating</option>
                                                <option value="name">Name</option>
                                            </Select>
                                        </div>

                                        {/* View Toggle */}
                                        <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={cn(
                                                    "p-2 rounded transition-colors",
                                                    viewMode === 'grid'
                                                        ? "bg-brand-600 text-white"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                )}
                                            >
                                                <Grid3x3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={cn(
                                                    "p-2 rounded transition-colors",
                                                    viewMode === 'list'
                                                        ? "bg-brand-600 text-white"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                )}
                                            >
                                                <List className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Mobile Filter Toggle */}
                                        <Button
                                            variant={showFilters ? 'brand' : 'outline'}
                                            size="sm"
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="lg:hidden flex items-center gap-2"
                                        >
                                            <Filter className="h-4 w-4" />
                                            Filters
                                        </Button>
                                    </div>
                                </div>

                                {/* Results Count */}
                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                    <span className="text-14 text-gray-600">
                                        Showing <span className="font-semibold text-gray-900">{filteredAndSortedProducts.length}</span> of{' '}
                                        <span className="font-semibold text-gray-900">{storeData?.totalProducts || 0}</span> products
                                    </span>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-14 text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                        >
                                            <X className="h-4 w-4" />
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Products Grid/List */}
                            {filteredAndSortedProducts.length > 0 ? (
                                viewMode === 'grid' ? (
                                    <ProductGrid
                                        products={filteredAndSortedProducts.map(p => {
                                            const productId = p.productId?.toString() || p.id?.toString() || '0'
                                            const title = p.nameEn || p.nameAr || p.name || 'Product'
                                            const images = p.image ? [p.image] : []
                                            const originalPrice = p.regularPrice || p.price || 0
                                            const discountedPrice = p.salePrice || p.price || originalPrice
                                            const tags = p.tags ? (typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()) : []) : []

                                            return {
                                                id: productId,
                                                title,
                                                description: p.shortDescriptionEn || p.shortDescriptionAr || p.shortDescription || '',
                                                images,
                                                provider: {
                                                    id: storeData?.providerId?.toString() || '0',
                                                    name: storeData?.providerNameEn || storeData?.providerNameAr || 'Provider',
                                                    verified: storeData?.providerIsVerified || false,
                                                },
                                                rating: {
                                                    value: parseFloat(p.rate || '0'),
                                                    count: p.ratingCount || 0,
                                                },
                                                price: {
                                                    original: originalPrice,
                                                    discounted: discountedPrice,
                                                    currency: DEFAULT_CURRENCY,
                                                },
                                                category: {
                                                    id: p.categoryId?.toString() || '',
                                                    name: '',
                                                    slug: '',
                                                },
                                                tags,
                                                inStock: p.inStock ?? true,
                                                stockQuantity: p.stockQuantity || undefined,
                                                sku: p.sku || undefined,
                                                showTopOfferBadge: p.hasDiscount || false,
                                                isWishlisted: false,
                                                isFavorite: false,
                                            }
                                        })}
                                        columns={4}
                                    />
                                ) : (
                                    <ProductList
                                        products={filteredAndSortedProducts.map(p => {
                                            const productId = p.productId?.toString() || p.id?.toString() || '0'
                                            const title = p.nameEn || p.nameAr || p.name || 'Product'
                                            const images = p.image ? [p.image] : []
                                            const originalPrice = p.regularPrice || p.price || 0
                                            const discountedPrice = p.salePrice || p.price || originalPrice
                                            const tags = p.tags ? (typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()) : []) : []

                                            return {
                                                id: productId,
                                                title,
                                                description: p.shortDescriptionEn || p.shortDescriptionAr || p.shortDescription || '',
                                                images,
                                                provider: {
                                                    id: storeData?.providerId?.toString() || '0',
                                                    name: storeData?.providerNameEn || storeData?.providerNameAr || 'Provider',
                                                    verified: storeData?.providerIsVerified || false,
                                                },
                                                rating: {
                                                    value: parseFloat(p.rate || '0'),
                                                    count: p.ratingCount || 0,
                                                },
                                                price: {
                                                    original: originalPrice,
                                                    discounted: discountedPrice,
                                                    currency: DEFAULT_CURRENCY,
                                                },
                                                category: {
                                                    id: p.categoryId?.toString() || '',
                                                    name: '',
                                                    slug: '',
                                                },
                                                tags,
                                                inStock: p.inStock ?? true,
                                                stockQuantity: p.stockQuantity || undefined,
                                                sku: p.sku || undefined,
                                                showTopOfferBadge: p.hasDiscount || false,
                                                isWishlisted: false,
                                                isFavorite: false,
                                            }
                                        })}
                                    />
                                )
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-20 font-semibold text-gray-900 mb-2">No products found</h3>
                                    <p className="text-16 text-gray-600 mb-4">
                                        {hasActiveFilters
                                            ? 'Try adjusting your filters to see more products.'
                                            : 'This store currently has no products available.'}
                                    </p>
                                    {hasActiveFilters && (
                                        <Button variant="outline" onClick={clearFilters}>
                                            Clear Filters
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

