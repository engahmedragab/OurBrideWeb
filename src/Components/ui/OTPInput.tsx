import {
  InputHTMLAttributes,
  forwardRef,
  useRef,
  useState,
  KeyboardEvent,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const otpInputVariants = cva(
  'flex h-[79px] w-full items-center justify-center rounded-[5px] border text-center text-20 font-normal leading-6 transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 bg-white text-gray-300 focus-visible:border-brand-500',
        error:
          'border-red-500 bg-red-100 text-red-500 focus-visible:border-red-500',
        success:
          'border-green-500 bg-green-100 text-green-500 focus-visible:border-green-500',
        focused: 'border-brand-500 bg-white text-gray-900 focus-visible:border-brand-500',
        fill: 'border-gray-300 bg-white text-gray-900 focus-visible:border-brand-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface OTPInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  length?: number
  value?: string[]
  onChange?: (value: string[]) => void
  variant?: VariantProps<typeof otpInputVariants>['variant']
  errorMessage?: string
}

const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      className,
      length = 4,
      value: controlledValue,
      onChange,
      variant = 'default',
      errorMessage,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string[]>(
      Array(length).fill('')
    )
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const value = controlledValue ?? internalValue
    const setValue = onChange ?? setInternalValue
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

    const handleChange = (index: number, newValue: string) => {
      if (!/^\d*$/.test(newValue)) return

      const newValues = [...value]
      newValues[index] = newValue.slice(-1)
      setValue(newValues)

      // Auto-focus next input
      if (newValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
        setFocusedIndex(index + 1)
      }
    }

    const handleKeyDown = (
      index: number,
      e: KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const getVariantForInput = (index: number) => {
      const hasValue = value[index] && value[index].length > 0
      const isFocused = focusedIndex === index
      
      if (variant === 'error') return 'error'
      if (variant === 'success') return 'success'
      if (isFocused) return 'focused'
      if (hasValue) return 'fill'
      return 'default'
    }

    return (
      <div className={cn('w-full', className)} ref={ref}>
        <div className="flex gap-2">
          {Array.from({ length }).map((_, index) => {
            const inputVariant = getVariantForInput(index)
            return (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value[index] || ''}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onFocus={() => {
                  setFocusedIndex(index)
                }}
                onBlur={() => {
                  setFocusedIndex(null)
                }}
                className={cn(otpInputVariants({ variant: inputVariant }))}
                {...props}
              />
            )
          })}
        </div>
        {errorMessage && (
          <div className="mt-2 flex items-center gap-2 text-14 font-normal leading-4 text-red-500">
            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-red-500 flex-shrink-0">
              <X className="h-2.5 w-2.5 text-red-500" />
            </div>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    )
  }
)
OTPInput.displayName = 'OTPInput'

export { OTPInput, otpInputVariants }
