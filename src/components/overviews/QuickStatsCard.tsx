'use client'

import React, { useMemo } from 'react'
import type {
  MainServiceBookResponse,
  MainTodoBookResponse,
  MainGuestBookResponse,
} from '@/types/responses'
import { ProgressRing } from './ProgressRing'
import { useI18nTranslations } from '@/i18n/hooks'

type BookWithProgress = MainServiceBookResponse | MainTodoBookResponse
type BookType = BookWithProgress | MainGuestBookResponse

export interface QuickStatsCardProps {
  title: string
  book?: BookType
  eventId?: number
}

export const QuickStatsCard = ({ title, book }: QuickStatsCardProps) => {
  const t = useI18nTranslations('eventsPlanning')
  const tCards = useI18nTranslations('eventsPlanning.cards')


  const isGuestBook = useMemo(() => {
    if (!book) return false
    return 'count' in book && !('completed' in book) && !('pending' in book)
  }, [book])


  const progressBook = useMemo(() => {
    if (!book) return null
    if ('completed' in book && 'pending' in book) return book as BookWithProgress
    return null
  }, [book])


  const total = useMemo(() => {
    if (!progressBook) return 0
    const linesCount = progressBook.lines?.length || 0
    const pendingCount = progressBook.pending || 0
    return linesCount + pendingCount
  }, [progressBook])


  const percentage = useMemo(() => {
    if (!progressBook) return 0
    const completed = progressBook.completed || 0
    if (total === 0) return 0
    return (completed / total) * 100
  }, [progressBook, total])

  // ===== Guest book UI =====
  if (isGuestBook && book) {
    const guestBook = book as MainGuestBookResponse
    const count = guestBook.count || tCards('quickStats.zero')

    return (
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-14 font-semibold text-gray-900 mb-8">{title}</h3>

        <div className="flex items-end justify-between text-16 font-bold text-gray-900">
          <p className="text-16 font-bold text-gray-900">
            {tCards('quickStats.guestsCountText', { count })}
          </p>
        </div>
      </div>
    )
  }

  // ===== Progress book UI =====
  if (progressBook) {
    const completed = progressBook.completed || 0

    return (
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-14 font-semibold text-gray-900 mb-3">{title}</h3>

        <div className="flex items-center justify-between">
          <p className="text-16 font-bold text-gray-900">
            {t('common.outOf', { completed, total })}
          </p>

          <ProgressRing percentage={percentage} />
        </div>
      </div>
    )
  }

  // ===== Fallback =====
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
      <h3 className="text-14 font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="flex items-center justify-between">
        <p className="text-16 font-bold text-gray-900">{tCards('quickStats.zero')}</p>
      </div>
    </div>
  )
}
