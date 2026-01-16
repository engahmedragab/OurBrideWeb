'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { getPlanningPreferenceInit } from '@/services/profile/profileApi'

import { PlanningPreferencesForm } from '@/components/ui/auth/PlanningPreferencesForm'
import { DownloadApp } from '@/components/common'
import { AuthErrorDisplay } from '@/components/ui/auth/index'
import { useToast } from '@/components/ui/Toaster'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { useI18nTranslations } from '@/i18n'
export default function PlanningPreferencesPage() {
  const router = useRouter()
  const toast = useToast()
  const t = useI18nTranslations('auth')
  const [checking, setChecking] = useState(true)

  // ✅ local error for AuthErrorDisplay
  const [error, setError] = useState<string | null>(null)

  // ✅ for preventing duplicate toast without useRef
  const [lastToastedError, setLastToastedError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function checkPreferenceStatus() {
      try {
        setChecking(true)
        setError(null)

        const isComplete = await getPlanningPreferenceInit()

        if (!isMounted) return

        if (isComplete) {
          router.replace('/dashboard')
          return
        }

        setChecking(false)
      } catch (err) {
        if (!isMounted) return

        const msg =
          err instanceof Error
            ? err.message
            : t('planningPreferences.errors.somethingWentWrong')

        setError(msg)
        setChecking(false)
      }
    }

    checkPreferenceStatus()

    return () => {
      isMounted = false
    }
  }, [router])

  // ✅ Auto-hide error after 5s
  useEffect(() => {
    if (!error) return

    const id = window.setTimeout(() => {
      setError(null)
    }, 5000)

    return () => window.clearTimeout(id)
  }, [error])

  // ✅ Toast once per error (no useRef)
  useEffect(() => {
    if (!error) {
      setLastToastedError(null)
      return
    }

    if (error !== lastToastedError) {
      
      setLastToastedError(error)
    }
  }, [error, lastToastedError, toast])

  if (checking) {
    return (
      <>
        <LoadingOverlay open title={t('common.loading')} subtitle={t('common.pleaseWait')} />
      </>
    )
  }

  return (
    <>
      <div className="w-full max-w-[328px] sm:max-w-[360px] md:max-w-[520px] mx-auto space-y-2.5">
        {/* ✅ Error visible above the form */}
        <AuthErrorDisplay error={error} />

        <PlanningPreferencesForm
          onBackClick={() => {
            window.history.back()
          }}
        />

        <div className="lg:hidden w-full pt-4">
          <DownloadApp variant="default" />
        </div>
      </div>
    </>
  )
}
