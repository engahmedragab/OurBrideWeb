/**
 * Currency formatting utilities
 * Provides consistent currency formatting across the application
 */

export type CurrencyCode = 'EGP' | 'SAR' | 'USD' | 'AED' | 'KWD' | 'BHD' | 'QAR' | 'OMR' | 'JOD' | 'LBP' | string

// Default currency and country
export const DEFAULT_CURRENCY: CurrencyCode = 'EGP'
export const DEFAULT_COUNTRY = 'Egypt'
export const DEFAULT_LOCALE = 'en-EG'

export interface CurrencyFormatOptions {
  showSymbol?: boolean
  showCode?: boolean
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

/**
 * Currency configuration
 * Maps currency codes to their display properties
 * Default currency: EGP (Egyptian Pound)
 */
const CURRENCY_CONFIG: Record<string, {
  symbol: string
  symbolPosition: 'before' | 'after'
  locale: string
  decimalPlaces: number
}> = {
  EGP: { symbol: 'EGP', symbolPosition: 'after', locale: 'en-EG', decimalPlaces: 2 }, // Default
  SAR: { symbol: 'ر.س', symbolPosition: 'after', locale: 'ar-SA', decimalPlaces: 2 },
  USD: { symbol: '$', symbolPosition: 'before', locale: 'en-US', decimalPlaces: 2 },
  AED: { symbol: 'د.إ', symbolPosition: 'after', locale: 'ar-AE', decimalPlaces: 2 },
  KWD: { symbol: 'د.ك', symbolPosition: 'after', locale: 'ar-KW', decimalPlaces: 3 },
  BHD: { symbol: '.د.ب', symbolPosition: 'after', locale: 'ar-BH', decimalPlaces: 3 },
  QAR: { symbol: 'ر.ق', symbolPosition: 'after', locale: 'ar-QA', decimalPlaces: 2 },
  OMR: { symbol: 'ر.ع.', symbolPosition: 'after', locale: 'ar-OM', decimalPlaces: 3 },
  JOD: { symbol: 'د.أ', symbolPosition: 'after', locale: 'ar-JO', decimalPlaces: 3 },
  LBP: { symbol: 'ل.ل', symbolPosition: 'after', locale: 'ar-LB', decimalPlaces: 0 },
}

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - Currency code (EGP default, SAR, USD, etc.)
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  options: CurrencyFormatOptions = {}
): string {
  const {
    showSymbol = true,
    showCode = false,
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
  } = options

  const config = CURRENCY_CONFIG[currency.toUpperCase()] || CURRENCY_CONFIG[DEFAULT_CURRENCY]

  const finalLocale = locale || config.locale
  const minFractionDigits = minimumFractionDigits ?? config.decimalPlaces
  const maxFractionDigits = maximumFractionDigits ?? config.decimalPlaces

  // Format the number with locale-specific formatting
  const formattedNumber = new Intl.NumberFormat(finalLocale, {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
  }).format(amount)

  // Build the result
  let result = formattedNumber

  if (showSymbol) {
    if (config.symbolPosition === 'before') {
      result = `${config.symbol} ${result}`
    } else {
      result = `${result} ${config.symbol}`
    }
  }

  if (showCode && !showSymbol) {
    result = `${result} ${currency.toUpperCase()}`
  }

  return result
}

/**
 * Formats currency for display in cards (compact format)
 * Uses symbol only, no code
 */
export function formatCurrencyCompact(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY
): string {
  return formatCurrency(amount, currency, {
    showSymbol: true,
    showCode: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

/**
 * Formats currency with code (e.g., "1,000 EGP")
 */
export function formatCurrencyWithCode(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY
): string {
  const config = CURRENCY_CONFIG[currency.toUpperCase()] || CURRENCY_CONFIG[DEFAULT_CURRENCY]

  const formattedNumber = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)

  return `${formattedNumber} ${currency.toUpperCase()}`
}

/**
 * Gets currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode = DEFAULT_CURRENCY): string {
  const config = CURRENCY_CONFIG[currency.toUpperCase()]
  return config?.symbol || CURRENCY_CONFIG[DEFAULT_CURRENCY].symbol
}

/**
 * Gets currency symbol position
 */
export function getCurrencySymbolPosition(currency: CurrencyCode = DEFAULT_CURRENCY): 'before' | 'after' {
  const config = CURRENCY_CONFIG[currency.toUpperCase()]
  return config?.symbolPosition || CURRENCY_CONFIG[DEFAULT_CURRENCY].symbolPosition
}

