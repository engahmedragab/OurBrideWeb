import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

export type ProblemType =
  | 'Booking issue'
  | 'Service provider issue'
  | 'Payment issue'
  | 'Technical problem'
  | 'Other'

export interface ProblemTypeSelectorProps {
  selectedType?: ProblemType
  onSelect: (type: ProblemType) => void
  className?: string
}

/**
 * ProblemTypeSelector - Component for selecting problem type in Report a Problem form
 */
export const ProblemTypeSelector = ({
  selectedType,
  onSelect,
  className,
}: ProblemTypeSelectorProps) => {
  const problemTypes: ProblemType[] = [
    'Booking issue',
    'Service provider issue',
    'Payment issue',
    'Technical problem',
    'Other',
  ]

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {problemTypes.map((type) => {
        const isSelected = selectedType === type
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={cn(
              'flex items-center gap-2 rounded-lg border bg-white px-5 py-3 text-left transition-colors',
              isSelected
                ? 'border-brand-500'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            {isSelected && (
              <CheckCircle2 className="h-[18px] w-[18px] flex-shrink-0 text-brand-500" />
            )}
            <span
              className={cn(
                'text-16 font-medium leading-6',
                isSelected ? 'text-brand-500' : 'text-gray-500'
              )}
            >
              {type}
            </span>
          </button>
        )
      })}
    </div>
  )
}

