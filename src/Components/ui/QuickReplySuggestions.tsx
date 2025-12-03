import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckCircle2 } from 'lucide-react'

const quickReplyVariants = cva(
  'flex items-center gap-2 rounded-3xl border bg-white px-5 py-3 text-left transition-colors',
  {
    variants: {
      selected: {
        true: 'border-brand-500',
        false: 'border-gray-500 hover:border-gray-300',
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
)

export interface QuickReplySuggestionsProps
  extends VariantProps<typeof quickReplyVariants> {
  suggestions: string[]
  selectedSuggestion?: string
  onSelect: (suggestion: string) => void
  className?: string
}

/**
 * QuickReplySuggestions - Component for displaying quick reply options
 */
export const QuickReplySuggestions = ({
  suggestions,
  selectedSuggestion,
  onSelect,
  className,
}: QuickReplySuggestionsProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {suggestions.map((suggestion) => {
        const isSelected = selectedSuggestion === suggestion
        return (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            className={cn(quickReplyVariants({ selected: isSelected }))}
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
              {suggestion}
            </span>
          </button>
        )
      })}
    </div>
  )
}

