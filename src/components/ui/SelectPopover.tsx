'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectPopoverProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  errorMessage?: string
  disabled?: boolean
}

export const SelectPopover = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className,
  errorMessage,
  disabled,
}: SelectPopoverProps) => {
  const [open, setOpen] = useState(false)
  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-1.5 text-16 font-normal leading-6 transition-colors',
              'h-11',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
              errorMessage
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-brand-400 focus:border-brand-500',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <span
              className={cn(
                'flex-1 text-left',
                selectedOption ? 'text-gray-900' : 'text-gray-400'
              )}
              dir="auto"
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn(
                'h-5 w-5 text-gray-400 transition-transform',
                open && 'rotate-180'
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="p-1.5 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[var(--radix-popover-trigger-width)] !z-[9999]"
          align="start"
          sideOffset={4}
        >
          <div className="max-h-[300px] overflow-y-auto">
            {options.map(option => {
              const isSelected = value === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-16 font-normal transition-colors',
                    'hover:bg-brand/50 hover:text-white',
                    isSelected && 'bg-brand-500 text-white mb-2'
                  )}
                >
                  <span className="flex-1 text-left" dir="auto">
                    {option.label}
                  </span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-white flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
      {errorMessage && (
        <div className="mt-2 flex items-center gap-2 text-14 font-normal leading-4 text-red-500">
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}
