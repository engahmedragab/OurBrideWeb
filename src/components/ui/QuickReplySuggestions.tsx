import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckCircle2 } from 'lucide-react'

const quickReplyVariants = cva(
  'flex items-center gap-1.5 sm:gap-2 rounded-3xl border bg-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-left transition-colors',
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

export interface QuickReplySuggestionsProps extends VariantProps<
  typeof quickReplyVariants
> {
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
    <div className={cn('flex flex-row flex-wrap gap-1.5 sm:gap-2', className)}>
      {suggestions.map(suggestion => {
        const isSelected = selectedSuggestion === suggestion
        return (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            className={cn(quickReplyVariants({ selected: isSelected }))}
          >
            {isSelected && (
              <CheckCircle2 className="h-4 w-4 sm:h-[16px] sm:w-[16px] md:h-[18px] md:w-[18px] flex-shrink-0 text-brand-500" />
            )}
            <span
              className={cn(
                '!text-12  md:text-16 leading-4 sm:leading-5 md:leading-6',
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
