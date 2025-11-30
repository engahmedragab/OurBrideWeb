import { InputHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

const searchInputVariants = cva(
  'flex w-full items-center gap-2 border bg-background px-3 py-2 text-16 ring-offset-background transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 focus-visible:border-brand-500 focus-visible:ring-brand-500',
        focused: 'border-brand-500 focus-visible:ring-brand-500',
      },
      size: {
        sm: 'h-8 px-2 text-12',
        md: 'h-10 px-3 text-14',
        lg: 'h-12 px-4 text-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface SearchInputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof searchInputVariants> {}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(
          'relative flex w-full items-center',
          searchInputVariants({ variant, size }),
          className
        )}
      >
        <input
          type="search"
          className={cn(
            'flex-1 bg-transparent outline-none',
            'placeholder:text-gray-400'
          )}
          ref={ref}
          {...props}
        />
        <Search
          className={cn(
            'h-5 w-5 flex-shrink-0',
            variant === 'focused' ? 'text-gray-600' : 'text-gray-400'
          )}
        />
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

export { SearchInput, searchInputVariants }
