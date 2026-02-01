'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'
import { cva, type VariantProps } from 'class-variance-authority'
import { useIsRTL } from '@/i18n/hooks'

const selectMenuTriggerVariants = cva(
  'flex w-full items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-16 font-normal leading-6 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 hover:border-brand-400 focus:border-brand-500',
        error: 'border-red-500 bg-red-100 focus:border-red-500',
      },
      size: {
        sm: 'h-10 px-3 text-12',
        md: 'h-11 px-4 text-13',
        lg: 'h-auto px-4 py-2.5 text-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface SelectMenuOption {
  label: string
  value: string
}

export interface SelectMenuProps extends VariantProps<typeof selectMenuTriggerVariants> {
  value: string
  onChange: (value: string) => void
  options: SelectMenuOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const SelectMenu = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className,
  disabled = false,
  size = 'lg',
  variant = 'default',
}: SelectMenuProps) => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined)

  const isRTL = useIsRTL()
  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!open) setOpen(true)
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'ArrowDown' && !open) {
      e.preventDefault()
      setOpen(true)
    } else if (e.key === 'ArrowUp' && open) {
      e.preventDefault()
      const currentIndex = options.findIndex(opt => opt.value === value)
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
      handleSelect(options[prevIndex].value)
    } else if (e.key === 'ArrowDown' && open) {
      e.preventDefault()
      const currentIndex = options.findIndex(opt => opt.value === value)
      const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
      handleSelect(options[nextIndex].value)
    }
  }

  return (
    <div className={cn('w-full', className)} dir={isRTL ? 'rtl' : 'ltr'}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            onKeyDown={handleKeyDown}
            className={cn(
              selectMenuTriggerVariants({ variant, size }),
             
              isRTL ? 'justify-between text-right' : 'justify-between text-left',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <span
              className={cn(
                'flex-1 truncate',
               
                isRTL ? 'text-right' : 'text-left',
                selectedOption ? 'text-gray-900' : 'text-gray-400'
              )}
              dir="auto"
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>

            <ChevronDown
              className={cn(
                'h-5 w-5 text-gray-400 transition-transform flex-shrink-0',
                open && 'rotate-180'
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            'p-1.5 bg-white border border-gray-200 rounded-xl shadow-lg'
          )}
         
          align={isRTL ? 'end' : 'start'}
          sideOffset={4}
          style={
            triggerWidth
              ? { width: triggerWidth }
              : { minWidth: 'var(--radix-popover-trigger-width)' }
          }
        >
          <div className="max-h-[300px] overflow-y-auto">
            {options.map(option => {
              const isSelected = value === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    // ✅ بدل justify-between الثابت، نخليها direction-aware
                    'w-full flex items-center px-3 py-2.5 rounded-xl text-16 font-normal transition-colors',
                    isRTL ? 'flex-row-reverse justify-between' : 'justify-between',
                    'hover:bg-brand-50 hover:text-brand-500',
                    isSelected && 'bg-brand-500 text-white hover:bg-brand-500 hover:text-white'
                  )}
                >
                  <span className={cn('flex-1', isRTL ? 'text-right' : 'text-left')} dir="auto">
                    {option.label}
                  </span>

                  {isSelected && (
                    <Check
                      className={cn(
                        'h-4 w-4 text-white flex-shrink-0',
                        
                        isRTL ? 'mr-2' : 'ml-2'
                      )}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
