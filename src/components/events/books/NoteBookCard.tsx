/**
 * Note Book Card Component
 * Displays note book with its lines
 */

import { cn } from '@/lib/utils'
import type { MainNoteBookResponse } from '@/types/responses'

interface NoteBookCardProps {
  book: MainNoteBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

export function NoteBookCard({ book, onInit, onNavigate }: NoteBookCardProps) {
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
            {activeLines.length} notes
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
              <h4 className="text-14 font-medium text-gray-900 mb-1">
                {line.title}
              </h4>
              <p className="text-14 text-gray-600">{line.note}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-14 text-gray-500 text-center py-4">No notes yet</p>
      )}
    </div>
  )
}
