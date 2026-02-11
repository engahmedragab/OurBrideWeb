'use client'

import Image from 'next/image'
import { RankBadge } from '@/components/ranking'
import {
  BronzeIcon,
  SilverIcon,
  GoldIcon,
  BlueRankIcon,
  PinkRankIcon,
  RedRankIcon,
} from '@/assets/rank/rankingIcons'
import verificationBadge from '@/assets/svg/verification-badge.svg'
import type { RankKey } from './RankingSystemSection'
import { useIsRTL } from '@/i18n'
import { cn } from '@/lib/utils'

export interface CurrentUserCardProps {
  name: string
  avatar: string
  rankKey: RankKey
  rankingValue: number
  rankText?: string
  className?: string
}

const rankIconMap: Record<RankKey, React.ComponentType<{ className?: string }>> = {
  bronze: BronzeIcon,
  silver: SilverIcon,
  gold: GoldIcon,
  platinum: BlueRankIcon,
  diamond: PinkRankIcon,
  topMember: RedRankIcon,
}

export function CurrentUserCard({
  name,
  avatar,
  rankKey,
  rankingValue,
  rankText = 'New Member',
  className,
}: CurrentUserCardProps) {
  const RankIcon = rankIconMap[rankKey]
  const isRTL = useIsRTL()

  return (
    <div
      className={`relative bg-white rounded-lg sm:rounded-xl border border-gray-300 p-3 sm:p-4 shadow-sm ${className || ''}`}
    >
      {/* Left section: avatar + name + icons */}
      <div
        className={cn(
          'flex items-center gap-2.5 sm:gap-3 md:gap-2',
          isRTL ? 'pl-[110px] sm:pl-[100px]' : 'pr-[110px] sm:pr-[100px]'
        )}
      >
        {/* Avatar */}
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="(max-width: 640px) 40px, 48px"
            className="object-cover"
          />
        </div>

        {/* Name and Badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-1.5">
            <h4 className="text-12 lg:text-14 font-bold text-gray-900 truncate">{name}</h4>

            {/* Rank Icon */}
            <RankIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />

            {/* Verification Badge */}
            <Image
              src={
                typeof verificationBadge === 'string' ? verificationBadge : verificationBadge.src
              }
              alt="Verified"
              width={20}
              height={20}
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
            />
          </div>

          <p className="text-10 md:text-12 text-gray-500 mt-0.5">{rankText}</p>
        </div>
      </div>

      {/* Right floating Rank Badge */}
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2',
          isRTL ? 'left-0' : 'right-0'
        )}
      >
        <RankBadge
          rankKey={rankKey}
          rankingValue={rankingValue}
          className="w-[110px] md:w-[100px] lg:w-[130px]"
        />
      </div>
    </div>
  )
}
