import { cn } from '@/lib/utils'
import { Typography } from '../Typography'

export interface AuthDividerProps {
  text?: string
  className?: string
}

/**
 * AuthDivider - Divider component with "Or" text for separating auth methods
 */
export const AuthDivider = ({
  text = 'Or',
  className,
}: AuthDividerProps) => {
  return (
    <div className={cn('flex items-center gap-3 mb-4', className)}>
      <div className="h-px flex-1 bg-gray-300" />
      <Typography
        variant="bodySmall"
        textColor="tertiary"
        className="text-gray-500"
      >
        {text}
      </Typography>
      <div className="h-px flex-1 bg-gray-300" />
    </div>
  )
}

