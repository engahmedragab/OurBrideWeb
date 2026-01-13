import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Locale-aware navigation helpers
 * 
 * Use these instead of next/navigation's useRouter and Link
 * to ensure routes include the locale prefix.
 */
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
