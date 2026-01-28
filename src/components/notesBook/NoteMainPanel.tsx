'use client'

import { Plus, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { NoteLineResponse } from '@/types/responses'
import { useI18nTranslations } from '@/i18n' // ✅ add

interface NoteMainPanelProps {
  note: NoteLineResponse | null
  onAddNew: () => void
  onEdit: () => void
}

export default function NoteMainPanel({ note, onAddNew, onEdit }: NoteMainPanelProps) {
  const t = useI18nTranslations('eventsPlanning.notes') // ✅

  if (!note) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-16 text-gray-500 mb-4">{t('main.empty.title')}</p>
          <Button variant="outline" size="sm" onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-1" />
            {t('main.empty.cta')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h1 className="text-24 font-semibold text-gray-900">
          {note.title || t('sidebar.untitled')}
        </h1>

        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit2 className="h-4 w-4 mr-1" />
          {t('main.edit')}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <p className="text-14 text-gray-700 whitespace-pre-wrap leading-relaxed">
          {note.note || t('main.dash')}
        </p>
      </div>
    </div>
  )
}
