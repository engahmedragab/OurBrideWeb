'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { DeepLinkLoading } from '@/components/deeplink/DeepLinkLoading'

// App IDs
const APP_PACKAGE = 'com.ourbride.app'
const IOS_APP_ID = '6747453812'
const APP_SUBDOMAIN = 'app.our-bride.com'
const MAIN_DOMAIN = 'our-bride.com'

const ua = typeof window !== 'undefined' ? navigator.userAgent || '' : ''
const isAndroid = /Android/i.test(ua)
const isIOS = /iPhone|iPad|iPod/i.test(ua)
const isMobile = isAndroid || isIOS
const isFacebook = /\bFBAN|FBAV|FBIOS|FB_IAB\b/i.test(ua)
const isInstagram = /\bInstagram\b/i.test(ua)
const isTikTok = /\bTTWebView\b/i.test(ua)
const isInAppBrowser = isFacebook || isInstagram || isTikTok

function playStoreUrl() {
  return `https://play.google.com/store/apps/details?id=${APP_PACKAGE}`
}

function appStoreUrl() {
  return `https://apps.apple.com/app/id${IOS_APP_ID}`
}

function DeepLinkRedirectContent() {
  const params = useParams()
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

    // Get current path and build full URL
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/redirect'
    const queryString = searchParams?.toString() || ''

    // Build URL on app subdomain for universal links (iOS requires exact domain match)
    const fullUrl = `https://${APP_SUBDOMAIN}${currentPath}${queryString ? `?${queryString}` : ''}`
    const attemptKeySuffix = `${currentPath}${queryString ? `?${queryString}` : ''}`
    const attemptKey = `deeplink:lastAttempt:${attemptKeySuffix}`
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
        // sessionStorage might be unavailable (Safari private mode), ignore
      }
    }

    // Detect current subdomain
    const currentSubdomain = typeof window !== 'undefined' ? window.location.hostname : ''
    const isAppSubdomain = currentSubdomain === APP_SUBDOMAIN

    // If we're on the app subdomain, handle differently
    if (isAppSubdomain) {
      // On app subdomain, prioritize app opening
      if (isMobile && !isInAppBrowser) {
        document.addEventListener('visibilitychange', onVisibilityChange)
        window.addEventListener('pagehide', onPageHide)

        if (isAndroid) {
          if (shouldAttemptUniversalLink) {
            recordAttempt()
            window.location.href = fullUrl // try Universal Link first
          }
          fallbackTimer.current = window.setTimeout(() => {
            if (!canceled.current) window.location.href = playStoreUrl()
          }, 800) // Fast timeout for Android
          return cleanup
        }

        if (isIOS) {
          if (shouldAttemptUniversalLink) {
            recordAttempt()
            // Try to open app via Universal Link
            window.location.href = fullUrl
          }

          // iOS Universal Links - quick redirect if app doesn't open
          fallbackTimer.current = window.setTimeout(() => {
            if (!canceled.current) {
              // If we're still visible, app didn't open
              if (document.visibilityState === 'visible') {
                window.location.href = appStoreUrl()
              }
            }
          }, 1000) // Fast timeout for iOS
          return cleanup
        }
      }

      // For desktop or in-app browsers on app subdomain, redirect to main domain
      const mainDomainUrl = `https://www.${MAIN_DOMAIN}${currentPath}${queryString ? `?${queryString}` : ''}`
      window.location.replace(mainDomainUrl)
      return cleanup
    }

    // Main domain or other subdomain handling
    // Redirect to app subdomain for Universal Links to work
    if (isMobile && !isInAppBrowser) {
      document.addEventListener('visibilitychange', onVisibilityChange)
      window.addEventListener('pagehide', onPageHide)

      if (isAndroid) {
        // Redirect to app subdomain first, then try Universal Link
        window.location.href = fullUrl
        fallbackTimer.current = window.setTimeout(() => {
          if (!canceled.current) {
            window.location.href = playStoreUrl()
          }
        }, 800) // Fast timeout for Android
        return cleanup
      }

      if (isIOS) {
        // Redirect to app subdomain for Universal Links
        window.location.href = fullUrl
        fallbackTimer.current = window.setTimeout(() => {
          if (!canceled.current) {
            // If still visible, redirect to App Store
            if (document.visibilityState === 'visible') {
              window.location.href = appStoreUrl()
            }
          }
        }, 1000) // Fast timeout for iOS from main domain
        return cleanup
      }
    }

    // Desktop or in-app browser - redirect to main domain
    if (!isMobile || isInAppBrowser) {
      if (typeof window !== 'undefined') {
        window.location.replace('/')
      }
      return cleanup
    }

    if (typeof window !== 'undefined') {
      window.location.replace('/')
    }

    return cleanup
  }, [params, searchParams])

  return <DeepLinkLoading />
}

export default function RedirectDeepLinkRedirectPage() {
  return (
    <Suspense fallback={<DeepLinkLoading />}>
      <DeepLinkRedirectContent />
    </Suspense>
  )
}
