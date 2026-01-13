'use client'

import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'

/**
 * Gift Center Default Page
 * Redirects to coupons page as the default tab
 */
export default function GiftCenterPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/gift-center/coupons')
  }, [router])

  return null
}
