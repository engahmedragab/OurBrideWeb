'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { FileText } from 'lucide-react'
import { MainNoteBookResponse } from '@/types/responses'

export interface NotesOverviewProps {
  book?: MainNoteBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

export const NotesOverview = ({
  book,
  onInit,
  onNavigate,
  eventId,
}: NotesOverviewProps) => {
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

  // Get active notes (not deleted) - use notes if available, otherwise use lines
  const activeNotes = useMemo(() => {
    const notes = book.notes || book.lines || []
    return notes.filter(note => !note.isDeleted)
  }, [book.notes, book.lines])

  // Sort by creation date (newest first)
  const sortedNotes = useMemo(() => {
    return [...activeNotes].sort((a, b) => {
      const dateA = new Date(a.creationDate).getTime()
      const dateB = new Date(b.creationDate).getTime()
      return dateB - dateA
    })
  }, [activeNotes])

  // Limit to first 3 notes for preview
  const displayNotes = useMemo(() => {
    return sortedNotes.slice(0, 3)
  }, [sortedNotes])

  const count = activeNotes.length

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">Notes</h2>
        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
        >
          View All ({count})
        </button>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {displayNotes.length > 0 ? (
          displayNotes.map((note: any) => {
            // Use title field, fallback to note field
            const noteTitle = note.title || note.note || 'Untitled Note'
            const noteContent = note.note || ''
            const date = note.lastModifiedDate || note.creationDate

            return (
              <div
                key={note.id}
                className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 flex items-start gap-3"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-brand-500" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <p className="text-14 font-semibold text-gray-900 line-clamp-1">
                    {noteTitle}
                  </p>
                  {noteContent && (
                    <p className="text-12 sm:text-13 text-gray-600 line-clamp-2">
                      {noteContent}
                    </p>
                  )}
                  {date && date !== '0001-01-01T00:00:00' && (
                    <p className="text-12 text-gray-500">
                      {format(new Date(date), 'dd/MM/yyyy')}
                    </p>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-14 text-gray-500 text-center py-4">No notes yet</p>
        )}
      </div>
    </div>
  )
}

