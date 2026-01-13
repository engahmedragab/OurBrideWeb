'use client'

import {
  BronzeIcon,
  SilverIcon,
  GoldIcon,
  BlueRankIcon,
  PinkRankIcon,
  RedRankIcon,
} from '@/assets/rank/rankingIcons'
import {
  RankingSystemSection,
  DailyTasksSection,
  CurrentUserCard,
  TopMembersSection,
  type RankingIcon,
  type DailyTask,
  type TopMember,
} from '@/components/gift-center/ranking'
import { useRouter } from '@/i18n/navigation'

/**
 * Ranking Page Component
 * Displays ranking information in the Gift Center matching Figma design
 */
export default function RankingPage() {
  // Mock data
  const currentStep = 0// Current active step (0-indexed)
  const totalPoints = 200
  const router = useRouter()
  const rankingIcons: RankingIcon[] = [
    { icon: BronzeIcon, label: 'Bronze', points: 200, rankKey: 'bronze' },
    { icon: SilverIcon, label: 'Silver', points: 200, rankKey: 'silver' },
    { icon: GoldIcon, label: 'Gold', points: 200, rankKey: 'gold' },
    { icon: BlueRankIcon, label: 'Platinum', points: 200, rankKey: 'platinum' },
    { icon: PinkRankIcon, label: 'Diamond', points: 200, rankKey: 'diamond' },
    { icon: RedRankIcon, label: 'Top ', points: 200, rankKey: 'topMember' },
  ]

  const currentRank = rankingIcons[currentStep]

  const dailyTasks: DailyTask[] = [
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

  const topMembers: TopMember[] = [
    {
      rank: 1,
      name: 'Sara Ahmed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      crown: 'gold',
    },
    {
      rank: 2,
      name: 'Sara Ahmed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      crown: 'silver',
    },
    {
      rank: 3,
      name: 'Sara Ahmed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      crown: 'bronze',
    },
    {
      rank: 4,
      name: 'Aya Mohamed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'bronze',
      points: 3150,
    },
    {
      rank: 5,
      name: 'Mohamed Ali',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'silver',
      points: 3150,
    },
    {
      rank: 6,
      name: 'Fatima Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'gold',
      points: 3150,
    },
    {
      rank: 7,
      name: 'Omar Ibrahim',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'platinum',
      points: 3150,
    },
    {
      rank: 8,
      name: 'Layla Ahmed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'diamond',
      points: 3150,
    },
    {
      rank: 9,
      name: 'Youssef Mostafa',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rankText: 'New Member',
      rankKey: 'topMember',
      points: 3150,
    },
  ]

  const currentUser = {
    name: 'Aya Mohamed',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rankKey: rankingIcons[currentStep].rankKey,
    rankingValue: 22568,
    rankText: 'New Member',
  }
  const handleRewardsClick = () => {
    
    router.push('/dashboard/gift-center/rewards')
  }

  return (

<div>


<div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5">
        <h2 className="text-[14px] sm:text-16 font-medium text-gray-900">
          Ranking System
        </h2>

        <button
          type="button"
          onClick={handleRewardsClick}
          className="text-[12px] sm:text-13 font-semibold text-red-500 hover:text-red-600 transition-colors"
        >
          Rewards
        </button>
      </div>
   <div className="grid grid-cols-1 md:grid-cols-[55%_45%] lg:grid-cols-[60%_40%] gap-4 sm:gap-2 mt-2 sm:mt-2">


      {/* Main Content */}
      <div className="space-y-4 sm:space-y-3">
        {/* Ranking System Section */}
        <RankingSystemSection
          currentStep={currentStep}
          rankingIcons={rankingIcons}
          currentRank={currentRank}
          totalPoints={totalPoints}
        />

        {/* Daily Tasks Section */}
        <DailyTasksSection tasks={dailyTasks} restoreTime="23 H 59 M" />
      </div>

      {/* Right Sidebar */}
      <aside className="space-y-2 sm:space-y-3">
       
        {/* Top 10 Members */}
        <TopMembersSection members={topMembers} />
         {/* Current User Card */}
         <CurrentUserCard
          name={currentUser.name}
          avatar={currentUser.avatar}
          rankKey={currentUser.rankKey}
          rankingValue={currentUser.rankingValue}
          rankText={currentUser.rankText}
        />

      </aside>
    </div>
</div>
    
   
  )
}
