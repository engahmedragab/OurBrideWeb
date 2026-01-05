'use client'

import Image from 'next/image'
import Link from 'next/link'
import { RankBadge } from '@/components/ranking'
import {
  BronzeIcon,
  SilverIcon,
  GoldIcon,
  BlueRankIcon,
  PinkRankIcon,
  RedRankIcon,
} from '@/assets/rank/rankingIcons'
import { RankingProgressBar } from '@/components/ui'
import { ChevronRight } from 'lucide-react'
import verificationBadge from '@/assets/svg/verification-badge.svg'
import bronzeCrown from '@/assets/svg/bronze-crown.svg'
import goldCrown from '@/assets/svg/gold-crown.svg'
import blueCrown from '@/assets/svg/blue-crown.svg'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib'

/**
 * Ranking Page Component
 * Displays ranking information in the Gift Center matching Figma design
 */
export default function RankingPage() {
  const router = useRouter()

  // Mock data
  const currentStep = 0 // Current active step (0-indexed)

  const rankingIcons = [
    {
      icon: BronzeIcon,
      label: 'Bronze',
      points: 200,
      rankKey: 'bronze' as const,
    },
    {
      icon: SilverIcon,
      label: 'Silver',
      points: 200,
      rankKey: 'silver' as const,
    },
    { icon: GoldIcon, label: 'Gold', points: 200, rankKey: 'gold' as const },
    {
      icon: BlueRankIcon,
      label: 'Platinum',
      points: 200,
      rankKey: 'platinum' as const,
    },
    {
      icon: PinkRankIcon,
      label: 'Diamond',
      points: 200,
      rankKey: 'diamond' as const,
    },
    {
      icon: RedRankIcon,
      label: 'Top Member',
      points: 200,
      rankKey: 'topMember' as const,
    },
  ]

  // Get current rank based on currentStep
  const currentRank = rankingIcons[currentStep]
  const CurrentRankIcon = currentRank.icon

  // Helper function to get rank icon component
  const getRankIcon = (
    rankKey?:
      | 'bronze'
      | 'silver'
      | 'gold'
      | 'platinum'
      | 'diamond'
      | 'topMember'
  ) => {
    if (!rankKey) return BronzeIcon
    const rankMap = {
      bronze: BronzeIcon,
      silver: SilverIcon,
      gold: GoldIcon,
      platinum: BlueRankIcon,
      diamond: PinkRankIcon,
      topMember: RedRankIcon,
    }
    return rankMap[rankKey]
  }

  const dailyTasks = [
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

  const topMembers = [
    {
      rank: 1,
      name: 'Sara Ahmed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      crown: 'gold',
    },
    {
      rank: 2,
      name: 'Sara Ahmed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      crown: 'silver',
    },
    {
      rank: 3,
      name: 'Sara Ahmed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      crown: 'bronze',
    },
    {
      rank: 4,
      name: 'Aya Mohamed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'bronze' as const,
    },
    {
      rank: 5,
      name: 'Mohamed Ali',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'silver' as const,
    },
    {
      rank: 6,
      name: 'Fatima Hassan',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'gold' as const,
    },
    {
      rank: 7,
      name: 'Omar Ibrahim',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'platinum' as const,
    },
    {
      rank: 8,
      name: 'Layla Ahmed',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'diamond' as const,
    },
    {
      rank: 9,
      name: 'Youssef Mostafa',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'topMember' as const,
    },
  ]

  const currentUser = {
    name: 'Aya Mohamed',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rank: 'bronze' as const,
    rankingValue: 22568,
    rankText: 'New Member',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[55%_45%] lg:grid-cols-[60%_40%] gap-4 sm:gap-2 mt-2 sm:mt-2">
      {/* Main Content */}
      <div className="space-y-4 sm:space-y-3">
        {/* Ranking System Section */}
        <div className="   p-4 sm:p-5 ">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-16 sm:text-18 font-normal text-gray-900">
              Ranking System
            </h2>
            <button
              onClick={() => router.push('/dashboard/gift-center/rewards')}
              className="text-12 sm:text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              Rewards
            </button>
          </div>

          {/* Ranking Icons Row */}
          <div className="flex items-start justify-between mb-4 sm:mb-5 overflow-x-auto pb-2 -mx-2 px-2">
            {rankingIcons.map((rank, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0"
              >
                <p className="text-10 sm:text-12 font-semibold text-gray-900">
                  {rank.label}
                </p>
                <rank.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                <div className="text-center">
                  <p className="text-8 sm:text-10 font-semibold text-gray-400">
                    {rank.points} Points
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-5 sm:mb-4">
            <RankingProgressBar
              totalSteps={rankingIcons.length}
              currentStep={currentStep}
            />
          </div>

          {/* Current Rank Card */}
          <div className=" rounded-lg sm:rounded-xl border-2 border-gray-200 p-4 sm:p-5  flex flex-col items-center gap-3 sm:gap-4">
            <CurrentRankIcon className="w-16 h-16 sm:w-20 sm:h-20" />
            <div className="text-center">
              <h3 className="text-12 sm:text-14 font-normal text-gray-400 mb-1">
                Current Rank{' '}
                <span className="text-gray-900 font-semibold">
                  {currentRank.label}
                </span>
              </h3>
              <p className="text-12 sm:text-14 text-gray-400">
                Total Points : {currentRank.points} Points
              </p>
            </div>
          </div>
        </div>

        {/* Daily Tasks Section */}
        <div className="  p-4 sm:p-5 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 text-14 sm:text-16 sm:mb-4 flex-wrap gap-2">
            <h2 className=" font-normal text-gray-900">Daily Tasks</h2>
            <p className="text-gray-400">Restore in : 23 H 59 M</p>
          </div>

          {/* Tasks List */}
          <div className="space-y-3 lg:space-y-2">
            {dailyTasks.map(task => (
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
                  <p className="text-12 sm:text-14 font-normal text-gray-900">
                    {task.title}
                  </p>

                  <p className="text-10 sm:text-12 font-normal text-gray-500 mt-0.5">
                    {task.subtitle}
                  </p>
                </div>

                {/* Right side */}
                <div className="flex items-center text-10 sm:text-12 lg:text-14 ">
                  <span
                    className={cn(
                      ' font-semibold whitespace-nowrap',
                      task.completed ? 'text-green-500 ' : 'text-gray-400'
                    )}
                  >
                    {task.completed
                      ? `Done +${task.points} Points`
                      : `${task.points} Points`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="space-y-4 sm:space-y-6">
        {/* Current User Card */}
        <div className="relative bg-white  rounded-lg sm:rounded-xl border border-gray-300 p-3 sm:p-4 shadow-sm">
          {/* Left section: avatar + name + icons */}
          <div className="flex items-center gap-2.5  sm:gap-3  md:gap-2 pr-[110px] sm:pr-[100px]">
            {/* Avatar */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={currentUser.avatar}
                alt={currentUser.name}
                fill
                sizes="(max-width: 640px) 40px, 48px"
                className="object-cover"
              />
            </div>

            {/* Name and Badges */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-1.5">
                <h4 className="text-12  lg:text-14 font-bold text-gray-900 truncate">
                  {currentUser.name}
                </h4>

                {/* Bronze Rank Icon */}
                <CurrentRankIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />

                {/* Verification Badge */}
                <Image
                  src={
                    typeof verificationBadge === 'string'
                      ? verificationBadge
                      : verificationBadge.src
                  }
                  alt="Verified"
                  width={20}
                  height={20}
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                />
              </div>

              <p className="text-10  md:text-12 text-gray-500 mt-0.5">
                {currentUser.rankText}
              </p>
            </div>
          </div>

          {/* Right floating Rank Badge */}
          <div className="absolute right-0 sm:right-0 top-1/2 -translate-y-1/2 ">
            <RankBadge
              rankKey={currentRank.rankKey}
              rankingValue={currentUser.rankingValue}
              className="w-[110px] md:w-[100px] lg:w-[130px] "
            />
          </div>
        </div>

        {/* Top 10 Members */}
        <div className="  p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className="text-14 sm:text-16 font-normal text-gray-900">
              Top 10 Members
            </h3>
          </div>

          {/* Top 3 Members - Podium Style: #3, #1, #2 */}
          <div className="flex items-end justify-between mb-3 sm:mb-4 pb-3 sm:pb-4  gap-2">
            {/* Rank #3 - Left */}
            {(() => {
              const member = topMembers.find(m => m.rank === 3)!
              return (
                <div
                  key={member.rank}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1"
                >
                  <div className="relative">
                    {/* Crown above avatar */}
                    {member.crown && (
                      <Image
                        src={
                          member.crown === 'gold'
                            ? typeof goldCrown === 'string'
                              ? goldCrown
                              : goldCrown.src
                            : member.crown === 'silver'
                              ? typeof blueCrown === 'string'
                                ? blueCrown
                                : blueCrown.src
                              : typeof bronzeCrown === 'string'
                                ? bronzeCrown
                                : bronzeCrown.src
                        }
                        alt={`${member.crown} crown`}
                        width={32}
                        height={32}
                        className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 z-10"
                      />
                    )}
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                      <Image
                        src={member.avatar}
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
                  <p className="text-8 sm:text-10 text-gray-500 text-center">
                    Top Member
                  </p>
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
              const member = topMembers.find(m => m.rank === 1)!
              return (
                <div
                  key={member.rank}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1"
                >
                  <div className="relative">
                    {/* Crown above avatar */}
                    {member.crown && (
                      <Image
                        src={
                          member.crown === 'gold'
                            ? typeof goldCrown === 'string'
                              ? goldCrown
                              : goldCrown.src
                            : member.crown === 'silver'
                              ? typeof blueCrown === 'string'
                                ? blueCrown
                                : blueCrown.src
                              : typeof bronzeCrown === 'string'
                                ? bronzeCrown
                                : bronzeCrown.src
                        }
                        alt={`${member.crown} crown`}
                        width={32}
                        height={32}
                        className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 z-10"
                      />
                    )}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden">
                      <Image
                        src={member.avatar}
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
                  <p className="text-8 sm:text-10 text-gray-500 text-center">
                    Top Member
                  </p>
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
              const member = topMembers.find(m => m.rank === 2)!
              return (
                <div
                  key={member.rank}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1"
                >
                  <div className="relative">
                    {/* Crown above avatar */}
                    {member.crown && (
                      <Image
                        src={
                          member.crown === 'gold'
                            ? typeof goldCrown === 'string'
                              ? goldCrown
                              : goldCrown.src
                            : member.crown === 'silver'
                              ? typeof blueCrown === 'string'
                                ? blueCrown
                                : blueCrown.src
                              : typeof bronzeCrown === 'string'
                                ? bronzeCrown
                                : bronzeCrown.src
                        }
                        alt={`${member.crown} crown`}
                        width={32}
                        height={32}
                        className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 z-10"
                      />
                    )}
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                      <Image
                        src={member.avatar}
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
                  <p className="text-8 sm:text-10 text-gray-500 text-center">
                    Top Member
                  </p>
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

          {/* Rest of Members (#4-#9) */}
          <div className="space-y-2 sm:space-y-2.5">
            {topMembers.slice(3).map(member => (
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
                        src={member.avatar}
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
                      <p className="text-12  lg:text-14 font-semibold   text-gray-900 truncate">
                        {member.name}
                      </p>
                      {/* Rank icon next to name */}
                      {(() => {
                        const RankIcon = getRankIcon(member.rankKey)
                        return (
                          <RankIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        )
                      })()}
                    </div>
                    <p className="text-10 sm:text-12 text-gray-500">
                      {member.rankText}
                    </p>
                  </div>
                </div>

                {/* View Profile button */}
                <Link
                  href="/profile"
                  className="text-10 lg:text-12 font-medium text-brand-500 hover:text-brand-600 flex items-center gap-0.5 sm:gap-1 flex-shrink-0"
                >
                  <span className="">View Profile</span>

                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
