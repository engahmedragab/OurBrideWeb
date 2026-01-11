'use client'

import { cn } from '@/lib/utils'

export interface AuthErrorDisplayProps {
  error: string | null
  className?: string
}

/**
 * AuthErrorDisplay - Reusable component for displaying authentication errors
 * Handles both single error messages and multiple validation errors (newline-separated)
 */
export const AuthErrorDisplay = ({ error, className }: AuthErrorDisplayProps) => {
  if (!error) return null

  // Check if error contains multiple messages (separated by newlines)
  const hasMultipleErrors = error.includes('\n')
  const errorMessages = hasMultipleErrors ? error.split('\n').filter(Boolean) : [error]

  return (
    <div
      className={cn(
        'mt-2 p-3 bg-red-50 border border-red-200 rounded-md',
        className
      )}
    >
      {hasMultipleErrors ? (
        <div className="space-y-1">
          <p className="text-sm font-medium text-red-800 mb-1">Validation Errors:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errorMessages.map((err, index) => (
              <li key={index} className="text-sm text-red-600">
                {err}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
