import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getDirection, type Locale } from '@/i18n/config'
import { I18nProvider } from '@/i18n/provider'
import { Providers } from '../providers'
import { LocaleHtmlAttributes } from '@/i18n/components'

/**
 * Generate static params for all supported locales
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Locale Layout
 * 
 * This layout wraps all pages under [locale] and provides:
 * - Locale context
 * - Direction (RTL/LTR) - set via LocaleHtmlAttributes
 * - Font (Alexandria/Poppins)
 * - Translation messages
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  // Get messages for the locale
  const messages = await getMessages()

  // Get direction for the locale
  const direction = getDirection(locale as Locale)

  return (
    <LocaleHtmlAttributes locale={locale as Locale} direction={direction}>
      <I18nProvider locale={locale as Locale} messages={messages}>
        <Providers>{children}</Providers>
      </I18nProvider>
    </LocaleHtmlAttributes>
  )
}
