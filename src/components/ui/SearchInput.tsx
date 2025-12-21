import { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'

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
  VariantProps<typeof searchInputVariants> { }

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, variant, size, value, onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(value || '')
    const isControlled = value !== undefined

    useEffect(() => {
      if (isControlled) {
        setInputValue(value || '')
      }
    }, [value, isControlled])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (!isControlled) {
        setInputValue(newValue)
      }
      onChange?.(e)
    }

    const handleClear = () => {
      if (!isControlled) {
        setInputValue('')
      }
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(syntheticEvent)
      if (typeof ref === 'object' && ref?.current) {
        ref.current.value = ''
        ref.current.focus()
      }
    }

    const displayValue = isControlled ? value : inputValue
    const showClear = displayValue && String(displayValue).length > 0

    return (
      <div
        className={cn(
          'relative flex w-full items-center rounded-full',
          searchInputVariants({ variant, size }),
          className
        )}
      >
        <input
          type="text"
          className={cn(
            'flex-1 bg-transparent outline-none',
            'placeholder:text-gray-400',
            '[&::-webkit-search-cancel-button]:hidden'
          )}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 flex-shrink-0"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-brand-500" />
          </button>
        )}
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
