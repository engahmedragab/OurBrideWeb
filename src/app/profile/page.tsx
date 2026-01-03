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
    if (error || (!isLoading && !mineInfo)) {
      setShowErrorModal(true)
    } else {
      setShowErrorModal(false)
    }
  }, [error, mineInfo, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <LoadingOverlay open={true} title="Loading profile..." />
      </div>
    )
  }

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
      {!error && mineInfo && <ProfilePageContent mineInfo={mineInfo} />}
    </>
  )
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
