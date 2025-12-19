import * as React from 'react'
import { DayPicker, DayPickerProps } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CalendarProps = DayPickerProps

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, showOutsideDays = true, ...props }, ref) => {
    return (
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn('p-3', className)}
        classNames={{
          months:
            'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
          month: 'space-y-4',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-16 font-semibold text-gray-900',
          nav: 'space-x-1 flex items-center',
          nav_button: cn(
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            'border border-gray-300 rounded-md',
            'inline-flex items-center justify-center',
            'hover:bg-gray-100 transition-colors'
          ),
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex',
          head_cell: 'text-gray-500 rounded-md w-9 font-normal text-12',
          row: 'flex w-full mt-2',
          cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: cn(
            'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
            'rounded-md transition-colors',
            'hover:bg-gray-100',
            'focus:bg-gray-100 focus:text-gray-900'
          ),
          day_range_end: 'day-range-end',
          day_selected:
            'bg-brand-500 text-white hover:bg-brand-600 hover:text-white focus:bg-brand-500 focus:text-white',
          day_today: 'bg-gray-100 text-gray-900 font-semibold',
          day_outside:
            'day-outside text-gray-400 opacity-50 aria-selected:bg-gray-100/50 aria-selected:text-gray-400 aria-selected:opacity-30',
          day_disabled: 'text-gray-400 opacity-50',
          day_range_middle:
            'aria-selected:bg-gray-100 aria-selected:text-gray-900',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
    )
  }
)
Calendar.displayName = 'Calendar'

export { Calendar }
