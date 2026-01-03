'use client'

import { cn } from '@/lib/utils'

export interface Statistic {
  value: string
  label: string
}

export interface StatisticsSectionProps {
  headline: string
  tagline: string
  mainStatistic: {
    value: string
    label: string
  }
  statistics: Statistic[]
  className?: string
  mainStatisticColor?: string
}

/**
 * StatisticsSection Component
 * Displays platform statistics with a prominent main statistic and supporting stats
 */
export const StatisticsSection = ({
  headline,
  tagline,
  mainStatistic,
  statistics,
  className,
  mainStatisticColor = 'text-brand-500',
}: StatisticsSectionProps) => {
  return (
    <section className={cn('py-16 sm:py-20 md:py-24 lg:py-32 bg-white', className)}>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-32 sm:text-40 md:text-48 lg:text-56 xl:text-64 font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {headline}
          </h2>

          {/* Tagline */}
          <p className="text-16 sm:text-18 md:text-20 text-gray-700 mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto">
            {tagline}
          </p>

          {/* Main Statistic */}
          <div className="mb-16 sm:mb-20 md:mb-24">
            <div className={cn('text-48 sm:text-64 md:text-80 lg:text-96 xl:text-[120px] font-bold mb-4 sm:mb-6', mainStatisticColor)}>
              {mainStatistic.value}
            </div>
            <p className="text-18 sm:text-20 md:text-24 text-gray-700">
              {mainStatistic.label}
            </p>
          </div>

          {/* Supporting Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-16">
            {statistics.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-32 sm:text-40 md:text-48 lg:text-56 font-bold text-gray-900 mb-2 sm:mb-3">
                  {stat.value}
                </div>
                <p className="text-14 sm:text-16 md:text-18 text-gray-700 text-center">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}



