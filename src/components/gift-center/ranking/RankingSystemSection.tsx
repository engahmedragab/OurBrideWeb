'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  BronzeIcon,
  SilverIcon,
  GoldIcon,
  BlueRankIcon,
  PinkRankIcon,
  RedRankIcon,
} from '@/assets/rank/rankingIcons'
import rankingBackground from '@/assets/images/ranking.png'

export type RankKey = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'topMember'

export interface RankingIcon {
  icon: React.ComponentType<{ className?: string }>
  label: string
  /** Optional display points under icon (like "200 Points") */
  points: number
  rankKey: RankKey
}

export interface RankProgressMeta {
  /** Text under the dot مثل "600 / 600" */
  valueText: string
}

export interface RankingSystemSectionProps {
  /** Active step index (0-based) */
  currentStep?: number
  rankingIcons?: RankingIcon[]
  /** Optional override current rank card */
  currentRank?: RankingIcon
  /** Total points shown in the banner */
  totalPoints?: number
  


   
  progressMeta?: RankProgressMeta[]
}

const defaultRankingIcons: RankingIcon[] = [
  { icon: BronzeIcon, label: 'Bronze', points: 200, rankKey: 'bronze' },
  { icon: SilverIcon, label: 'Silver', points: 200, rankKey: 'silver' },
  { icon: GoldIcon, label: 'Gold', points: 200, rankKey: 'gold' },
  { icon: BlueRankIcon, label: 'Platinum', points: 200, rankKey: 'platinum' },
  { icon: PinkRankIcon, label: 'Diamond', points: 200, rankKey: 'diamond' },
  { icon: RedRankIcon, label: 'Top Member', points: 200, rankKey: 'topMember' },
]

const defaultProgressMeta: RankProgressMeta[] = [
  { valueText: '600 / 600' },
  { valueText: '0 / 1200' },
  { valueText: '0 / 2000' },
  { valueText: '0 / 2500' },
  { valueText: '0 / 3000' },
  { valueText: '' },
]

function clampStep(step: number, total: number): number {
  if (total <= 0) return 0
  if (step < 0) return 0
  if (step > total - 1) return total - 1
  return step
}

