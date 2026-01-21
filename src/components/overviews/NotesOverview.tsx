'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { FileText } from 'lucide-react'
import { MainNoteBookResponse } from '@/types/responses'
import type { NoteLineResponse } from '@/types/responses'

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
    const notes = (book.notes || book.lines || []) as NoteLineResponse[]
    return notes.filter((note: NoteLineResponse) => !note?.isDeleted)
  }, [book.notes, book.lines])

  // Sort by lastModifiedDate (newest first), fallback to creationDate
  const sortedNotes = useMemo(() => {
    return [...activeNotes].sort((a: NoteLineResponse, b: NoteLineResponse) => {
      const dateA = new Date(a.lastModifiedDate || a.creationDate || 0).getTime()
      const dateB = new Date(b.lastModifiedDate || b.creationDate || 0).getTime()
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
          type="button"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {displayNotes.length > 0 ? (
          displayNotes.map((note: NoteLineResponse) => {
            // Use title field, fallback to note field (first 50 chars)
            const noteTitle = note.title || (note.note ? note.note.substring(0, 50) + (note.note.length > 50 ? '...' : '') : 'Untitled Note')
            const noteContent = note.note || ''
            const date = note.lastModifiedDate || note.creationDate

            return (
              <button
                key={note.id}
                type="button"
                onClick={handleClick}
                className="w-full text-left bg-white rounded-lg border border-gray-200 p-3 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-start gap-3"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-lg  flex items-center justify-center">
                    <FileText className="w-full h-full text-brand-500" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <p className="text-13 font-semibold text-gray-900 line-clamp-1">
                    {noteTitle}
                  </p>
                  {noteContent && noteContent.length > 0 && (
                    <p className="text-12 text-gray-600 line-clamp-2">
                      {noteContent}
                    </p>
                  )}
                  {/* {date && date !== '0001-01-01T00:00:00' && (
                    <p className="text-11 text-gray-500">
                      {format(new Date(date), 'dd MMM, yyyy')}
                    </p>
                  )} */}
                </div>
              </button>
            )
          })
        ) : (
          <p className="text-13 text-gray-500 text-center py-6">No notes yet</p>
        )}
      </div>
    </div>
  )
}

