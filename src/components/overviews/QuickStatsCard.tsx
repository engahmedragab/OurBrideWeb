import { useMemo } from 'react'
import type {
  MainServiceBookResponse,
  MainTodoBookResponse,
  MainGuestBookResponse,
} from '@/types/responses'
import { ProgressRing } from './ProgressRing'

type BookWithProgress = MainServiceBookResponse | MainTodoBookResponse
type BookType = BookWithProgress | MainGuestBookResponse

export interface QuickStatsCardProps {
  title: string
  book?: BookType
  eventId?: number
}

export const QuickStatsCard = ({ title, book, eventId }: QuickStatsCardProps) => {
  // Check if book is guest book (only has count, no completed/pending)
  const isGuestBook = useMemo(() => {
    if (!book) return false
    return 'count' in book && !('completed' in book) && !('pending' in book)
  }, [book])

  // For guest book: show only count without progress
  if (isGuestBook && book) {
    const guestBook = book as MainGuestBookResponse
    const count = guestBook.count || 5
    return (
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <h3 className="text-14 font-semibold text-gray-900 mb-8">{title}</h3>
        <div className="flex items-end justify-between  text-16 font-bold text-gray-900">
          <div>
            <p className="text-16 font-bold text-gray-900">{count} of guests</p>
          </div>
        </div>
      </div>
    )
  }

  // For books with progress (service, todo): calculate percentage
  if (book && 'completed' in book && 'pending' in book) {
    const progressBook = book as BookWithProgress
    
    // Calculate total: lines.length + pending (same logic as in my-events page)
    const total = useMemo(() => {
      const linesCount = progressBook.lines?.length || 0
      const pendingCount = progressBook.pending || 0
      return linesCount + pendingCount
    }, [progressBook.lines?.length, progressBook.pending])

    // Calculate percentage: (completed / total) * 100
    const percentage = useMemo(() => {
      const completed = progressBook.completed || 0
      if (total === 0) return 0
      return (completed / total) * 100
    }, [progressBook.completed, total])

    const completed = progressBook.completed || 0

    return (
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <h3 className="text-14 font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-16 font-bold text-gray-900">
              {completed} Out of {total}
            </p>
          </div>
          <ProgressRing percentage={percentage} />
        </div>
      </div>
    )
  }

  // Fallback: no book provided
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
      <h3 className="text-14 font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-16 font-bold text-gray-900">0</p>
        </div>
      </div>
    </div>
  )
}

