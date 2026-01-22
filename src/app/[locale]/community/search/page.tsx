import { Suspense } from 'react'
import { CommunitySearchClient } from './CommunitySearchClient'

import { LoadingSpinner } from '@/components/ui'

// Generate static params for static export
export function generateStaticParams() {
    return []
}

export default function CommunitySearchPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex flex-col bg-gray-50">
                    <div className="flex-1 flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            }
        >
            <CommunitySearchClient />
        </Suspense>
    )
}

