import { ProgressRing } from './ProgressRing'

export interface QuickStatsCardProps {
  title: string
  current: number
  total: number
  percentage: number
}

export const QuickStatsCard = ({ title, current, total, percentage }: QuickStatsCardProps) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
      <h3 className="text-14 font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-16 font-bold text-gray-900">
            {current} Out of {total}
          </p>
        </div>
        <ProgressRing percentage={percentage} />
      </div>
    </div>
  )
}

