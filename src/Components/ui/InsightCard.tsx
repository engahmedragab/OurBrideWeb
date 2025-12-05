import { LucideIcon } from 'lucide-react'

export interface InsightCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  currency?: string
  className?: string
}

/**
 * InsightCard Component
 * Reusable card for displaying insights/metrics with icon, label, and value
 */
export const InsightCard = ({
  icon: Icon,
  label,
  value,
  currency = 'Egp',
  className = '',
}: InsightCardProps) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <p className="text-14 text-gray-600 mb-1">{label}</p>
        <p className="text-20 font-normal text-gray-900">
          {value} <span className="text-12 text-gray-500">{currency}</span>
        </p>
      </div>
    </div>
  )
}

