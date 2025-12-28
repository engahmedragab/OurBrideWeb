'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/Checkbox'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { MainTodoBookResponse } from '@/types/responses'

export interface TasksReminderProps {
  book: MainTodoBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

export const TasksReminder = ({ book, onInit, onNavigate, eventId }: TasksReminderProps) => {
  // Get active lines (not deleted) - use todos if available, otherwise use lines
  const activeLines = useMemo(() => {
    const lines = book.todos || book.lines || []
    return lines.filter(line => !line.isDeleted)
  }, [book.todos, book.lines])

  // Sort: incomplete tasks first, then by creation date
  const sortedLines = useMemo(() => {
    return [...activeLines].sort((a, b) => {
      // Incomplete tasks first
      if (a.isDone !== b.isDone) {
        return a.isDone ? 1 : -1
      }
      // Then sort by creation date (newest first)
      const dateA = new Date(a.creationDate).getTime()
      const dateB = new Date(b.creationDate).getTime()
      return dateB - dateA
    })
  }, [activeLines])

  // Limit to first 3 tasks for preview
  const displayTasks = useMemo(() => {
    return sortedLines.slice(0, 3)
  }, [sortedLines])

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

  // Build href for navigation
  const href = {onNavigate}

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">Tasks Reminder</h2>
        <button
         
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
        >
          View All Tasks
        </button>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {displayTasks.length > 0 ? (
          displayTasks.map(line => {
            // Use task field as the task name/description
            const taskName = line.task
            // Use creationDate as dueDate fallback, or lastModifiedDate
            const dueDate = line.lastModifiedDate || line.creationDate

            return (
              <div
                key={line.id}
                className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 sm:p-5 flex items-start gap-2 sm:gap-3"
              >
                <Checkbox
                  checked={line.isDone}
                  onChange={() => {}}
                  variant={line.isDone ? 'successFilled' : 'gray'}
                  shape="circle"
                  size="sm"
                  className="flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <p
                    className={cn(
                      'text-12 sm:text-13 md:text-14',
                      line.isDone ? 'line-through text-gray-400' : 'text-gray-900'
                    )}
                  >
                    {taskName}
                  </p>
                  {dueDate && dueDate !== '0001-01-01T00:00:00' && (
                    <p className="text-12 text-gray-500">
                      Due : {format(new Date(dueDate), 'dd/MM/yyyy')}
                    </p>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-14 text-gray-500 text-center py-4">No tasks yet</p>
        )}
      </div>
    </div>
  )
}

