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
      <div className="space-y-3 sm:space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 sm:p-5 flex items-start gap-2 sm:gap-3">
            <Checkbox
              checked={task.completed}
              onChange={() => {}}
              variant={task.completed ? 'successFilled' : 'gray'}
              shape="circle"
              size="sm"
              className="flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <p className={cn(
                'text-12 sm:text-13 md:text-14',
                task.completed ? 'line-through text-gray-400' : 'text-gray-900'
              )}>
                {task.description}
              </p>
              <p className="text-12 text-gray-500">
                Due : {format(new Date(task.dueDate), 'dd/MM/yyyy')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

