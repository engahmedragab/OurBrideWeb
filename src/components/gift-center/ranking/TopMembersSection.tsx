'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import {
  BronzeIcon,
  SilverIcon,
  GoldIcon,
  BlueRankIcon,
  PinkRankIcon,
  RedRankIcon,
} from '@/assets/rank/rankingIcons'
import bronzeCrown from '@/assets/svg/bronze-crown.svg'
import goldCrown from '@/assets/svg/gold-crown.svg'
import blueCrown from '@/assets/svg/blue-crown.svg'
import type { RankKey } from './RankingSystemSection'

export interface TopMember {
  rank: number
  name: string
  avatar: string
  crown?: 'gold' | 'silver' | 'bronze'
  rankText?: string
  rankKey?: RankKey
  points?: number
}

export interface TopMembersSectionProps {
  members?: TopMember[]
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

const defaultMembers: TopMember[] = [
  { rank: 1, name: 'Sara Ahmed', avatar: '', crown: 'gold' },
  { rank: 2, name: 'Sara Ahmed', avatar: '', crown: 'silver' },
  { rank: 3, name: 'Sara Ahmed', avatar: '', crown: 'bronze' },
  { rank: 4, name: 'Aya Mohamed', avatar: '', rankText: 'New Member', rankKey: 'bronze' },
  { rank: 5, name: 'Mohamed Ali', avatar: '', rankText: 'New Member', rankKey: 'silver' },
  { rank: 6, name: 'Fatima Hassan', avatar: '', rankText: 'New Member', rankKey: 'gold' },
  { rank: 7, name: 'Omar Ibrahim', avatar: '', rankText: 'New Member', rankKey: 'platinum' },
  { rank: 8, name: 'Layla Ahmed', avatar: '', rankText: 'New Member', rankKey: 'diamond' },
  { rank: 9, name: 'Youssef Mostafa', avatar: '', rankText: 'New Member', rankKey: 'topMember' },
]

export function TopMembersSection({
  members = defaultMembers,
  className,
}: TopMembersSectionProps) {
  const top3 = members.filter(m => m.rank <= 3).sort((a, b) => a.rank - b.rank)
  const rest = members.filter(m => m.rank > 3).sort((a, b) => a.rank - b.rank)

  const getCrownSrc = (crown?: 'gold' | 'silver' | 'bronze') => {
    if (!crown) return null
    if (crown === 'gold') return typeof goldCrown === 'string' ? goldCrown : goldCrown.src
    if (crown === 'silver') return typeof blueCrown === 'string' ? blueCrown : blueCrown.src
    return typeof bronzeCrown === 'string' ? bronzeCrown : bronzeCrown.src
  }

  const getRankIcon = (rankKey?: RankKey) => {
    if (!rankKey) return BronzeIcon
    return rankIconMap[rankKey]
  }

  return (
    <div className={`p-3 sm:p-4 shadow-sm ${className || ''}`}>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h3 className="text-14 sm:text-16 font-normal text-gray-900">Top 10 Members</h3>
      </div>

      {/* Top 3 Members - Podium Style: #3, #1, #2 */}
      <div className="flex items-end justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 gap-2">
        {/* Rank #3 - Left */}
        {(() => {
          const member = top3.find(m => m.rank === 3)
          if (!member) return null
          return (
            <div key={member.rank} className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1">
              <div className="relative">
                {/* Crown above avatar */}
                {member.crown && (
                  <Image
                    src={getCrownSrc(member.crown)!}
                    alt={`${member.crown} crown`}
                    width={32}
                    height={32}
                    className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 z-10"
                  />
                )}
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                  <Image
                    src={member.avatar || '/placeholder-avatar.png'}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 40px, 48px"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="text-10 sm:text-12 font-semibold text-gray-900 text-center">
                {member.name}
              </p>
              <p className="text-8 sm:text-10 text-gray-500 text-center">Top Member</p>
              {/* Ranking badge row */}
              <div className="flex items-center gap-1">
                <span className="text-10 sm:text-12 font-semibold text-gray-500">
                  #{member.rank}
                </span>
                <RedRankIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          )
        })()}

        {/* Rank #1 - Center (tallest) */}
        {(() => {
          const member = top3.find(m => m.rank === 1)
          if (!member) return null
          return (
            <div key={member.rank} className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1">
              <div className="relative">
                {/* Crown above avatar */}
                {member.crown && (
                  <Image
                    src={getCrownSrc(member.crown)!}
                    alt={`${member.crown} crown`}
                    width={32}
                    height={32}
                    className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 z-10"
                  />
                )}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden">
                  <Image
                    src={member.avatar || '/placeholder-avatar.png'}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 56px, 64px"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="text-10 sm:text-12 font-semibold text-gray-900 text-center">
                {member.name}
              </p>
              <p className="text-8 sm:text-10 text-gray-500 text-center">Top Member</p>
              {/* Ranking badge row */}
              <div className="flex items-center gap-1">
                <span className="text-10 sm:text-12 font-semibold text-gray-500">
                  #{member.rank}
                </span>
                <RedRankIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          )
        })()}

        {/* Rank #2 - Right */}
        {(() => {
          const member = top3.find(m => m.rank === 2)
          if (!member) return null
          return (
            <div key={member.rank} className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1">
              <div className="relative">
                {/* Crown above avatar */}
                {member.crown && (
                  <Image
                    src={getCrownSrc(member.crown)!}
                    alt={`${member.crown} crown`}
                    width={32}
                    height={32}
                    className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 z-10"
                  />
                )}
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                  <Image
                    src={member.avatar || '/placeholder-avatar.png'}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 40px, 48px"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="text-10 sm:text-12 font-semibold text-gray-900 text-center">
                {member.name}
              </p>
              <p className="text-8 sm:text-10 text-gray-500 text-center">Top Member</p>
              {/* Ranking badge row */}
              <div className="flex items-center gap-1">
                <span className="text-10 sm:text-12 font-semibold text-gray-500">
                  #{member.rank}
                </span>
                <RedRankIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          )
        })()}
      </div>

      {/* Rest of Members (#4-#10) */}
      <div className="space-y-2 sm:space-y-2.5">
        {rest.map(member => {
          const RankIcon = getRankIcon(member.rankKey)
          return (
            <div
              key={member.rank}
              className="flex items-center justify-between p-2 sm:p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                {/* Rank number */}
                <span className="text-12 sm:text-14 font-semibold text-gray-900 flex-shrink-0">
                  #{member.rank}
                </span>

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden">
                    <Image
                      src={member.avatar || '/placeholder-avatar.png'}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 32px, 36px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Name and rank text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <p className="text-12 lg:text-14 font-semibold text-gray-900 truncate">
                      {member.name}
                    </p>
                    {/* Rank icon next to name */}
                    {member.rankKey && (
                      <RankIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    )}
                  </div>
                  {member.rankText && (
                    <p className="text-10 sm:text-12 text-gray-500">{member.rankText}</p>
                  )}
                  {member.points && (
                    <p className="text-10 sm:text-12 text-gray-500">{member.points} Points</p>
                  )}
                </div>
              </div>

              {/* View Profile button */}
              <Link
                href="/profile"
                className="text-10 lg:text-12 font-medium text-brand-500 hover:text-brand-600 flex items-center gap-0.5 sm:gap-1 flex-shrink-0"
              >
                <span>View Profile</span>
                <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 rtl:rotate-180" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
