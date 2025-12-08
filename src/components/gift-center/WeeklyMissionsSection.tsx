'use client'

import { MissionCard, type MissionCardProps } from './MissionCard'

/**
 * Weekly Missions Section Component Props
 */
export interface WeeklyMissionsSectionProps {
  title?: string
  resetLabel?: string
  resetCountdown: string
  missions: MissionCardProps[]
}

/**
 * Weekly Missions Section Component
 * Displays weekly missions with countdown timer
 */
export const WeeklyMissionsSection = ({
  title = 'Weekly Missions',
  resetLabel = 'Restore in',
  resetCountdown,
  missions,
}: WeeklyMissionsSectionProps) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-2.5 items-start w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-1.5 sm:gap-0 mb-2 sm:mb-3">
        <p className="text-14 sm:text-16 font-normal text-gray-900 leading-4 sm:leading-5">{title}</p>
        <p className="text-12 sm:text-14 font-normal text-gray-500 leading-3 sm:leading-4">
          {resetLabel} : {resetCountdown}
        </p>
      </div>

      {/* Missions List */}
      <div className="flex flex-col gap-2 sm:gap-2.5 items-start w-full">
        {missions.map((mission, index) => (
          <MissionCard key={index} {...mission} className='w-full'/>
        ))}
      </div>
    </div>
  )
}

