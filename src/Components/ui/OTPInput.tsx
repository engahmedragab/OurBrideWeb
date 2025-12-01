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
  'flex h-12 w-12 items-center justify-center rounded-md border text-center text-16 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 bg-white focus-visible:border-primary',
        error:
          'border-error-500 bg-error-50 text-error-900 focus-visible:border-error-600',
        success:
          'border-success-500 bg-white focus-visible:border-success-500',
        focused: 'border-primary focus-visible:border-primary',
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

    const handleChange = (index: number, newValue: string) => {
      if (!/^\d*$/.test(newValue)) return

      const newValues = [...value]
      newValues[index] = newValue.slice(-1)
      setValue(newValues)

      // Auto-focus next input
      if (newValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
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

    return (
      <div className={cn('w-full', className)} ref={ref}>
        <div className="flex gap-2 justify-center">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value[index] || ''}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={cn(otpInputVariants({ variant }))}
              {...props}
            />
          ))}
        </div>
        {errorMessage && (
          <div className="mt-1 flex items-center gap-1 text-12 text-error-500">
            <X className="h-3 w-3 border border-red-500 rounded-full" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    )
  }
)
OTPInput.displayName = 'OTPInput'

export { OTPInput, otpInputVariants }
