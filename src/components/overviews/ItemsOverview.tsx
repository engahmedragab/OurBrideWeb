'use client'

import { useMemo } from 'react'
import { MainItemBookResponse } from '@/types/responses'
import { ProgressRing } from './ProgressRing'

export interface ItemsOverviewProps {
  book?: MainItemBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

export const ItemsOverview = ({
  book,
  onInit,
  onNavigate,
  eventId,
}: ItemsOverviewProps) => {
  if (!book) {
    return null
  }

  const needsInit = !book.isBookInit

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (needsInit && onInit) {
      await onInit()
    }
    if (onNavigate) {
      onNavigate()
    }
  }

  // Calculate total: lines.length + pending
  const total = useMemo(() => {
    const linesCount = book.lines?.length || 0
    const pendingCount = book.pending || 0
    return linesCount + pendingCount
  }, [book.lines?.length, book.pending])

  // Calculate percentage: (completed / total) * 100
  const percentage = useMemo(() => {
    const completed = book.completed || 0
    if (total === 0) return 0
    return (completed / total) * 100
  }, [book.completed, total])

  const completed = book.completed || 0
  const estimated = book.estimated || 0
  const totalPrice = book.totalPrice || 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">Items</h2>
        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
        >
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Progress Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-16 font-bold text-gray-900">
              {completed} Out of {total}
            </p>
            <p className="text-12 text-gray-500 mt-1">Items completed</p>
          </div>
          <ProgressRing percentage={percentage} />
        </div>

        {/* Budget Info */}
        {(estimated > 0 || totalPrice > 0) && (
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {estimated > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-13 text-gray-600">Estimated Budget</span>
                <span className="text-14 font-semibold text-gray-900">
                  {estimated.toLocaleString()} EGP
                </span>
              </div>
            )}
            {totalPrice > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-13 text-gray-600">Total Price</span>
                <span className="text-14 font-semibold text-gray-900">
                  {totalPrice.toLocaleString()} EGP
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

