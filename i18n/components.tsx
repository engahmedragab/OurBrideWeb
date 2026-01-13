'use client'

import { useEffect } from 'react'
import type { Locale } from './config'

/**
 * LocaleHtmlAttributes Component
 * 
 * Sets the lang and dir attributes on the <html> element dynamically.
 * This is necessary because Next.js requires html/body in root layout,
 * but we need locale-specific attributes.
 */
interface LocaleHtmlAttributesProps {
  locale: Locale
  direction: 'rtl' | 'ltr'
  children: React.ReactNode
}

export function LocaleHtmlAttributes({
  locale,
  direction,
  children,
}: LocaleHtmlAttributesProps) {
  useEffect(() => {
    // Set lang and dir attributes on html element
    const html = document.documentElement
    html.setAttribute('lang', locale)
    html.setAttribute('dir', direction)
  }, [locale, direction])

  return <>{children}</>
}
