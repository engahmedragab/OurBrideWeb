"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import orderEmptySvg from '@/assets/svg/something-wrong.svg'
import ErrorPageContent from './ErrorPageContent'

function getLocaleFromPath(): string {
  if (typeof window === 'undefined') return routing.defaultLocale
  
  const pathname = window.location.pathname
  const localeMatch = pathname.match(/^\/(ar|en)(\/|$)/)
  if (localeMatch) return localeMatch[1]
  
  // Try to get from cookie
  const cookies = document.cookie.split(';')
  const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='))
  if (localeCookie) {
    const locale = localeCookie.split('=')[1]?.trim()
    if (routing.locales.includes(locale as any)) return locale
  }
  
  return routing.defaultLocale
}

export default function ErrorPage() {
  const [locale, setLocale] = useState<string>(routing.defaultLocale)
  const [messages, setMessages] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    const detectedLocale = getLocaleFromPath()
    setLocale(detectedLocale)
    
    // Load messages for the locale
    import(`../../locales/${detectedLocale}/common.json`)
      .then((module) => {
        setMessages(module.default)
      })
      .catch(() => {
        // Fallback to default locale if translation file not found
        import(`../../locales/${routing.defaultLocale}/common.json`)
          .then((module) => {
            setMessages(module.default)
            setLocale(routing.defaultLocale)
          })
      })
  }, [])

  if (!messages) {
    // Show fallback content while loading
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            src={typeof orderEmptySvg === 'string' ? orderEmptySvg : orderEmptySvg.src}
            alt="Something went wrong"
            width={256}
            height={256}
            className="w-64 h-64 object-contain mb-8"
          />
          <h2 className="text-18 md:text-22 font-semibold text-gray-900 mb-1 text-center">
            Oops! Something went wrong
          </h2>
          <p className="text-14 text-gray-500 mb-6 text-center">
            Please try again later
          </p>
        </div>
      </div>
    )
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ErrorPageContent />
    </NextIntlClientProvider>
  )
}