function RankProgressBar({
  totalSteps,
  currentStep,
  progressMeta,
}: {
  totalSteps: number
  currentStep: number
  progressMeta: RankProgressMeta[]
}) {
  const safeTotal = Math.max(1, totalSteps)
  const safeStep = clampStep(currentStep, safeTotal)

  // Fill ends exactly at the active dot (like the screenshot)
  const fillPercent =
    safeTotal === 1 ? 0 : (safeStep / (safeTotal - 1)) * 100

  return (
    <div className="w-full">
      <div className="relative px-0.5 sm:px-0.5 md:px-1 lg:px-2">
        {/* Base line */}
        <div className="h-[1.5px] sm:h-[2px] md:h-0.5 lg:h-1 rounded-full bg-gray-200" />

        {/* Filled line */}
        <div
          className="absolute left-0.5 sm:left-0.5 md:left-1 lg:left-2 top-0 h-[1.5px] sm:h-[2px] md:h-0.5 lg:h-1 rounded-full bg-red-500"
          style={{ width: `calc(${fillPercent}% - ${safeTotal === 1 ? '0' : '1'}px)` }}
        />

        {/* Dots */}
        <div className="absolute inset-0 -top-[2px] sm:-top-[3px] md:-top-0.5 lg:-top-1 flex items-center justify-between">
          {Array.from({ length: safeTotal }).map((_, idx) => {
            const isActive = idx <= safeStep
            return (
              <div key={idx} className="relative flex items-center justify-center">
                <span
                  className={[
                    'h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5 rounded-full',
                    isActive ? 'bg-red-500' : 'bg-gray-300',
                  ].join(' ')}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Values under dots */}
      <div className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-3 px-0.5 sm:px-0.5 md:px-1 lg:px-2">
        <div className="flex items-start justify-between gap-0 sm:gap-0 md:gap-0.5 lg:gap-1">
          {Array.from({ length: safeTotal }).map((_, idx) => {
            const text = progressMeta[idx]?.valueText ?? ''
            return (
              <div key={idx} className="min-w-0 flex-1 text-center">
                <p className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-11 font-medium text-gray-400 leading-tight">
                  {text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function RankingSystemSection({
  currentStep = 0,
  rankingIcons = defaultRankingIcons,
  currentRank,
  totalPoints,
  
  progressMeta,
}: RankingSystemSectionProps) {
 

  const safeStep = clampStep(currentStep, rankingIcons.length)
  const rank = currentRank ?? rankingIcons[safeStep]
  const CurrentRankIcon = rank.icon
  const displayPoints = totalPoints ?? rank.points

  const meta =
    progressMeta && progressMeta.length === rankingIcons.length
      ? progressMeta
      : defaultProgressMeta.slice(0, rankingIcons.length)

  
  return (
    <section className="w-full rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
    

      {/* Banner (top card with background image) */}    <div className="mt-2 px-2  md:px-0 md:mt-0 ">
      <div className="relative overflow-hidden rounded-xl min-h-[90px] sm:min-h-[140px] md:rounded-none">
  <Image
    src={rankingBackground}
    alt="Ranking background"
    fill
    priority
    className="object-cover"
  />

          {/* ✅ Dark overlay بدل الأبيض */}
          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139, 124, 124, 0.1),transparent_90%)]" />

          <div className="relative z-10 flex flex-col items-center justify-center py-4 sm:py-2.5 md:py-4 lg:py-6 xl:py-7 gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2">
            <CurrentRankIcon className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-12 xl:w-12" />

            <div className="text-center px-1 sm:px-1.5 md:px-2">
              <p className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] xl:text-13 text-white/80 leading-tight">
                Current Rank{' '}
                <span className="text-white font-semibold">{rank.label}</span>
              </p>
              <p className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] xl:text-13 text-white/80 leading-tight mt-0.5">
                Total Points :{' '}
                <span className="text-white font-semibold">{displayPoints}</span>{' '}
                Points
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom content */}
      <div className="px-1.5 sm:px-2 md:px-3 lg:px-4 xl:px-5 pb-2 sm:pb-3 md:pb-4 lg:pb-5 xl:pb-6">
        {/* Icons row */}
        <div className="mt-1.5 sm:mt-2 md:mt-3 lg:mt-4">
          <div className="flex items-start justify-between  sm:gap-1.5 md:gap-1 lg:gap-3 xl:gap-4 overflow-x-auto pb-1 sm:pb-1.5 md:pb-2 -mx-0.5 sm:-mx-0.5 md:-mx-1 px-0.5 sm:px-0.5 md:px-1 scrollbar-hide">
            {rankingIcons.map((rankItem, index) => {
              const Icon = rankItem.icon
              return (
                <div
                  key={rankItem.rankKey}
                  className="flex flex-col items-center flex-shrink-0 min-w-[50px] sm:min-w-[55px] md:min-w-[60px] lg:min-w-[65px] xl:min-w-[70px] 2xl:min-w-[74px]"
                >
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-12 font-semibold text-gray-900 text-center leading-tight">
                    {rankItem.label}
                  </p>

                  <div className="mt-0.5 sm:mt-1 md:mt-1.5 lg:mt-2">
                    <Icon className="h-5 w-5  md:h-6 md:w-6 lg:h-9 lg:w-9 xl:h-10 xl:w-10" />
                  </div>

                  <p className="mt-0.5 sm:mt-1 md:mt-1.5 lg:mt-2 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-11 font-semibold text-gray-400 text-center leading-tight">
                    {rankItem.points} Points
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-1.5 sm:mt-2 md:mt-2.5 lg:mt-3">
          <RankProgressBar
            totalSteps={rankingIcons.length}
            currentStep={safeStep}
            progressMeta={meta}
          />
        </div>
      </div>
    </section>
  )
}
