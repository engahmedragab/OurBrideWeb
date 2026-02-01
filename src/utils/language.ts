// Language utility functions

// Store locale in a way that's accessible from both server and client
// This will be set by the client-side code after hydration
let cachedLocale: string | null = null

/**
 * Set the current locale (called from client-side after hydration)
 */
export const setCurrentLocale = (locale: string): void => {
  if (typeof window !== 'undefined') {
    cachedLocale = locale
  }
}

/**
 * Get current language code from URL pathname
 * Priority: URL locale > localStorage setting > browser language > default 'en'
 * 
 * Note: This function is client-side only. For SSR, use the locale from Next.js context.
 */
export const getCurrentLanguage = (): string => {
  // During SSR, return default 'en' to avoid hydration mismatches
  if (typeof window === 'undefined') return 'en'
  
  // Use cached locale if available (set by client-side code)
  if (cachedLocale) {
    return cachedLocale
  }
  
  // First, try to get locale from URL pathname (Next.js i18n routing)
  // URL format: /ar/... or /en/...
  const pathname = window.location.pathname
  const localeMatch = pathname.match(/^\/(ar|en)(\/|$)/)
  if (localeMatch && localeMatch[1]) {
    const locale = localeMatch[1].toLowerCase()
    cachedLocale = locale
    return locale
  }
  
  // Check if user has set a language preference in localStorage
  const savedLanguage = localStorage.getItem('app_language')
  if (savedLanguage) {
    // Map full language names to codes if needed
    const languageMap: Record<string, string> = {
      'English': 'en',
      'Arabic': 'ar',
      'French': 'fr',
      'Spanish': 'es',
    }
    const locale = languageMap[savedLanguage] || savedLanguage.toLowerCase().slice(0, 2)
    cachedLocale = locale
    return locale
  }
  
  // Fallback to browser language
  const browserLang = navigator.language || navigator.languages?.[0] || 'en'
  // Extract language code (e.g., 'en-US' -> 'en')
  const locale = browserLang.split('-')[0].toLowerCase()
  cachedLocale = locale
  return locale
}

/**
 * Get language code for API (ensures valid format)
 * 
 * During SSR, this returns 'en' to avoid hydration mismatches.
 * On the client, it reads from the URL pathname.
 */
export const getApiLanguage = (): string => {
  const lang = getCurrentLanguage()
  // Ensure it's a valid 2-letter code, default to 'en'
  return /^[a-z]{2}$/i.test(lang) ? lang : 'en'
}

