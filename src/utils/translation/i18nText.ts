// src/utils/i18nText.ts
type MaybeString = string | null | undefined

type LocalizedText = {
  ar?: MaybeString
  en?: MaybeString
  fallback?: MaybeString
}

/**
 * Pick localized text based on current locale.
 * - locale: 'ar' | 'en' (or any string, we only treat 'ar' as Arabic)
 * - Falls back in this order:
 *   - if locale is ar: ar -> en -> fallback -> ''
 *   - else: en -> ar -> fallback -> ''
 */
export function pickLocalizedText(locale: string, t: LocalizedText): string {
  const isAr = locale?.toLowerCase()?.startsWith('ar')

  const clean = (v?: MaybeString) => (typeof v === 'string' ? v.trim() : '')
  const ar = clean(t.ar)
  const en = clean(t.en)
  const fb = clean(t.fallback)

  if (isAr) return ar || en || fb || ''
  return en || ar || fb || ''
}
