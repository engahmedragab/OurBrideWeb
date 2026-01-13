/**
 * i18n Configuration
 * 
 * STRICT RULES:
 * - Default locale: 'ar' (Arabic)
 * - Fallback locale: 'en' (English)
 * - Supported locales: ['ar', 'en']
 * - No translations outside /locales folder
 */

export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'
export const fallbackLocale: Locale = 'ar'

/**
 * Locale configuration
 */
export const localeConfig = {
  locales,
  defaultLocale,
  fallbackLocale,
} as const

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

/**
 * Get direction for a locale
 * ar → rtl, en → ltr
 */
export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

/**
 * Check if locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return getDirection(locale) === 'rtl'
}
