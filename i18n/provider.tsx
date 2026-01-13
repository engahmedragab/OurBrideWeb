'use client'

import { NextIntlClientProvider } from 'next-intl'
import { routing } from './routing'
import { getDirection, type Locale } from './config'
import { alexandria, poppins } from './fonts'

/**
 * I18nProvider Props
 */
interface I18nProviderProps {
  locale: Locale
  messages: Record<string, any>
  children: React.ReactNode
}

/**
 * I18nProvider
 * 
 * Single source of truth for:
 * - Locale
 * - Direction (RTL/LTR)
 * - Font (Alexandria/Poppins)
 * - Messages
 * 
 * STRICT RULE: All components must use this provider.
 * No duplicate providers allowed.
 */
export function I18nProvider({ locale, messages, children }: I18nProviderProps) {
  // Validate locale
  if (!routing.locales.includes(locale)) {
    return null
  }

  // Get direction for locale
  const direction = getDirection(locale)

  // Get font class name for locale
  const fontClassName = locale === 'ar' ? alexandria.className : poppins.className

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className={fontClassName} dir={direction}>
        {children}
      </div>
    </NextIntlClientProvider>
  )
}

/**
 * Export helpers for components
 */
export { getDirection, isRTL } from './config'
export type { Locale } from './config'
