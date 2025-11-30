import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export interface PasswordStrengthProps {
  password: string
  className?: string
}

export const PasswordStrength = ({
  password,
  className,
}: PasswordStrengthProps) => {
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: '' }

    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++

    if (score <= 2) return { level: 1, label: 'Weak' }
    if (score <= 4) return { level: 2, label: 'Medium' }
    return { level: 3, label: 'Strong' }
  }, [password])

  const getBarColor = (index: number) => {
    if (strength.level === 0) return 'bg-gray-300'
    if (strength.level === 1) {
      return index < 3 ? 'bg-red-500' : 'bg-gray-300'
    }
    if (strength.level === 2) {
      return index < 6 ? 'bg-yellow-500' : 'bg-gray-300'
    }
    return 'bg-green-500'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {strength.label && (
        <div className="flex items-center gap-2">
          <span className="text-14 font-semibold text-brand-500">
            Password {strength.label}
          </span>
        </div>
      )}
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 rounded-full transition-colors',
              getBarColor(index)
            )}
          />
        ))}
      </div>
    </div>
  )
}
