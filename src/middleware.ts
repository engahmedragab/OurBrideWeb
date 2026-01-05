import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Protected routes that require authentication
 */
const protectedRoutes = [
  '/cart',
  '/wishlist',
  '/profile',
  '/dashboard',
  '/planning',
  '/messages',
  '/orders',
  '/booking',
  '/checkout',
  '/referrals',
]

/**
 * Check if a path matches any of the protected routes
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route))
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Allow files (images, etc.)
  ) {
    return NextResponse.next()
  }

  // Check if route is protected
  if (isProtectedRoute(pathname)) {
    // Check if user is authenticated
    if (!isAuthenticated(request)) {
      // Redirect to login page with return URL
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Allow access to auth routes and public pages
  return NextResponse.next()
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
