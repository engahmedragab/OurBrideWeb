'use client'

import { cn } from '@/lib/utils'
import { useI18nTranslations } from '@/i18n'

export interface AuthErrorDisplayProps {
  error: string | null
  className?: string
}

const isProbablyI18nKey = (value: string) => {
  const v = value.trim()
  return /^[a-zA-Z0-9_.-]+$/.test(v) && v.includes('.')
}

const normalizeKey = (key: string) => {
  const k = key.trim()
  return k.startsWith('auth.') ? k.replace(/^auth\./, '') : k
}

export const AuthErrorDisplay = ({ error, className }: AuthErrorDisplayProps) => {
  const t = useI18nTranslations('auth')
  if (!error) return null
  const hasMultipleErrors = error.includes('\n')
  const errorMessages = hasMultipleErrors
    ? error.split('\n').map(s => s.trim()).filter(Boolean)
    : [error.trim()]

  const safeTranslate = (msgOrKey: string) => {
    const normalized = normalizeKey(msgOrKey)
    if (!isProbablyI18nKey(normalized)) return msgOrKey

    try {
      return t(normalized)
    } catch {
   
      return msgOrKey
    }
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn('mt-2 p-3 bg-red-50 border border-red-200 rounded-md', className)}
    >
      {hasMultipleErrors ? (
        <div className="space-y-1">
          <p className="text-sm font-medium text-red-800 mb-1">
            {t('errors.validationTitle')}
          </p>
          <ul className="list-disc list-inside space-y-0.5">
            {errorMessages.map((err, index) => (
              <li key={index} className="text-sm text-red-600">
                {safeTranslate(err)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-red-600">{safeTranslate(errorMessages[0])}</p>
      )}
    </div>
  )
}
