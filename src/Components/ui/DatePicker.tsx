import * as React from 'react'
import { format, parse, isValid } from 'date-fns'
import { Calendar as CalendarIcon, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from './Calendar'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'
import { Input } from './Input'

export interface DatePickerProps {
  value?: Date | string
  onChange?: (date: Date | string | undefined) => void
  placeholder?: string
  errorMessage?: string
  variant?: 'default' | 'error'
  size?: 'sm' | 'md' | 'lg'
  prefixIcon?: LucideIcon | React.ReactNode
  className?: string
  disabled?: boolean
  required?: boolean
  dateFormat?: 'date' | 'string' // 'date' returns Date object, 'string' returns YYYY-MM-DD
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  errorMessage,
  variant = 'default',
  size = 'md',
  prefixIcon = CalendarIcon,
  className,
  disabled = false,
  required = false,
  dateFormat = 'date',
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Convert string to Date object if needed
  const dateValue: Date | undefined = React.useMemo(() => {
    if (!value) return undefined
    if (value instanceof Date) return value
    if (typeof value === 'string') {
      // Try parsing as YYYY-MM-DD format
      const parsed = parse(value, 'yyyy-MM-dd', new Date())
      return isValid(parsed) ? parsed : undefined
    }
    return undefined
  }, [value])

  const displayValue = React.useMemo(() => {
    if (!dateValue) return ''
    return format(dateValue, 'PPP')
  }, [dateValue])

  const handleDateSelect = React.useCallback((date: Date | undefined) => {
    if (!onChange) return
    
    if (dateFormat === 'string') {
      // Return YYYY-MM-DD format string
      onChange(date ? format(date, 'yyyy-MM-dd') : undefined)
    } else {
      // Return Date object
      onChange(date)
    }
    setOpen(false)
  }, [onChange, dateFormat])

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              type="text"
              readOnly
              value={displayValue}
              placeholder={placeholder}
              prefixIcon={prefixIcon}
              variant={errorMessage || variant === 'error' ? 'error' : 'default'}
              size={size}
              className={cn('cursor-pointer', disabled && 'cursor-not-allowed opacity-50')}
              disabled={disabled}
              required={required}
              onClick={() => !disabled && setOpen(true)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {errorMessage && (
        <div className="mt-1 flex items-center gap-1 text-12 text-red-500">
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}

