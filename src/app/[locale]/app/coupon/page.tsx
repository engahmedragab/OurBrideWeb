'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { DeepLinkLoading } from '@/components/deeplink/DeepLinkLoading'

// App IDs
const APP_SUBDOMAIN = 'app.our-bride.com'

const ua = typeof window !== 'undefined' ? navigator.userAgent || '' : ''
const isAndroid = /Android/i.test(ua)
const isIOS = /iPhone|iPad|iPod/i.test(ua)
const isMobile = isAndroid || isIOS
const isFacebook = /\bFBAN|FBAV|FBIOS|FB_IAB\b/i.test(ua)
const isInstagram = /\bInstagram\b/i.test(ua)
const isTikTok = /\bTTWebView\b/i.test(ua)
const isInAppBrowser = isFacebook || isInstagram || isTikTok

function CouponDeepLinkContent() {
  const searchParams = useSearchParams()
  const fallbackTimer = useRef<number | null>(null)
  const canceled = useRef(false)

  useEffect(() => {
    canceled.current = false

    const onPageHide = () => {
      if (fallbackTimer.current) {
        window.clearTimeout(fallbackTimer.current)
        fallbackTimer.current = null
      }
      canceled.current = true
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (fallbackTimer.current) {
          window.clearTimeout(fallbackTimer.current)
          fallbackTimer.current = null
        }
        canceled.current = true
      }
    }

    const cleanup = () => {
      if (fallbackTimer.current) {
        window.clearTimeout(fallbackTimer.current)
        fallbackTimer.current = null
      }
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', onPageHide)
    }

    // Get coupon code from query params
    const couponCode = searchParams?.get('code') || ''
    const currentPath = '/app/coupon'
    const queryString = searchParams?.toString() || ''

    // Build URL on app subdomain for universal links
    const fullUrl = `https://${APP_SUBDOMAIN}${currentPath}${queryString ? `?${queryString}` : ''}`
    const attemptKeySuffix = `${currentPath}${queryString ? `?${queryString}` : ''}`
    const attemptKey = `coupon-deeplink:lastAttempt:${attemptKeySuffix}`
    const attemptCooldownMs = 2000
    let lastAttempt = 0

    try {
      lastAttempt = Number(sessionStorage.getItem(attemptKey) || 0)
    } catch {
      lastAttempt = 0
    }

    const shouldAttemptUniversalLink = Date.now() - lastAttempt > attemptCooldownMs
    const recordAttempt = () => {
      try {
        sessionStorage.setItem(attemptKey, String(Date.now()))
      } catch {
        // sessionStorage can be unavailable (Safari private mode), ignore
      }
    }

    // Store URL to redirect to if app doesn't open
    const storeUrl = couponCode
      ? `http://our-bride.store/qr?coupon=${encodeURIComponent(couponCode)}&redirect=/shop`
      : `http://our-bride.store/qr?redirect=/shop`

    // Detect current subdomain
    const currentSubdomain = typeof window !== 'undefined' ? window.location.hostname : ''
    const isAppSubdomain = currentSubdomain === APP_SUBDOMAIN

    // If we're on the app subdomain, handle differently
    if (isAppSubdomain) {
      // On app subdomain, try to open app on mobile
      if (isMobile && !isInAppBrowser) {
        document.addEventListener('visibilitychange', onVisibilityChange)
        window.addEventListener('pagehide', onPageHide)

        // Try to open app via Universal Link
        if (shouldAttemptUniversalLink) {
          recordAttempt()
          window.location.href = fullUrl
        }

        // If app doesn't open, redirect to store (NOT app store)
        fallbackTimer.current = window.setTimeout(() => {
          if (!canceled.current) {
            // If we're still visible, app didn't open - redirect to store
            if (document.visibilityState === 'visible') {
              window.location.href = storeUrl
            }
          }
        }, isIOS ? 1000 : 800) // Same timeout as regular deep links
        return cleanup
      }

      // For desktop or in-app browsers, redirect to store
      window.location.replace(storeUrl)
      return cleanup
    }

    // Main domain handling - redirect to app subdomain first
    if (isMobile && !isInAppBrowser) {
      document.addEventListener('visibilitychange', onVisibilityChange)
      window.addEventListener('pagehide', onPageHide)

      // Redirect to app subdomain for Universal Links
      window.location.href = fullUrl
      fallbackTimer.current = window.setTimeout(() => {
        if (!canceled.current) {
          // If still visible, redirect to store (NOT app store)
          if (document.visibilityState === 'visible') {
            window.location.href = storeUrl
          }
        }
      }, isIOS ? 1000 : 800)
      return cleanup
    }

    // Desktop or in-app browser - redirect directly to store
    window.location.replace(storeUrl)

    return cleanup
  }, [searchParams])

  return <DeepLinkLoading />
}

export default function CouponDeepLinkPage() {
  return (
    <Suspense fallback={<DeepLinkLoading />}>
      <CouponDeepLinkContent />
    </Suspense>
  )
}
