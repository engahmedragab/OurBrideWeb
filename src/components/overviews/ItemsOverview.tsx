'use client'

import React, { useCallback, useMemo } from 'react'
import { MainItemBookResponse } from '@/types/responses'
import { ProgressRing } from './ProgressRing'
import { useI18nTranslations } from '@/i18n/hooks'

export interface ItemsOverviewProps {
  book?: MainItemBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

export const ItemsOverview = ({ book, onInit, onNavigate }: ItemsOverviewProps) => {
  const t = useI18nTranslations('eventsPlanning')
  const tCards = useI18nTranslations('eventsPlanning.cards')

  const needsInit = !!book && !book.isBookInit

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (needsInit && onInit) await onInit()
      onNavigate?.()
    },
    [needsInit, onInit, onNavigate]
  )

  const total = useMemo(() => {
    if (!book) return 0
    const linesCount = book.lines?.length || 0
    const pendingCount = book.pending || 0
    return linesCount + pendingCount
  }, [book])

  const percentage = useMemo(() => {
    if (!book) return 0
    const completed = book.completed || 0
    if (total === 0) return 0
    return (completed / total) * 100
  }, [book, total])

  const completed = book?.completed || 0
  const estimated = book?.estimated ?? null

  // ✅ نفس اللوجيك القديم: استخدم totalPrice لو >0 وإلا احسب من lines
  const totalPrice = useMemo(() => {
    if (!book) return 0

    if (book.totalPrice && book.totalPrice > 0) return book.totalPrice

    if (book.lines && book.lines.length > 0) {
      return book.lines.reduce((sum, line) => sum + (line.totalPrice || 0), 0)
    }

    return 0
  }, [book])

  // ✅ safe early return بعد hooks
  if (!book) return null

  const showBudgetInfo = (estimated !== null && estimated > 0) || totalPrice > 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">{tCards('items.title')}</h2>
        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
          type="button"
        >
          {t('common.viewAll')}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-16 font-bold text-gray-900">
            {t('common.outOf', { completed, total })}
          </p>
          <ProgressRing percentage={percentage} />
        </div>

        {showBudgetInfo ? (
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {estimated !== null && estimated > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-12 text-gray-600">{tCards('items.estimatedBudget')}</span>
                <span className="text-12 font-semibold text-gray-900">
                  {estimated.toLocaleString()} EGP
                </span>
              </div>
            )}

            {totalPrice > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-12 text-gray-600">{tCards('items.totalPrice')}</span>
                <span className="text-12 font-semibold text-gray-900">
                  {totalPrice.toLocaleString()} EGP
                </span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
