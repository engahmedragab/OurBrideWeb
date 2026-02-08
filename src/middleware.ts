import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Protected routes that require authentication
 * Note: These paths are relative to the locale prefix (e.g., /ar/cart, /en/cart)
 */
const protectedRoutes = [
  '/cart',
  '/wishlist',
  '/profile',
  '/planning',
  '/messages',
  '/orders',
  '/booking',
  '/checkout',
  '/referrals',
]

/**
 * Check if a path matches any of the protected routes
 * Handles both locale-prefixed and non-prefixed paths
 */
function isProtectedRoute(pathname: string): boolean {
  // Remove locale prefix if present (e.g., /ar/cart -> /cart)
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, '') || pathname
  return protectedRoutes.some(route => pathWithoutLocale.startsWith(route))
}

/**
 * Check if user is authenticated by checking for auth token cookie
 */
function isAuthenticated(request: NextRequest): boolean {
  // Check for auth token in cookies
  const token = request.cookies.get('auth_token')?.value
  
  // Also check for user data cookie as a fallback
  const userData = request.cookies.get('user_data')?.value
  
  return !!(token || userData)
}

/**
 * Combined middleware: i18n routing + authentication
 * 
 * Order of execution:
 * 1. i18n middleware handles locale detection and routing
 * 2. Auth middleware checks protected routes
 */
const intlMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public assets and API routes (skip i18n and auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Allow files (images, etc.)
  ) {
    return NextResponse.next()
  }

  // First, handle i18n routing - this will automatically redirect routes without locale
  // (e.g., /dashboard/my-events -> /en/dashboard/my-events)
  const intlResponse = intlMiddleware(request)
  
  // If i18n middleware redirects (307 or 308), return that redirect immediately
  // This handles locale prefix redirects
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse
  }

  // Extract locale from pathname for auth checks
  // At this point, the pathname should have a locale prefix
  const localeMatch = pathname.match(/^\/(ar|en)(\/|$)/)
  const locale = localeMatch ? localeMatch[1] : null
  const pathWithoutLocale = locale ? pathname.replace(`/${locale}`, '') || '/' : pathname

  // Check if route is protected (using path without locale)
  if (isProtectedRoute(pathWithoutLocale)) {
    // Check if user is authenticated
    if (!isAuthenticated(request)) {
      // Redirect to login page with return URL (preserve locale)
      const loginPath = locale ? `/${locale}/auth/login` : '/auth/login'
      const loginUrl = new URL(loginPath, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Return the i18n response (which may have been modified)
  return intlResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
