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

  // Use actual values from API
  const completed = book.completed || 0
  const estimated = book.estimated ?? null // Can be null
  
  // Calculate totalPrice: use book.totalPrice if > 0, otherwise sum from lines
  const totalPrice = useMemo(() => {
    // If book.totalPrice exists and > 0, use it
    if (book.totalPrice && book.totalPrice > 0) {
      return book.totalPrice
    }
    // Otherwise, calculate from lines
    if (book.lines && book.lines.length > 0) {
      return book.lines.reduce((sum, line) => {
        return sum + (line.totalPrice || 0)
      }, 0)
    }
    return 0
  }, [book.totalPrice, book.lines])

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
            {/* <p className="text-12 text-gray-500 mt-1">Items completed</p> */}
          </div>
          <ProgressRing percentage={percentage} />
        </div>

        {/* Budget Info */}
        {(estimated !== null && estimated > 0) || totalPrice > 0 ? (
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {estimated !== null && estimated > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-12 text-gray-600">Estimated Budget</span>
                <span className="text-12 font-semibold text-gray-900">
                  {estimated.toLocaleString()} EGP
                </span>
              </div>
            )}
            {totalPrice > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-12 text-gray-600">Total Price</span>
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

