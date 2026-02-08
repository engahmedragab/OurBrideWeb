import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

/**
 * Request Configuration for next-intl
 * 
 * This file is required by next-intl to configure how messages are loaded.
 * It's referenced in next.config.js via the next-intl plugin.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // This function runs for every request
  // The locale is determined by the middleware/routing
  let locale = await requestLocale

  // Ensure we have a valid locale
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../locales/${locale}/common.json`)).default,
    // Configure timeZone to prevent environment mismatch errors
    // Using UTC as default, can be customized per locale if needed
    timeZone: 'UTC',
  }
})
