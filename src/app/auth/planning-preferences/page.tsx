'use client'

import { PlanningPreferencesForm } from '@/components/ui/auth/PlanningPreferencesForm'
import { DownloadApp } from '@/components/common'

/**
 * Planning Preferences Page - Collect user preferences after mobile verification
 * User selects services, budget, location, and provides details
 */
export default function PlanningPreferencesPage() {
  return (
    <>
      <div className="w-full max-w-[328px] sm:max-w-[360px] md:max-w-[380px] mx-auto space-y-2.5">
        {/* Planning Preferences Form */}
        <PlanningPreferencesForm
          onBackClick={() => {
            window.history.back()
          }}
        />

        {/* Download App Section - Mobile Only */}
        <div className="lg:hidden w-full pt-4">
          <DownloadApp variant="default" />
        </div>
      </div>
    </>
  )
}

