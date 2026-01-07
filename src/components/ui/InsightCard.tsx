import * as React from 'react'

type InsightIcon = React.ComponentType<{ className?: string }>

export interface InsightCardProps {
  icon: InsightIcon
  label: string
  value: number | string
  currency?: string // مثال: "Points" أو "Egp" — لو مش عايزها سيبها undefined
  className?: string
}

export const InsightCard: React.FC<InsightCardProps> = ({
  icon: Icon,
  label,
  value,
  currency,
  className = '',
}) => {
  const showCurrency = Boolean(currency)

  return (
    <div
      className={[
        'w-full rounded-lg border border-gray-400/40 shadow-sm',
        'px-4 py-3',
        className,
      ].join(' ')}
    >
      {/* Icon */}
      <Icon className="h-7 w-7 text-gray-900 font-normal" />

      {/* Label */}
      <p className="mt-4 md:text-[15px] text-12  font-normal text-gray-900">{label}</p>

      {/* Value + Currency */}
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="md:text-16 text-12  font-normal text-gray-500 tabular-nums leading-none">
          {value}
        </p>

        {showCurrency ? (
          <span className="md:text-[16px] text-12  font-normal text-gray-900/50 leading-none">
            {currency}
          </span>
        ) : null}
      </div>
    </div>
  )
}
