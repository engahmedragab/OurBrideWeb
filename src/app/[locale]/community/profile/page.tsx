'use client'

import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/auth/hooks'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { useI18nTranslations } from '@/i18n'
import { LoadingSpinner } from '@/components/ui'

export default function CommunityProfilePage() {
  const t = useI18nTranslations("common")
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      router.replace(`/community/profile?id=${user.id}&type=User`)
    } else {
      // If not authenticated, redirect to login or community home
      router.replace('/community')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner open={true} text={t("loading")} />
      </div>
    </div>
  )
}
