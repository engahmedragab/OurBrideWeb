import {
  InputHTMLAttributes,
  forwardRef,
  useRef,
  useState,
  KeyboardEvent,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const otpInputVariants = cva(
  'flex h-12 w-12 items-center justify-center rounded-md border text-center text-16 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 bg-white focus-visible:border-brand-500 focus-visible:ring-brand-500',
        error:
          'border-red-500 bg-red-50 text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500',
        success:
          'border-green-500 bg-green-50 text-green-500 focus-visible:border-green-500 focus-visible:ring-green-500',
        focused: 'border-brand-500 focus-visible:ring-brand-500',
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
        <div className="flex gap-2">
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
          <div className="mt-1 flex items-center gap-1 text-12 text-red-500">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white text-10">
              ×
            </span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    )
  }
)
OTPInput.displayName = 'OTPInput'

export { OTPInput, otpInputVariants }
