import { cn } from '@/lib/utils'

export interface WeekDay {
  day: number
  label: string
  date: Date
  isSelected?: boolean
}

export interface EventWeekHeaderProps {
  weekDays: WeekDay[]
  onDaySelect?: (date: Date) => void
  className?: string
}

/**
 * EventWeekHeader Component
 * Displays the week day selector row with circular day buttons
 */
export const EventWeekHeader = ({
  weekDays,
  onDaySelect,
  className,
}: EventWeekHeaderProps) => {
  return (
    <div
      className={cn(
        'flex gap-6 md:gap-12 items-center overflow-x-auto',
        className
      )}
    >
      {weekDays.map(weekDay => (
        <div
          key={`${weekDay.date.getTime()}`}
          className="flex flex-1 flex-col gap-2 items-center min-w-[60px]"
        >
          <button
            onClick={() => onDaySelect?.(weekDay.date)}
            className={cn(
              'flex flex-col h-11 items-center justify-center p-2.5 rounded-full w-11 transition-colors',
              weekDay.isSelected
                ? 'bg-brand-100'
                : 'bg-gray-100 hover:bg-gray-200'
            )}
          >
            <p
              className={cn(
                'text-20 font-normal text-center whitespace-pre-wrap',
                weekDay.isSelected ? 'text-brand-500' : 'text-gray-400'
              )}
            >
              {weekDay.day}
            </p>
          </button>
          <p
            className={cn(
              'text-16 font-normal text-center whitespace-pre-wrap min-w-full',
              weekDay.isSelected ? 'text-gray-900' : 'text-gray-400'
            )}
          >
            {weekDay.label}
          </p>
        </div>
      ))}
    </div>
  )
}
