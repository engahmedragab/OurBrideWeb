'use client'

import { Suspense } from 'react'
import { UserPageLayout } from '@/components/layout'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { useMineInfo } from '@/hooks/home'
import { ProfilePageContent } from './ProfilePageContent'

function ProfileContent() {
  const { data: mineInfo, isLoading, error } = useMineInfo()

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <LoadingOverlay open={true} title="Loading profile..." />
      </div>
    )
  }

  if (error || !mineInfo) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-10 text-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Failed to load profile
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              {error instanceof Error
                ? error.message
                : 'Unable to load your profile information. Please try again later.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <ProfilePageContent mineInfo={mineInfo} />
}

export default function ProfilePage() {
  return (
    <UserPageLayout>
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center py-12">
            <LoadingOverlay open={true} title="Loading profile..." />
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </UserPageLayout>
  )
}
