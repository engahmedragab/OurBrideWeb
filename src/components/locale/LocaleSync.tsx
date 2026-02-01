'use client'

import { useEffect } from 'react'
import { useI18nLocale } from '@/i18n/hooks'
import { setCurrentLocale } from '@/utils/language'

/**
 * LocaleSync Component
 * 
 * This component syncs the current locale from Next.js routing
 * to the API language utility, ensuring API calls use the correct locale.
 * 
 * It runs only on the client side after hydration to avoid SSR mismatches.
 */
export function LocaleSync() {
  const locale = useI18nLocale()
  
  useEffect(() => {
    // Set the locale for API calls after component mounts (client-side only)
    setCurrentLocale(locale)
  }, [locale])
  
  // This component doesn't render anything
  return null
}
