'use client'

import { cn } from '@/lib'

export interface DailyTask {
  id: string
  title: string
  subtitle: string
  points: number
  completed: boolean
}

export interface DailyTasksSectionProps {
  tasks?: DailyTask[]
  restoreTime?: string
  className?: string
}

const defaultTasks: DailyTask[] = [
  {
    id: '1',
    title: 'View 3 Services/Products',
    subtitle: 'Explore the marketplace',
    points: 50,
    completed: false,
  },
  {
    id: '2',
    title: 'Add to Favorites',
    subtitle: 'Save at least 1 service/product',
    points: 50,
    completed: false,
  },
  {
    id: '3',
    title: 'Share a Post',
    subtitle: 'Tell your story and Share a post in the community',
    points: 50,
    completed: false,
  },
  {
    id: '4',
    title: 'Send a Message',
    subtitle: 'Interact with a provider/client',
    points: 50,
    completed: true,
  },
]

export function DailyTasksSection({
  tasks = defaultTasks,
  restoreTime = '23 H 59 M',
  className,
}: DailyTasksSectionProps) {
  return (
    <div className={cn('p-4 sm:p-5 shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-14 sm:text-16 sm:mb-4 flex-wrap gap-2">
        <h2 className="font-normal text-gray-900">Daily Tasks</h2>
        <p className="text-gray-400">Restore in : {restoreTime}</p>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 lg:space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-xl',
              'border border-gray-300 shadow-sm',
              'transition-all'
            )}
          >
            {/* Left side */}
            <div className="flex flex-col">
              <p className="text-12 sm:text-14 font-normal text-gray-900">{task.title}</p>
              <p className="text-10 sm:text-12 font-normal text-gray-500 mt-0.5">
                {task.subtitle}
              </p>
            </div>

            {/* Right side */}
            <div className="flex items-center text-10 sm:text-12 lg:text-14">
              <span
                className={cn(
                  'font-semibold whitespace-nowrap',
                  task.completed ? 'text-green-500' : 'text-gray-400'
                )}
              >
                {task.completed ? `Done +${task.points} Points` : `${task.points} Points`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
