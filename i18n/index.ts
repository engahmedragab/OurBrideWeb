/**
 * i18n Foundation - Public API
 * 
 * This is the main entry point for all i18n functionality.
 * Developers should import from this file only.
 * 
 * STRICT RULES:
 * - All translations must be in /locales folder
 * - Use semantic, nested keys
 * - No hardcoded strings in components
 * - Use hooks from this module
 */

// Configuration
export { locales, defaultLocale, fallbackLocale, localeConfig } from './config'
export type { Locale } from './config'

// Routing
export { routing } from './routing'

// Navigation (locale-aware Link, useRouter, etc.)
export { Link, redirect, usePathname, useRouter } from './navigation'

// Hooks (for components)
export {
  useI18nLocale,
  useI18nTranslations,
  useIsRTL,
  useDirection,
  useLocale,
  useTranslations,
} from './hooks'

// Provider (internal use - used in layout)
export { I18nProvider } from './provider'

// Components (internal use - used in layout)
export { LocaleHtmlAttributes } from './components'

// Helpers
export { getDirection, isRTL, isValidLocale } from './config'
