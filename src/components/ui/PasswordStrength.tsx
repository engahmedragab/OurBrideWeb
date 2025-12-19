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
      return index === 0 ? 'bg-error-500' : 'bg-gray-300'
    }
    if (strength.level === 2) {
      return index < 2 ? 'bg-warning-500' : 'bg-gray-300'
    }
    return 'bg-success-500'
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-0.5 flex-1 rounded-full transition-colors',
              getBarColor(index)
            )}
          />
        ))}
      </div>
    </div>
  )
}
