// Language utility functions

/**
 * Get current language code
 * Priority: localStorage setting > browser language > default 'en'
 */
export const getCurrentLanguage = (): string => {
  if (typeof window === 'undefined') return 'en'

  // Check if user has set a language preference in localStorage
  const savedLanguage = localStorage.getItem('app_language')
  if (savedLanguage) {
    // Map full language names to codes if needed
    const languageMap: Record<string, string> = {
      English: 'en',
      Arabic: 'ar',
      French: 'fr',
      Spanish: 'es',
    }
    return languageMap[savedLanguage] || savedLanguage.toLowerCase().slice(0, 2)
  }

  // Fallback to browser language
  const browserLang = navigator.language || navigator.languages?.[0] || 'en'
  // Extract language code (e.g., 'en-US' -> 'en')
  return browserLang.split('-')[0].toLowerCase()
}

/**
 * Get language code for API (ensures valid format)
 */
export const getApiLanguage = (): string => {
  const lang = getCurrentLanguage()
  // Ensure it's a valid 2-letter code, default to 'en'
  return /^[a-z]{2}$/i.test(lang) ? lang : 'en'
}
