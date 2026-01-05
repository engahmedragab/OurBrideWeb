'use client'

import { Edit2, Trash2, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { NoteLineResponse } from '@/types/responses'

interface NoteCategoriesSidebarProps {
  notes: NoteLineResponse[]
  selectedNoteId: number | null
  onSelectNote: (id: number | null) => void
  onEditNote: (note: NoteLineResponse) => void
  onDeleteNote: (note: NoteLineResponse) => void
  onAddNew: () => void
}

export const NoteCategoriesSidebar = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onEditNote,
  onDeleteNote,
  onAddNew,
}: NoteCategoriesSidebarProps) => {
  const activeNotes = notes.filter(n => !n.isDeleted)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-16 font-semibold text-gray-900">Your notes</h2>

        <Button
          variant="outline"
          size="sm"
          onClick={onAddNew}
          className="text-brand-500 border-brand-500 hover:bg-brand-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {activeNotes.length === 0 ? (
          <p className="text-13 text-gray-500 text-center py-8">No lists yet</p>
        ) : (
          activeNotes.map(note => {
            const isSelected = selectedNoteId === note.id

            return (
              <div
                key={note.id}
                className={cn(
                  'group relative rounded-lg border p-3 transition-all cursor-pointer',
                  isSelected
                    ? 'border-brand-500 '
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                )}
                onClick={() => onSelectNote(note.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span
                      className={cn(
                        'text-14 font-medium truncate block',
                        isSelected
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-700'
                      )}
                    >
                      {note.title || 'Untitled List'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onEditNote(note)
                      }}
                      className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-brand-500 transition-colors"
                      aria-label="Edit note"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onDeleteNote(note)
                      }}
                      className="p-1.5 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      aria-label="Delete note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <ChevronRight className="h-4 w-4 text-gray-400 ml-1" />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
