'use client'

import Link from 'next/link'
import { Checkbox } from '@/components/ui/Checkbox'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export interface Task {
  id: string | number
  description: string
  dueDate: string | Date
  completed: boolean
}

export interface TasksReminderProps {
  tasks: Task[]
  viewAllHref?: string
}

export const TasksReminder = ({ tasks, viewAllHref = '#' }: TasksReminderProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">Tasks Reminder</h2>
        <Link
          href={viewAllHref}
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
        >
          View All Tasks
        </Link>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-3 flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onChange={() => {}}
              variant={task.completed ? 'successFilled' : 'gray'}
              shape="circle"
              size="sm"
              className="mt-0.5 flex-shrink-0"
            />
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-13 mb-1',
                  task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                )}>
                  {task.description}
                </p>
              </div>
              <p className="text-11 text-gray-500 flex-shrink-0">
                Due : {format(new Date(task.dueDate), 'dd/MM/yyyy')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

