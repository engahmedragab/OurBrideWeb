'use client'

import { Suspense } from 'react'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { CommunityProfile } from '@/components/community'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { useCommunityProfile } from '@/hooks/community'
import { useSearchParams } from 'next/navigation'
import { useI18nTranslations } from '@/i18n'

// Helper function to determine if a string is a GUID (user ID)
const isGuid = (str: string): boolean => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return guidRegex.test(str)
}

// Helper function to determine if a string is a number
const isNumeric = (str: string): boolean => {
    return /^\d+$/.test(str)
}

function CommunityProfileContent() {
    const t = useI18nTranslations("community")
    const searchParams = useSearchParams()
    const id = searchParams?.get('id')
    const typeParam = searchParams?.get('type') as 'User' | 'Provider' | 'BazaarEvent' | null

    // If no ID provided, show error
    if (!id) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center py-12">
                <div className="w-full max-w-md mx-auto px-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-10 text-center">
                        <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            {t("profile.profileIdRequired")}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                            {t("profile.profileIdRequiredMessage")}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Determine profile type from query param or infer from ID format
    let profileType: 'User' | 'Provider' | 'BazaarEvent' = 'User'
    let profileId: string | number = id

    if (typeParam) {
        // Use explicit type from query parameter
        profileType = typeParam
    } else {
        // Infer type from ID format
        if (isGuid(id)) {
            // GUID format indicates User (GUID is a string)
            profileType = 'User'
            profileId = id
        } else if (isNumeric(id)) {
            // Numeric ID - default to Provider
            // User can specify ?type=BazaarEvent if needed
            profileType = 'Provider'
            profileId = parseInt(id, 10)
        } else {
            // Default to User for any other format
            profileType = 'User'
            profileId = id
        }
    }

    // Convert to number if needed for Provider or BazaarEvent
    if (profileType !== 'User' && typeof profileId === 'string') {
        profileId = parseInt(profileId, 10)
    }

    const {
        data: profile,
        isLoading,
        error,
    } = useCommunityProfile(profileType, profileId, true)

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center py-12">
                <LoadingOverlay open={true} title={t("profile.loading")} />
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center py-12">
                <div className="w-full max-w-md mx-auto px-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-10 text-center">
                        <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            {t("profile.profileNotFoundTitle")}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                            {error instanceof Error
                                ? error.message
                                    : t("profile.profileNotFoundMessage")}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return <CommunityProfile profile={profile} />
}

export function CommunityProfileClient() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
                <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
                    <div className="max-w-7xl mx-auto">
                        <Suspense
                            fallback={
                                <div className="min-h-[60vh] flex items-center justify-center py-12">
                                    <LoadingOverlay open={true}  />
                                </div>
                            }
                        >
                            <CommunityProfileContent />
                        </Suspense>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

