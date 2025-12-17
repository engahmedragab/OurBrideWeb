'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
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
  const [value, setValue] = useState<Value>(new Date())
  const [bigDays, setBigDays] = useState<string[]>([])

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
    setValue(date)
    if (date instanceof Date) {
      const dayId = format(date, 'yyyy-MM-dd')
      router.push(`/events/planning/calender/${dayId}`)
    }
  }

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = format(date, 'yyyy-MM-dd')
      const isSelected = value instanceof Date && format(date, 'yyyy-MM-dd') === format(value, 'yyyy-MM-dd')
      const isBigDay = bigDays.includes(dateKey)
      
      return cn(
        'hover:bg-brand-50 transition-colors rounded-lg',
        isSelected && 'bg-brand-500 text-white font-semibold',
        isBigDay && !isSelected && 'bg-brand-100 border-2 border-brand-500'
      )
    }
    return ''
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = format(date, 'yyyy-MM-dd')
      const isBigDay = bigDays.includes(dateKey)
      const isSelected = value instanceof Date && format(date, 'yyyy-MM-dd') === format(value, 'yyyy-MM-dd')
      
      if (isBigDay && !isSelected) {
        return (
          <div className="mt-1">
            <div className="bg-brand-500 text-white text-8 font-medium px-1 py-0.5 rounded">
              Big Day
            </div>
          </div>
        )
      }
    }
    return null
  }

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full">
        <Calendar
          onChange={handleDateChange}
          value={value}
          tileClassName={tileClassName}
          tileContent={tileContent}
          className="!w-full rounded-lg !shadow-none !border-none"
          minDate={new Date()}
        />
      </div>
    </div>
  )
}
