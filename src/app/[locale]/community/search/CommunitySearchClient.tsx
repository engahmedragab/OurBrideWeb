'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { useUnifiedContentSearch } from '@/hooks/community/useUnifiedContentSearch'
import { cn } from '@/lib/utils'
import { PostCard } from '@/components/community/PostCard'
import { ArticleCard } from '@/components/community/ArticleCard'
import { BlogCard } from '@/components/community/BlogCard'
import { ReelCard } from '@/components/community/ReelCard'
import { DecisionGroupCard } from '@/components/community/DecisionGroupCard'
import { ContestCard } from '@/components/community/ContestCard'
import type { UnifiedCommunityContentResponse } from '@/types/responses/community'
import { useI18nTranslations } from '@/i18n'
import { LoadingSpinner } from '@/components/ui'

export function CommunitySearchClient() {
    const t = useI18nTranslations("community.search")
    const router = useRouter()
    const searchParams = useSearchParams()

    // Read initial values from URL params
    const initialQuery = searchParams?.get('q') || ''
    const initialCategoryId = searchParams?.get('categoryId')
    const initialItemId = searchParams?.get('itemId')
    const initialPreparationId = searchParams?.get('preparationId')
    const initialProviderId = searchParams?.get('providerId')
    const initialBazaarEventId = searchParams?.get('bazaarEventId')
    const initialTagIds = searchParams?.get('tagIds')
    const initialPage = searchParams?.get('page')
    const initialPageSize = searchParams?.get('pageSize')

    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const [filters, setFilters] = useState({
        categoryId: initialCategoryId ? parseInt(initialCategoryId, 10) : undefined,
        itemId: initialItemId ? parseInt(initialItemId, 10) : undefined,
        preparationId: initialPreparationId ? parseInt(initialPreparationId, 10) : undefined,
        providerId: initialProviderId ? parseInt(initialProviderId, 10) : undefined,
        bazaarEventId: initialBazaarEventId ? parseInt(initialBazaarEventId, 10) : undefined,
        tagIds: initialTagIds || undefined,
        page: initialPage ? parseInt(initialPage, 10) : 1,
        pageSize: initialPageSize ? parseInt(initialPageSize, 10) : 20,
    })
    const [showFilters, setShowFilters] = useState(false)
    const [activeContentType, setActiveContentType] = useState<string | null>(null)

    // Only call API if we have at least one filter or search query
    // Note: The API doesn't support text search (q parameter), only filter parameters
    const hasFilters = !!(
        filters.categoryId ||
        filters.itemId ||
        filters.preparationId ||
        filters.providerId ||
        filters.bazaarEventId ||
        filters.tagIds
    )

    const {
        data: searchResults,
        isLoading,
        error,
    } = useUnifiedContentSearch({
        ...filters,
        enabled: true, // Always enabled, but API will be called with empty params if no filters
    })

    // Update state when URL params change
    useEffect(() => {
        const query = searchParams?.get('q') || ''
        setSearchQuery(query)

        const categoryId = searchParams?.get('categoryId')
        const itemId = searchParams?.get('itemId')
        const preparationId = searchParams?.get('preparationId')
        const providerId = searchParams?.get('providerId')
        const bazaarEventId = searchParams?.get('bazaarEventId')
        const tagIds = searchParams?.get('tagIds')
        const page = searchParams?.get('page')
        const pageSize = searchParams?.get('pageSize')

        setFilters({
            categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
            itemId: itemId ? parseInt(itemId, 10) : undefined,
            preparationId: preparationId ? parseInt(preparationId, 10) : undefined,
            providerId: providerId ? parseInt(providerId, 10) : undefined,
            bazaarEventId: bazaarEventId ? parseInt(bazaarEventId, 10) : undefined,
            tagIds: tagIds || undefined,
            page: page ? parseInt(page, 10) : 1,
            pageSize: pageSize ? parseInt(pageSize, 10) : 20,
        })
    }, [searchParams])

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateSearchParams()
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            updateSearchParams()
        }
    }

    const updateSearchParams = () => {
        const params = new URLSearchParams()
        if (searchQuery.trim()) {
            params.set('q', searchQuery.trim())
        }
        if (filters.categoryId) params.set('categoryId', String(filters.categoryId))
        if (filters.itemId) params.set('itemId', String(filters.itemId))
        if (filters.preparationId) params.set('preparationId', String(filters.preparationId))
        if (filters.providerId) params.set('providerId', String(filters.providerId))
        if (filters.bazaarEventId) params.set('bazaarEventId', String(filters.bazaarEventId))
        if (filters.tagIds) params.set('tagIds', filters.tagIds)
        if (filters.page && filters.page > 1) params.set('page', String(filters.page))
        if (filters.pageSize && filters.pageSize !== 20) params.set('pageSize', String(filters.pageSize))

        router.push(`/community/search?${params.toString()}`)
    }

    const handleFilterChange = (key: keyof typeof filters, value: number | string | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1, // Reset to first page when filters change
        }))
    }

    const clearFilters = () => {
        setFilters({
            categoryId: undefined,
            itemId: undefined,
            preparationId: undefined,
            providerId: undefined,
            bazaarEventId: undefined,
            tagIds: undefined,
            page: 1,
            pageSize: 20,
        })
        setActiveContentType(null)
    }

    const filteredResults = activeContentType
        ? searchResults?.filter(item => item.contentType.toLowerCase() === activeContentType.toLowerCase())
        : searchResults

    const contentTypes = ['Post', 'Blog', 'Article', 'Reel', 'DecisionGroup', 'Contest']
    const contentTypeCounts = contentTypes.reduce((acc, type) => {
        acc[type] = searchResults?.filter((item: UnifiedCommunityContentResponse) =>
            item.contentType.toLowerCase() === type.toLowerCase()
        ).length || 0
        return acc
    }, {} as Record<string, number>)

    const renderContentCard = (content: UnifiedCommunityContentResponse) => {
        switch (content.contentType.toLowerCase()) {
            case 'post':
                return content.post ? <PostCard key={`post-${content.id}`} post={content.post} /> : null
            case 'blog':
                return content.blog ? <BlogCard key={`blog-${content.id}`} blog={content.blog} /> : null
            case 'article':
                return content.article ? <ArticleCard key={`article-${content.id}`} article={content.article} /> : null
            case 'reel':
                return content.reel ? <ReelCard key={`reel-${content.id}`} reel={content.reel} /> : null
            case 'decisiongroup':
                return content.decisionGroup ? (
                    <DecisionGroupCard key={`decision-group-${content.id}`} decisionGroup={content.decisionGroup} />
                ) : null
            case 'contest':
                return content.contest ? <ContestCard key={`contest-${content.id}`} contest={content.contest} /> : null
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
                <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 md:py-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Search Header */}
                        <div className="space-y-4">
                            <h1 className="text-24 font-normal text-gray-900">{t("title.page")}</h1>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex gap-3">
                                <div className="flex-1">
                                    <SearchInput
                                        placeholder={t("searchBar.placeholder")}
                                        variant="default"
                                        size="lg"
                                        className="w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="brand"
                                    size="lg"
                                    className="px-8"
                                >
                                    <Search className="h-5 w-5 mr-2" />
                                    {t("searchBar.button")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={cn(showFilters && 'bg-brand-50 border-brand-500')}
                                >
                                    <Filter className="h-5 w-5 mr-2" />
                                    {t("searchBar.filtersButton")}
                                </Button>
                            </form>

                            {/* Filters Panel */}
                            {showFilters && (
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-16 font-normal text-gray-900">{t("filters.title")}</h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="text-12"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            {t("filters.clearAll")}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-14 font-normal text-gray-700 mb-2 block">
                                                {t("filters.categoryIdLabel")}
                                            </label>
                                            <input
                                                type="number"
                                                value={filters.categoryId || ''}
                                                onChange={(e) => handleFilterChange('categoryId', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                placeholder={t("filters.categoryIdPlaceholder")}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-14 font-normal text-gray-700 mb-2 block">
                                                {t("filters.itemIdLabel")}
                                            </label>
                                            <input
                                                type="number"
                                                value={filters.itemId || ''}
                                                onChange={(e) => handleFilterChange('itemId', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                placeholder={t("filters.itemIdPlaceholder")}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-14 font-normal text-gray-700 mb-2 block">
                                                {t("filters.providerIdLabel")}
                                            </label>
                                            <input
                                                type="number"
                                                value={filters.providerId || ''}
                                                onChange={(e) => handleFilterChange('providerId', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                placeholder={t("filters.providerIdPlaceholder")}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-14 font-normal text-gray-700 mb-2 block">
                                                {t("filters.tagIdsLabel")}
                                            </label>
                                            <input
                                                type="text"
                                                value={filters.tagIds || ''}
                                                onChange={(e) => handleFilterChange('tagIds', e.target.value || undefined)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                placeholder={t("filters.tagIdsPlaceholder")}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            variant="brand"
                                            size="sm"
                                            onClick={updateSearchParams}
                                        >
                                            {t("searchBar.applyFilters")}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Content Type Filters */}
                            {searchResults && searchResults.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant={activeContentType === null ? 'brand' : 'outline'}
                                        size="sm"
                                        onClick={() => setActiveContentType(null)}
                                    >
                                        {t("searchBar.all")} ({searchResults.length})
                                    </Button>
                                    {contentTypes.map(type => {
                                        const count = contentTypeCounts[type]
                                        if (count === 0) return null
                                        return (
                                            <Button
                                                key={type}
                                                variant={activeContentType === type ? 'brand' : 'outline'}
                                                size="sm"
                                                onClick={() => setActiveContentType(type)}
                                            >
                                                {t(`contentTypes.${type}`)} ({count})
                                            </Button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Search Results */}
                        <div className="space-y-6">
                            {searchQuery && !hasFilters && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                                    <p className="text-14 text-yellow-800">
                                        <strong>{t("notices.textSearchNotSupported.title")}:</strong> {t("notices.textSearchNotSupported.body")}
                                        {/* The search query &quot;{searchQuery}&quot; cannot be used. Please use the filters above to find content by Category ID, Item ID, Provider ID, or Tag IDs. */}
                                    </p>
                                </div>
                            )}
                            {!hasFilters && !searchQuery ? (
                                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                    <p className="text-18 font-normal text-gray-900 mb-2">
                                        {t("empty.startTitle")}
                                    </p>
                                    <p className="text-14 text-gray-600 mb-4">
                                        {t("empty.startSubtitle")}
                                    </p>
                                </div>
                            ) : isLoading ? (
                                <div className="flex justify-center items-center py-12 min-h-[400px]">
                                    <LoadingSpinner open={true} text={t("searchBar.searching")} />
                                </div>
                            ) : error ? (
                                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                    <p className="text-16 font-normal text-gray-900 mb-2">
                                        {t("states.errorTitle")}
                                    </p>
                                    <p className="text-14 text-gray-600">
                                        {error instanceof Error ? error.message : t("states.errorFallback")}
                                    </p>
                                </div>
                            ) : filteredResults && filteredResults.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-14 text-gray-600">
                                            {t("results.found", { count: filteredResults.length })}
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        {filteredResults.map(renderContentCard)}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                    <p className="text-18 font-normal text-gray-900 mb-2">
                                        {t("states.noResultsTitle")}
                                    </p>
                                    <p className="text-14 text-gray-600">
                                        {t("states.noResultsSubtitle")}
                                    </p>
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

