'use client'

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
import { useIsRTL } from '@/i18n/hooks'



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
        focused:
          'border-brand-500 bg-white text-gray-900 focus-visible:border-brand-500',
        fill: 'border-gray-300 bg-white text-gray-900 focus-visible:border-brand-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface OTPInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
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
    const isRTL = useIsRTL()
    const [internalValue, setInternalValue] = useState<string[]>(
      Array(length).fill('')
    )
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

    const value = controlledValue ?? internalValue
    const setValue = onChange ?? setInternalValue

    const focusIndex = (index: number) => {
      inputRefs.current[index]?.focus()
      setFocusedIndex(index)
    }

    const handleChange = (index: number, raw: string) => {
      // خليها أرقام فقط
      const digits = raw.replace(/\D/g, '')
      if (!digits) {
        const newValues = [...value]
        newValues[index] = ''
        setValue(newValues)
        return
      }

      // ✅ لو دخل أكتر من رقم (autofill / mobile / paste صغير)
      // وزّعهم على الخانات من عند index
      const newValues = [...value]
      let writeIndex = index

      for (const d of digits) {
        if (writeIndex >= length) break
        newValues[writeIndex] = d
        writeIndex++
      }

      setValue(newValues)

      // نقل الفوكس لأبعد خانة اتكتبت
      const nextIndex = Math.min(writeIndex, length - 1)
      if (writeIndex <= length - 1) {
        focusIndex(nextIndex)
      } else {
        // لو خلّص كل الخانات، خليه يطلع من آخر خانة
        inputRefs.current[length - 1]?.blur()
        setFocusedIndex(null)
      }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      // ✅ Enter ينقل للخانة اللي بعدها بدل submit / بدل ما يفضل مكانه
      if (e.key === 'Enter' || e.key === 'NumpadEnter') {
        e.preventDefault()
        if (index < length - 1) {
          focusIndex(index + 1)
        } else {
          // آخر خانة: ممكن blur (والـ submit يحصل من زرار التأكيد)
          inputRefs.current[index]?.blur()
          setFocusedIndex(null)
        }
        return
      }

      if (e.key === 'Backspace') {
        // لو الخانة فاضية ارجع للي قبلها
        if (!value[index] && index > 0) {
          e.preventDefault()
          focusIndex(index - 1)
        }
        return
      }

      if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault()
        focusIndex(index - 1)
        return
      }

      if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault()
        focusIndex(index + 1)
        return
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
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={length} // مهم عشان لو دخل أكتر من رقم (autofill) مايتقصش غلط
                value={value[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                className={cn(otpInputVariants({ variant: inputVariant }))}
                {...props}
              />
            )
          })}
        </div>

        {errorMessage && (
          <div className={cn("mt-2 flex items-center gap-2 md:text-14 text-10 font-normal leading-4 text-red-500 " ,
           
          )}>
            {!isRTL ? (
              <>
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-red-500 flex-shrink-0">
                  <X className="h-2 w-2 text-red-500 " />
                </div>
                <span>{errorMessage}</span>
              </>
            ) : (
              <>
                <span>{errorMessage}</span>
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-red-500 flex-shrink-0">
                  <X className="h-2 w-2 text-red-500 " />
                </div>
              </>
            )}
           
            
          </div>
        )}
      </div>
    )
  }
)

OTPInput.displayName = 'OTPInput'

export { OTPInput, otpInputVariants }
