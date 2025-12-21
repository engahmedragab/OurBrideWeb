'use client'

import { PlanningPreferencesForm } from '@/components/ui/auth/PlanningPreferencesForm'
import { DownloadApp } from '@/components/common'

/**
 * Planning Preferences Page - Collect user preferences after mobile verification
 * User selects services, budget, location, and provides details
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPlanningPreferenceInit } from '@/services/profile/profileApi';

export default function PlanningPreferencesPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkPreferenceStatus() {
      const isComplete = await getPlanningPreferenceInit();
      if (isComplete) {
        router.replace('/dashboard');
      } else {
        setChecking(false);
      }
    }
    checkPreferenceStatus();
  }, [router]);

  if (checking) {
    // Optionally show a spinner skeleton
    return null;
  }

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
