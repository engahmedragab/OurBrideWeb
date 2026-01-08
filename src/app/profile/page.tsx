'use client'

import { Suspense, useState, useEffect } from 'react'
import { UserPageLayout } from '@/components/layout'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { useMineInfo } from '@/hooks/home'
import { ProfilePageContent } from './ProfilePageContent'

function ProfileContent() {
  const { data: mineInfo, isLoading, error } = useMineInfo()
  const [showErrorModal, setShowErrorModal] = useState(false)

  // Show error modal when error occurs
  useEffect(() => {
    if (error) {
      setShowErrorModal(true)
    } else {
      setShowErrorModal(false)
    }
  }, [error])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <LoadingOverlay open={true} title="Loading profile..." />
      </div>
    )
  }

  if (error) {
    return (
      <>
        <ErrorModal
          open={showErrorModal}
          title="Failed to Load Profile"
          message={
            error instanceof Error
              ? error.message
              : 'Unable to load your profile information. Please try again later.'
          }
          onRetry={() => window.location.reload()}
          onClose={() => setShowErrorModal(false)}
        />
        <div className="min-h-[60vh] flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Failed to load profile information</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    )
  }

  if (!mineInfo) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No profile data available</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
          >
            Reload
          </button>
        </div>
      </div>
    )
  }

  return <ProfilePageContent mineInfo={mineInfo as Record<string, unknown>} />
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
