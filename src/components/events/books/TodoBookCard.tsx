/**
 * Todo Book Card Component
 * Displays todo book with its lines
 */

import { cn } from '@/lib/utils'
import type { MainTodoBookResponse } from '@/types/responses'

interface TodoBookCardProps {
  book: MainTodoBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

export function TodoBookCard({ book, onInit, onNavigate }: TodoBookCardProps) {
  const activeLines = (book.lines || []).filter(line => !line.isDeleted)
  const completedCount = activeLines.filter(line => line.isDone).length
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
        "bg-white border rounded-2xl p-6",
        (onInit || onNavigate) && "cursor-pointer hover:shadow-lg transition-shadow"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-18 font-semibold text-gray-900">{book.title}</h3>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2 py-1 text-12 font-medium rounded",
            needsInit
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          )}>
            {needsInit ? "Needs Init" : "Initialized"}
          </span>
          <span className="text-14 text-gray-500">
            {completedCount}/{activeLines.length} completed
          </span>
        </div>
      </div>

      {book.description && (
        <p className="text-14 text-gray-600 mb-4">{book.description}</p>
      )}

      {activeLines.length > 0 ? (
        <div className="space-y-2">
          {activeLines.map(line => (
            <div
              key={line.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    line.isDone ? 'bg-green-500' : 'bg-gray-300'
                  )}
                />
                <span className="text-14 text-gray-900">
                  Todo #{line.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-14 text-gray-500 text-center py-4">No todos yet</p>
      )}

      {book.completed !== undefined && book.pending !== undefined && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-14 text-gray-600">Completed: {book.completed}</span>
            <span className="text-14 text-gray-600">Pending: {book.pending}</span>
          </div>
        </div>
      )}
    </div>
  )
}


