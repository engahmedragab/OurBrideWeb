import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const seenIndicatorVariants = cva(
  'flex items-center gap-1',
  {
    variants: {
      status: {
        sent: 'text-gray-500',
        read: 'text-gray-500',
      },
    },
    defaultVariants: {
      status: 'sent',
    },
  }
)

export interface SeenIndicatorProps
  extends VariantProps<typeof seenIndicatorVariants> {
  seen?: boolean
  className?: string
}

/**
 * SeenIndicator - Component to display message read status
 */
export const SeenIndicator = ({
  seen = false,
  status = 'sent',
  className,
}: SeenIndicatorProps) => {
  return (
    <div className={cn(seenIndicatorVariants({ status }), className)}>
      <Check className="h-4 w-4" />
      <span className="text-12 font-normal leading-4">
        {seen ? 'Read' : 'Sent'}
      </span>
    </div>
  )
}

