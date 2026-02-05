'use client'

import { Suspense, useState, useEffect } from 'react'
import { UserPageLayout } from '@/components/layout'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { useMineInfo } from '@/hooks/home'
import { ProfilePageContent } from './ProfilePageContent'
import { useI18nTranslations } from '@/i18n'
import { LoadingSpinner } from '@/components/ui'

function ProfileContent() {
  const t = useI18nTranslations('profile')
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
        <LoadingSpinner size="lg" fullScreen={true} open={true} text={t('loading.title')} />
      </div>
    )
  }

  if (error) {
    return (
      <>
        <ErrorModal
          open={showErrorModal}
          title={t('error.title')}
          message={
            error instanceof Error
              ? error.message
              : t('error.message')
          }
          onRetry={() => window.location.reload()}
          onClose={() => setShowErrorModal(false)}
        />
        <div className="min-h-[60vh] flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{t('error.message')}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
            >
              {t('error.retry')}
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
          <p className="text-gray-500 mb-4">{t('empty.title')}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
          >
            {t('empty.reload')}
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
            <LoadingSpinner size="lg" fullScreen={true} open={true} text="Loading profile..." />
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </UserPageLayout>
  )
}
