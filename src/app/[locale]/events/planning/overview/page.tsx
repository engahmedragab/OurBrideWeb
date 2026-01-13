'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { LoadingOverlay, LoadingSpinner } from '@/components/ui'

function OverviewPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams?.get('eventId')

  useEffect(() => {
    if (eventId) {
      // Redirect to my-events with the eventId selected
      router.replace(`/dashboard/my-events?eventId=${eventId}`)
    } else {
      // If no eventId, redirect to my-events list
      router.replace('/dashboard/my-events')
    }
  }, [eventId, router])

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingOverlay open={true} title="Redirecting to event overview..." />
      </div>
    </div>
  )
}

/**
 * Overview Page - Redirects to my-events with eventId
 * The overview content has been merged into the my-events page
 * This page redirects to maintain backward compatibility
 */
export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" text="Loading..." />
          </div>
        </div>
      }
    >
      <OverviewPageContent />
    </Suspense>
  )
}
