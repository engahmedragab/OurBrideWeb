'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'
import { cn } from '@/lib/utils'
import { YearSelector, MonthSelector } from '@/components/planning'
import { formatDateSafe, getToday } from '@/lib/date-utils'
import 'react-calendar/dist/Calendar.css'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

const BIG_DAY_STORAGE_KEY = 'ourbride_big_days'

const getBigDays = (): string[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(BIG_DAY_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export default function CalenderPage() {
  const router = useRouter()
  const today = getToday()
  const [value, setValue] = useState<Value>(today)
  const [bigDays, setBigDays] = useState<string[]>([])
  const [activeStartDate, setActiveStartDate] = useState<Date>(today)
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())

  useEffect(() => {
    setBigDays(getBigDays())
    
    const handleStorageChange = () => {
      setBigDays(getBigDays())
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setBigDays(getBigDays())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleDateChange = (date: Value) => {
    if (date instanceof Date) {
      const safeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)
      setValue(safeDate)
      const dayId = formatDateSafe(safeDate)
      router.push(`/events/planning/calender/${dayId}`)
    }
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    const newDate = new Date(year, selectedMonth, 1, 12, 0, 0)
    setActiveStartDate(newDate)
  }

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month)
    const newDate = new Date(selectedYear, month, 1, 12, 0, 0)
    setActiveStartDate(newDate)
  }

  const handleActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
    if (activeStartDate) {
      const safeDate = new Date(activeStartDate.getFullYear(), activeStartDate.getMonth(), 1, 12, 0, 0)
      setActiveStartDate(safeDate)
      setSelectedYear(safeDate.getFullYear())
      setSelectedMonth(safeDate.getMonth())
    }
  }

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = formatDateSafe(date)
      const isBigDay = bigDays.includes(dateKey)
      
      return cn(
        'w-full hover:bg-brand-50 transition-colors rounded-lg',
        isBigDay && 'bg-brand-100 border-2 border-brand-500'
      )
    }
    return ''
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = formatDateSafe(date)
      const safeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)
      const isBigDay = bigDays.includes(dateKey)
      const dayNumber = safeDate.getDate()
      
      return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-0.5">
          <div className="text-sm sm:text-base md:text-lg font-normal text-gray-900">
            {dayNumber}
          </div>
          {isBigDay && (
            <div className="mt-0.5">
              <div className="bg-brand-500 text-white text-[10px] md:text-xs font-medium px-0.5 py-[1px] md:px-1 md:py-0.5 rounded">
                Big Day
              </div>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full">
        <div className="mb-6 flex items-center gap-4 justify-center">
          <YearSelector
            selectedYear={selectedYear}
            onChange={handleYearChange}
          />
          <MonthSelector
            selectedMonth={selectedMonth}
            onChange={handleMonthChange}
          />
        </div>

        <Calendar
          onChange={handleDateChange}
          value={value}
          activeStartDate={activeStartDate}
          onActiveStartDateChange={handleActiveStartDateChange}
          tileClassName={tileClassName}
          tileContent={tileContent}
          formatDay={() => ''}
          className="!w-full rounded-lg !shadow-none !border-none"
          minDate={today}
          calendarType="iso8601"
          showFixedNumberOfWeeks={true}
          showNeighboringMonth={true}
        />
      </div>
    </div>
  )
}
