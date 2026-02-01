'use client'

import React, { useCallback, useMemo } from 'react'
import { FileText } from 'lucide-react'
import type { MainNoteBookResponse, NoteLineResponse } from '@/types/responses'
import { useI18nTranslations } from '@/i18n/hooks'

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
}: NotesOverviewProps) => {
  const t = useI18nTranslations('eventsPlanning')
  const needsInit = !!book && !book.isBookInit

  // Get active notes (not deleted) - use notes if available, otherwise use lines
  const activeNotes = useMemo<NoteLineResponse[]>(() => {
    if (!book) return []
    const notes = (book.notes || book.lines || []) as NoteLineResponse[]
    return notes.filter((note) => !note?.isDeleted)
  }, [book])

  // Sort by lastModifiedDate (newest first), fallback to creationDate
  const sortedNotes = useMemo(() => {
    return [...activeNotes].sort((a, b) => {
      const dateA = new Date(a.lastModifiedDate || a.creationDate || 0).getTime()
      const dateB = new Date(b.lastModifiedDate || b.creationDate || 0).getTime()
      return dateB - dateA
    })
  }, [activeNotes])

  // Limit to first 3 notes for preview
  const displayNotes = useMemo(() => sortedNotes.slice(0, 3), [sortedNotes])

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()

      if (needsInit && onInit) {
        await onInit()
      }

      onNavigate?.()
    },
    [needsInit, onInit, onNavigate]
  )

  // ✅ safe early render after hooks
  if (!book) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">{t('sideMenu.tabs.notes')}</h2>

        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
          type="button"
        >
          {t('common.viewAll')}
        </button>
      </div>

      <div className="space-y-3">
        {displayNotes.length > 0 ? (
          displayNotes.map((note) => {
            const rawTitle = note.title?.trim()
            const rawContent = note.note?.trim() || ''

            const noteTitle =
              rawTitle ||
              (rawContent
                ? rawContent.substring(0, 50) + (rawContent.length > 50 ? '...' : '')
                : t('common.untitledNote'))

            return (
              <button
                key={note.id}
                type="button"
                onClick={handleClick}
                className="w-full text-left bg-white rounded-lg border border-gray-200 p-3 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-start gap-3"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                    <FileText className="w-full h-full text-brand-500" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1.5 items-start">
                  <p className="text-13 font-semibold text-gray-900 line-clamp-1">
                    {noteTitle}
                  </p>

                  {rawContent && (
                    <p className="text-12 text-gray-600 line-clamp-2">{rawContent}</p>
                  )}
                </div>
              </button>
            )
          })
        ) : (
            <p className="text-13 text-gray-500 text-center py-6">{t('common.noNotes')}</p>
        )}
      </div>
    </div>
  )
}
