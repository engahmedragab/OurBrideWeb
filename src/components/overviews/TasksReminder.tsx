'use client'

import React, { useCallback, useMemo } from 'react'
import { Checkbox } from '@/components/ui/Checkbox'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { MainTodoBookResponse, TodoLineResponse } from '@/types/responses'
import { useI18nTranslations } from '@/i18n/hooks'

export interface TasksReminderProps {
  book: MainTodoBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

export const TasksReminder = ({ book, onInit, onNavigate }: TasksReminderProps) => {
  const t = useI18nTranslations('eventsPlanning')
  const tCards = useI18nTranslations('eventsPlanning.cards')

  // Get active lines (not deleted) - use todos if available, otherwise use lines
  const activeLines = useMemo(() => {
    const lines = (book.todos || book.lines || []) as TodoLineResponse[]
    return lines.filter((line) => !line?.isDeleted)
  }, [book.todos, book.lines])

  // Sort: incomplete tasks first, then by lastModifiedDate (newest first)
  const sortedLines = useMemo(() => {
    return [...activeLines].sort((a, b) => {
      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1
      const dateA = new Date(a.lastModifiedDate || a.creationDate || 0).getTime()
      const dateB = new Date(b.lastModifiedDate || b.creationDate || 0).getTime()
      return dateB - dateA
    })
  }, [activeLines])

  // Limit to first 3 tasks for preview
  const displayTasks = useMemo(() => sortedLines.slice(0, 3), [sortedLines])

  const needsInit = !book.isBookInit

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (needsInit && onInit) await onInit()
      onNavigate?.()
    },
    [needsInit, onInit, onNavigate]
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">{tCards('tasks.title')}</h2>

        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
          type="button"
        >
          {t('common.viewAll')}
        </button>
      </div>

      <div className="space-y-3">
        {displayTasks.length > 0 ? (
          displayTasks.map((line) => {
            const taskName = line.task || t('common.untitledTask')
            const dueDate = line.lastModifiedDate || line.creationDate

            return (
              <button
                key={line.id}
                type="button"
                onClick={handleClick}
                className="w-full text-left bg-white rounded-lg border border-gray-200 p-3 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-start gap-3"
              >
                <Checkbox
                  checked={line.isDone}
                  onChange={() => {}}
                  variant={line.isDone ? 'successFilled' : 'gray'}
                  shape="circle"
                  size="sm"
                  className="flex-shrink-0 mt-0.5"
                />

                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <p
                    className={cn(
                      'text-13 font-semibold text-left rtl:text-right',
                      line.isDone ? 'line-through text-gray-400' : 'text-gray-900'
                    )}
                  >
                    {taskName}
                  </p>

                  {dueDate && dueDate !== '0001-01-01T00:00:00' && (
                    <p className="text-11 text-gray-500 text-left rtl:text-right">
                      {format(new Date(dueDate), 'dd MMM, yyyy')}
                    </p>
                  )}
                </div>
              </button>
            )
          })
        ) : (
          <p className="text-13 text-gray-500 text-center py-6">{tCards('tasks.empty')}</p>
        )}
      </div>
    </div>
  )
}
