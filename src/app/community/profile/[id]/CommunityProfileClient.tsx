'use client'

import { Suspense } from 'react'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { CommunityProfile } from '@/components/community'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { useCommunityProfile } from '@/hooks/community'
import { useSearchParams } from 'next/navigation'

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
    const searchParams = useSearchParams()
    const id = searchParams?.get('id')
    const typeParam = searchParams?.get('type') as 'User' | 'Provider' | 'BazaarEvent' | null

    // If no ID provided, show error
    if (!id) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-18 font-semibold text-gray-900 mb-2">
                        Profile ID required
                    </p>
                    <p className="text-14 text-gray-600">
                        Please provide a profile ID in the URL.
                    </p>
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
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingOverlay open={true} title="Loading profile..." />
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-18 font-semibold text-gray-900 mb-2">
                        Profile not found
                    </p>
                    <p className="text-14 text-gray-600">
                        {error instanceof Error
                            ? error.message
                            : 'The profile you are looking for does not exist.'}
                    </p>
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
                <div className="container-custom py-6 md:py-8">
                    <div className="max-w-7xl mx-auto">
                        <Suspense
                            fallback={
                                <div className="min-h-[60vh] flex items-center justify-center min-h-[400px]">
                                    <LoadingOverlay open={true} title="Loading profile..." />
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

