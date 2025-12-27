'use client'

import { Suspense } from 'react'
import { CommunityProfileClient } from './[id]/CommunityProfileClient'

export default function CommunityProfilePage() {
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
      <CommunityProfileClient />
    </Suspense>
  )
}
