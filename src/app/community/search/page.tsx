import { Suspense } from 'react'
import { CommunitySearchClient } from './CommunitySearchClient'

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
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      }
    >
      <CommunitySearchClient />
    </Suspense>
  )
}
