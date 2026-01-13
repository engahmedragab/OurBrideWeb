'use client'

import { useLocale, useTranslations } from 'next-intl'
import { isRTL, getDirection, type Locale } from './config'

/**
 * Hook to get current locale
 * 
 * Usage:
 * const locale = useI18nLocale()
 */
export function useI18nLocale(): Locale {
  return useLocale() as Locale
}

/**
 * Hook to get translation function for a namespace
 * 
 * Usage:
 * const t = useI18nTranslations('common')
 * <p>{t('loading')}</p>
 */
export function useI18nTranslations(namespace: string) {
  return useTranslations(namespace)
}

/**
 * Hook to check if current locale is RTL
 * 
 * Usage:
 * const rtl = useIsRTL()
 * <div className={rtl ? 'text-right' : 'text-left'}>
 */
export function useIsRTL(): boolean {
  const locale = useI18nLocale()
  return isRTL(locale)
}

/**
 * Hook to get current direction
 * 
 * Usage:
 * const dir = useDirection()
 * <div dir={dir}>
 */
export function useDirection(): 'rtl' | 'ltr' {
  const locale = useI18nLocale()
  return getDirection(locale)
}

/**
 * Re-export next-intl hooks for convenience
 */
export { useLocale, useTranslations } from 'next-intl'
