/**
 * Occasion Book Card Component
 * Displays occasion book with its lines
 */

import { cn } from '@/lib/utils'
import { Calendar } from 'lucide-react'
import type { MainOccasionBookResponse } from '@/types/responses'

interface OccasionBookCardProps {
  book: MainOccasionBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Invalid date'
  }
}

export function OccasionBookCard({
  book,
  onInit,
  onNavigate,
  eventId,
}: OccasionBookCardProps) {
  const activeLines = (book.lines || []).filter(line => !line.isDeleted)
  const needsInit = !book.isBookInit

  const handleClick = async () => {
    if (needsInit && onInit) {
      await onInit()
    }
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <div
      className={cn(
        'bg-white border rounded-2xl p-6',
        (onInit || onNavigate) &&
          'cursor-pointer hover:shadow-lg transition-shadow'
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-18 font-semibold text-gray-900">{book.title}</h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-2 py-1 text-12 font-medium rounded',
              needsInit
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            )}
          >
            {needsInit ? 'Needs Init' : 'Initialized'}
          </span>
          <span className="text-14 text-gray-500">
            {activeLines.length} occasions
          </span>
        </div>
      </div>

      {book.description && (
        <p className="text-14 text-gray-600 mb-4">{book.description}</p>
      )}

      {activeLines.length > 0 ? (
        <div className="space-y-3">
          {activeLines.map(line => (
            <div key={line.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-brand-500" />
                <span className="text-14 font-medium text-gray-900">
                  {line.titleEn || line.titleAr || 'Occasion'}
                </span>
              </div>
              <div className="text-12 text-gray-600">
                {formatDate(line.date)}
              </div>
              {line.subTitleEn || line.subTitleAr ? (
                <p className="text-14 text-gray-600 mt-1">
                  {line.subTitleEn || line.subTitleAr}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-14 text-gray-500 text-center py-4">
          No occasions yet
        </p>
      )}
    </div>
  )
}
