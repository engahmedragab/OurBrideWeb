import { Alexandria, Poppins } from 'next/font/google'

/**
 * Font Configuration
 * 
 * STRICT RULES:
 * - Arabic → Alexandria
 * - English → Poppins
 * - Fonts are applied automatically based on locale
 * - Components must NEVER choose fonts manually
 */

export const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  variable: '--font-alexandria',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})
