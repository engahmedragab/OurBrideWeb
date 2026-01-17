'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { DeepLinkLoading } from '@/components/deeplink/DeepLinkLoading'

// App IDs
const APP_PACKAGE = 'com.ourbride.app'
const IOS_APP_ID = '6747453812' // OurBride App Store ID

// Domain configuration
const MAIN_DOMAIN = 'our-bride.com'
const APP_SUBDOMAIN = 'app.our-bride.com'

const ua = typeof window !== 'undefined' ? navigator.userAgent || '' : ''
const isAndroid = /Android/i.test(ua)
const isIOS = /iPhone|iPad|iPod/i.test(ua)
const isMobile = isAndroid || isIOS
const isFacebook = /\bFBAN|FBAV|FBIOS|FB_IAB\b/i.test(ua)
const isInstagram = /\bInstagram\b/i.test(ua)
const isTikTok = /\bTTWebView\b/i.test(ua)
const isInAppBrowser = isFacebook || isInstagram || isTikTok

// Detect current subdomain
const getCurrentSubdomain = () => {
  if (typeof window === 'undefined') return 'main'
  const hostname = window.location.hostname
  if (hostname === APP_SUBDOMAIN) return 'app'
  if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) return 'main'
  return 'other'
}

function playStoreUrl(referrerParams: string) {
  const base = `https://play.google.com/store/apps/details?id=${APP_PACKAGE}`
  return referrerParams ? `${base}&referrer=${encodeURIComponent(referrerParams)}` : base
}

function appStoreUrl() {
  return `https://apps.apple.com/app/id${IOS_APP_ID}`
}

export default function DeepLinkHandlerPage() {
  const router = useRouter()
  const params = useParams()
  const shortCode = params?.shortCode as string
  const fallbackTimer = useRef<number | null>(null)
  const canceled = useRef(false)

  useEffect(() => {
    if (!shortCode) return

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

      ; (async () => {
        try {
          const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'
          const res = await axios.get(`${baseURL}/api/v1/deep-links/${shortCode}`, {
            withCredentials: true,
          })
          const { fullUrl } = res.data

          const url = new URL(fullUrl)
          const path = url.pathname
          const qs = url.searchParams
          const qsString = qs.toString()

          const referralCode = qs.get('referralCode')
          const source = qs.get('source')
          const sourceId = qs.get('sourceId')

          if (referralCode && typeof window !== 'undefined') {
            localStorage.setItem('referralCode', referralCode)
          }
          if (source && typeof window !== 'undefined') {
            localStorage.setItem('referralSource', source)
          }
          if (sourceId && typeof window !== 'undefined') {
            localStorage.setItem('referralSourceId', sourceId)
          }

          // Get current subdomain
          const currentSubdomain = getCurrentSubdomain()

          // SPA-owned routes
          const isSpa = path.startsWith('/app') || path.startsWith('/web')
          if (isSpa) {
            router.push(path + (qsString ? `?${qsString}` : ''))
            return
          }

          const attemptKeySuffix = `${path}${qsString ? `?${qsString}` : ''}`
          const attemptKey = `deeplink-handler:lastAttempt:${attemptKeySuffix}`
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
              // sessionStorage might not be available (Safari private mode), ignore
            }
          }

          // If we're on the app subdomain, handle differently
          if (currentSubdomain === 'app') {
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
                  if (!canceled.current) window.location.href = playStoreUrl(qsString)
                }, 500) // shorter timeout for app subdomain
                return cleanup
              }

              if (isIOS) {
                if (shouldAttemptUniversalLink) {
                  recordAttempt()
                  window.location.href = fullUrl // try Universal Link
                }
                fallbackTimer.current = window.setTimeout(() => {
                  if (!canceled.current) window.location.href = appStoreUrl()
                }, 800) // shorter timeout for app subdomain
                return cleanup
              }
            }

            // For desktop or in-app browsers on app subdomain, redirect to main domain
            const mainDomainUrl = `https://www.${MAIN_DOMAIN}${path}${qsString ? `?${qsString}` : ''}`
            window.location.replace(mainDomainUrl)
            return cleanup
          }

          // Main domain or other subdomain handling (original logic)
          document.addEventListener('visibilitychange', onVisibilityChange)
          window.addEventListener('pagehide', onPageHide)

          if (!isMobile || isInAppBrowser) {
            // web landing in in-app browsers/desktop
            window.location.replace(fullUrl)
            return cleanup
          }

          if (isAndroid) {
            window.location.href = fullUrl // try Universal Link first
            fallbackTimer.current = window.setTimeout(() => {
              if (!canceled.current) window.location.href = playStoreUrl(qsString)
            }, 900)
            return cleanup
          }

          if (isIOS) {
            window.location.href = fullUrl // try Universal Link
            fallbackTimer.current = window.setTimeout(() => {
              if (!canceled.current) window.location.href = appStoreUrl()
            }, 1200)
            return cleanup
          }

          window.location.replace(fullUrl)
          return cleanup
        } catch {
          // Deep link error handled silently
          router.push('/')
        }
      })()

    return () => {
      cleanup()
    }
  }, [shortCode, router])

  return <DeepLinkLoading />
}
