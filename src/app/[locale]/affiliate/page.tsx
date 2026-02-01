'use client'

import React, { useState, useEffect, Suspense, lazy } from 'react'
import Image from 'next/image'
import { UserPageLayout } from '@/components/layout'
import {
  Button,
  Badge,
  InsightCard,
  PromotedCampaignCard,
  Input,
  AddPaymentCardModal,
  WithdrawFundsModal,
  LoadingOverlay,
} from '@/components/ui'
import { useI18nTranslations } from '@/i18n/hooks'

const AffiliateOnboardingModals = lazy(
  () => import('@/components/ui/AffiliateOnboardingModals').then(module => ({ default: module.AffiliateOnboardingModals }))
)
import {
  DollarSign,
  CheckCircle,
  Clock,
  X,
  CreditCard,
  TrendingUp,
  User,
} from 'lucide-react'
import affiliateStartingSvg from '@/assets/svg/Affiliate-starting.svg'

type TabType = 'overview' | 'campaigns' | 'tools' | 'wallet'

interface ActivityItem {
  id: string
  userName: string
  userAvatar: string
  date: string
  sales: number
  commission: string
  status: 'Confirmed' | 'Pending Payout'
}

/**
 * Affiliate Program Page
 * Affiliate program with tabs for Overview, Campaigns, Tools, and Wallet
 */
export default function AffiliatePage() {
  const t = useI18nTranslations('affiliate')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [affiliateLink] = useState('http://www.generatecode.ourbride.com')
  const [hasJoined, setHasJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null)
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  const categories = ['Makeup', 'Fashion', 'Makeup', 'Fashion', 'Fashion', 'Makeup', 'Fashion', 'Fashion']

  {/* Campaign data structure */}
  interface Campaign {
    id: string
    name: string
    badgeText: string
    offerText: string
    description: string
    commission: string
    bannerColor: string
    isActive: boolean
  }

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Bridal Makeup Off',
      badgeText: 'Bridal Makeup',
      offerText: 'Get 15 % OFF',
      description: 'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque',
      commission: '200',
      bannerColor: '#FFB8A8',
      isActive: true,
    },
    {
      id: '2',
      name: 'Campaigns Name',
      badgeText: 'Bridal Makeup',
      offerText: 'Get 15 % OFF',
      description: 'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque',
      commission: '200',
      bannerColor: '#00D9A3',
      isActive: true,
    },
  ])

  {/* Temporary edit state */}
  const [editFormData, setEditFormData] = useState<Campaign | null>(null)

  const bannerColors = [
    { id: 'coral', color: '#FFB8A8', name: 'Coral', className: 'bg-campaign-coral' },
    { id: 'mint', color: '#A8E6CF', name: 'Mint', className: 'bg-campaign-mint' },
    { id: 'pink', color: '#FFD1DC', name: 'Pink', className: 'bg-campaign-pink' },
    { id: 'yellow', color: '#FFF4B8', name: 'Yellow', className: 'bg-campaign-yellow' },
    { id: 'blue', color: '#B8D4FF', name: 'Blue', className: 'bg-campaign-blue' },
    { id: 'gray', color: '#D4D4D4', name: 'Gray', className: 'bg-campaign-gray' },
  ]

  const toggleCategory = (category: string, index: number) => {
    const categoryKey = `${category}-${index}`
    setSelectedCategories(prev =>
      prev.includes(categoryKey)
        ? prev.filter(c => c !== categoryKey)
        : [...prev, categoryKey]
    )
  }

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaignId(campaign.id)
    setEditFormData({ ...campaign })
  }

  const handleSaveCampaign = (campaignId: string) => {
    if (editFormData) {
      setCampaigns(prev =>
        prev.map(campaign =>
          campaign.id === campaignId ? { ...editFormData } : campaign
        )
      )
      setEditingCampaignId(null)
      setEditFormData(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingCampaignId(null)
    setEditFormData(null)
  }

  const updateEditFormData = (field: keyof Campaign, value: string) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value })
    }
  }

  {/* Check if user has already joined on mount */}
  useEffect(() => {
    const affiliateStatus = localStorage.getItem('affiliate_program_joined')
    if (affiliateStatus === 'true') {
      setHasJoined(true)
    }
    setIsLoading(false)
  }, [])

  const handleJoinNow = () => {
    setShowOnboarding(true)
  }

  const handleOnboardingComplete = () => {
    setHasJoined(true)
    localStorage.setItem('affiliate_program_joined', 'true')
  }

  {/* Show loading state while checking localStorage */}
  if (isLoading) {
    return (
      <UserPageLayout>
        <LoadingOverlay open={true} />
      </UserPageLayout>
    )
  }

  {/* Mock data */}
  const earningInsights = {
    totalEarning: 5200,
    pendingPayout: 200,
    approvedPayout: 5000,
  }

  const activityItems: ActivityItem[] = [
    {
      id: '1',
      userName: 'Sarah Ahmed',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      sales: 3,
      commission: '+600 EGP',
      status: 'Confirmed',
    },
    {
      id: '2',
      userName: 'Sarah Ahmed',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      sales: 4,
      commission: '+600 EGP',
      status: 'Confirmed',
    },
    {
      id: '3',
      userName: 'Aya Ahmed',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      sales: 2,
      commission: '+600 EGP',
      status: 'Pending Payout',
    },
    {
      id: '4',
      userName: 'Aya Ahmed',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: 'Joined: Sep 23, 2025',
      sales: 3,
      commission: '+600 EGP',
      status: 'Pending Payout',
    },
  ]

  interface Transaction {
    id: string
    title: string
    transactionId: string
    date: string
    amount: string
  }

  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Luxury Bridal Makeup Set',
      transactionId: '#Ref-23451',
      date: 'Sep 15, 2025 11:30 am',
      amount: '+600 EGP',
    },
    {
      id: '2',
      title: 'Luxury Bridal Makeup Set',
      transactionId: '#Ref-23451',
      date: 'Sep 15, 2025 11:30 am',
      amount: '+600 EGP',
    },
    {
      id: '3',
      title: 'Luxury Bridal Makeup Set',
      transactionId: '#Ref-23451',
      date: 'Sep 15, 2025 11:30 am',
      amount: '+600 EGP',
    },
    {
      id: '4',
      title: 'Luxury Bridal Makeup Set',
      transactionId: '#Ref-23451',
      date: 'Sep 15, 2025 11:30 am',
      amount: '+600 EGP',
    },
    {
      id: '5',
      title: 'Luxury Bridal Makeup Set',
      transactionId: '#Ref-23451',
      date: 'Sep 15, 2025 11:30 am',
      amount: '+600 EGP',
    },
    {
      id: '6',
      title: 'Luxury Bridal Makeup Set',
      transactionId: '#Ref-23451',
      date: 'Sep 15, 2025 11:30 am',
      amount: '+600 EGP',
    },
  ]


  {/* If user hasn't joined, show the starting screen */}
  if (!hasJoined) {
    return (
      <>
        <Suspense fallback={null}>
        <AffiliateOnboardingModals
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />
        </Suspense>

        <UserPageLayout>
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
            <div className="max-w-md w-full text-center">
              {/* SVG Illustration */}
              <div className="mb-6 sm:mb-8 flex justify-center items-center relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
                <Image
                  src={typeof affiliateStartingSvg === 'string' ? affiliateStartingSvg : affiliateStartingSvg.src}
                  alt={t('join.alt')}
                  fill
                  sizes="(max-width: 640px) 192px, 256px"
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h1 className="text-20 sm:text-24 font-normal text-gray-900 mb-3 sm:mb-4">
                {t('join.title')}
              </h1>

              {/* Description */}
              <p className="text-14 sm:text-16 text-gray-500 mb-6 sm:mb-8 leading-relaxed px-4">
                {t('join.description')}
              </p>

              {/* Join Now Button */}
              <Button
                variant="brand"
                size="lg"
                className="text-white px-8 sm:px-12 w-full sm:w-auto"
                onClick={handleJoinNow}
              >
                {t('join.joinNow')}
              </Button>
            </div>
          </div>
        </UserPageLayout>
      </>
    )
  }

  {/* Main Affiliate Dashboard */}
  return (
    <UserPageLayout>
      {/* Tabs */}
      <div className="mb-4 sm:mb-6 -mx-4 sm:mx-0">
        <div className="border-b border-gray-200">
          <nav className="flex w-full">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 pb-3 sm:pb-4 px-1 text-13 sm:text-14 font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              {t('tabs.overview')}
              {activeTab === 'overview' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex-1 pb-3 sm:pb-4 px-1 text-13 sm:text-14 font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'campaigns'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              {t('tabs.campaigns')}
              {activeTab === 'campaigns' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 pb-3 sm:pb-4 px-1 text-13 sm:text-14 font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'tools'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              {t('tabs.tools')}
              {activeTab === 'tools' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 pb-3 sm:pb-4 px-1 text-13 sm:text-14 font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'wallet'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              {t('tabs.wallet')}
              {activeTab === 'wallet' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300" />
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {/* Earning Insights */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h2 className="text-16 sm:text-18 font-normal text-gray-900 mb-3 sm:mb-4">
                {t('overview.earningInsights')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <InsightCard
                  icon={DollarSign}
                  label={t('overview.totalEarning')}
                  value={earningInsights.totalEarning}
                />
                <InsightCard
                  icon={Clock}
                  label={t('overview.pendingPayout')}
                  value={earningInsights.pendingPayout}
                />
                <InsightCard
                  icon={CheckCircle}
                  label={t('overview.approvedPayout')}
                  value={earningInsights.approvedPayout}
                />
              </div>
            </div>

            {/* Promoted Campaigns */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-16 sm:text-18 font-normal text-gray-900">{t('overview.promotedCampaigns')}</h2>
                <button className="text-13 sm:text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors">
                  {t('overview.viewAll')}
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <PromotedCampaignCard
                  badgeText="Limited Offer!"
                  title="Get 15 % OFF"
                  link={affiliateLink}
                  backgroundColor="#FFF4F2"
                />
                <PromotedCampaignCard
                  badgeText="Special Offer!"
                  title="Get 15 % OFF"
                  link={affiliateLink}
                  backgroundColor="#E6F9F4"
                />
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-16 sm:text-18 font-normal text-gray-900">{t('overview.recentActivity')}</h2>
                <button className="text-13 sm:text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors">
                  {t('overview.viewAllActivity')}
                </button>
              </div>
              <div className="space-y-3">
                {activityItems.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden">
                        {item.userAvatar && item.userAvatar.trim() !== '' ? (
                          <Image
                            src={item.userAvatar}
                            alt={item.userName}
                            fill
                            sizes="40px"
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-13 sm:text-14 font-normal text-gray-900">
                            {item.userName}
                          </p>
                          <p className="text-13 sm:text-14 font-normal text-green-600 whitespace-nowrap">
                            {item.commission}
                          </p>
                        </div>
                        <p className="text-11 sm:text-12 text-gray-500 mb-2">{item.date}</p>
                        <p className="text-11 sm:text-12 text-gray-600 mb-2">
                          {item.sales} {item.sales === 1 ? t('overview.booking') : t('overview.bookings')}
                        </p>
                        <Badge
                          variant={item.status === 'Confirmed' ? 'confirmed' : 'pending'}
                          className="gap-1.5 px-2 sm:px-3 py-1 text-11 sm:text-12 font-medium"
                        >
                          {item.status === 'Confirmed' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{item.status === 'Confirmed' ? t('overview.confirmed') : t('overview.pendingPayout')}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Campaigns Tab Content */}
      {activeTab === 'campaigns' && (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
              <input
                type="search"
                placeholder={t('campaigns.searchPlaceholder')}
                className="w-full bg-transparent outline-none text-14 sm:text-16 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Category Filter Badges */}
            <div className="bg-gray-50 rounded-xl p-2">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category, index) => {
                  const categoryKey = `${category}-${index}`
                  const isSelected = selectedCategories.includes(categoryKey)
                  return (
                    <button
                      key={categoryKey}
                      onClick={() => toggleCategory(category, index)}
                      className={`bg-gray-75 px-2.5 sm:px-3 py-1 rounded-full border text-12 sm:text-13 font-normal transition-colors ${
                        isSelected
                          ? 'bg-white border-gray-900 text-gray-900'
                          : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Top Campaigns Section */}
            <div>
              <h2 className="text-16 sm:text-18 font-normal text-gray-900 mb-3 sm:mb-4">{t('campaigns.topCampaigns')}</h2>
              <div className="space-y-3 sm:space-y-4">
                {/* Campaign Card 1 */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-3 sm:p-4">
                    <div className="rounded-xl p-6 sm:p-8 text-center mb-3 sm:mb-4 bg-campaign-coral">
                      <div className="inline-block bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-2 sm:mb-3">
                        <p className="text-11 sm:text-12 font-normal text-gray-900">Bridal Makeup</p>
                      </div>
                      <h3 className="text-20 sm:text-24 font-semibold text-gray-900">Get 15 % OFF</h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="text-14 sm:text-16 font-normal text-gray-900">{t('campaigns.bridalMakeupEssentials')}</h4>
                      <p className="text-13 sm:text-14 text-gray-500">
                        {t('campaigns.promoteDescription')}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-13 sm:text-14 font-normal text-gray-900">200 {t('campaigns.forEachBooking')}</p>
                        <Button variant="outline" size="md" className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-500 w-full sm:w-auto">
                          {t('campaigns.generateLink')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Card 2 */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-3 sm:p-4">
                    <div className="rounded-xl p-6 sm:p-8 text-center mb-3 sm:mb-4 bg-campaign-mint-green">
                      <div className="inline-block bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-2 sm:mb-3">
                        <p className="text-11 sm:text-12 font-normal text-gray-900">Bridal Makeup</p>
                      </div>
                      <h3 className="text-20 sm:text-24 font-semibold text-gray-900">Get 15 % OFF</h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="text-14 sm:text-16 font-normal text-gray-900">{t('campaigns.bridalMakeupEssentials')}</h4>
                      <p className="text-13 sm:text-14 text-gray-500">
                        {t('campaigns.promoteDescription')}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-13 sm:text-14 font-normal text-gray-900">200 {t('campaigns.forEachBooking')}</p>
                        <Button variant="outline" size="md" className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-500 w-full sm:w-auto">
                          {t('campaigns.generateLink')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-16 sm:text-18 font-normal text-gray-900">{t('overview.recentActivity')}</h2>
                <button className="text-13 sm:text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors">
                  {t('overview.viewAllActivity')}
                </button>
              </div>
              <div className="space-y-3">
                {activityItems.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden">
                        {item.userAvatar && item.userAvatar.trim() !== '' ? (
                          <Image
                            src={item.userAvatar}
                            alt={item.userName}
                            fill
                            sizes="40px"
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-13 sm:text-14 font-normal text-gray-900">
                            {item.userName}
                          </p>
                          <p className="text-13 sm:text-14 font-normal text-green-600 whitespace-nowrap">
                            {item.commission}
                          </p>
                        </div>
                        <p className="text-11 sm:text-12 text-gray-500 mb-2">{item.date}</p>
                        <p className="text-11 sm:text-12 text-gray-600 mb-2">
                          {item.sales} {item.sales === 1 ? t('overview.booking') : t('overview.bookings')}
                        </p>
                        <Badge
                          variant={item.status === 'Confirmed' ? 'confirmed' : 'pending'}
                          className="gap-1.5 px-2 sm:px-3 py-1 text-11 sm:text-12 font-medium"
                        >
                          {item.status === 'Confirmed' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{item.status === 'Confirmed' ? t('overview.confirmed') : t('overview.pendingPayout')}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Tools Tab Content */}
      {activeTab === 'tools' && (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-18 sm:text-20 font-normal text-gray-900">{t('tools.yourCampaigns')}</h2>
            </div>

            {/* Campaign Cards */}
            {campaigns.map((campaign) => {
              const isEditing = editingCampaignId === campaign.id
              const displayData = isEditing && editFormData ? editFormData : campaign

              return (
                <div key={campaign.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData.name}
                          onChange={(e) => updateEditFormData('name', e.target.value)}
                          className="text-14 sm:text-16 font-normal text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-brand-500 focus:outline-none transition-colors bg-transparent px-1"
                          placeholder={t('tools.campaignName')}
                        />
                      ) : (
                        <h3 className="text-14 sm:text-16 font-normal text-gray-900">{displayData.name}</h3>
                      )}
                      <Badge variant="success" className="bg-green-50 text-green-600 border-green-200 text-11 sm:text-12 font-normal px-2 sm:px-3 py-1">
                        {t('tools.active')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveCampaign(campaign.id)}
                            className="text-13 sm:text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
                          >
                            {t('tools.save')}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditCampaign(campaign)}
                          className="text-13 sm:text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
                        >
                          {t('tools.edit')}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Campaign Banner Preview */}
                  <div 
                    className="rounded-xl p-6 sm:p-8 text-center mb-3 sm:mb-4"
                    style={{ backgroundColor: displayData.bannerColor }}
                  >
                    <div className="inline-block bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-2 sm:mb-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData.badgeText}
                          onChange={(e) => updateEditFormData('badgeText', e.target.value)}
                          className="text-11 sm:text-12 font-normal text-gray-900 bg-transparent focus:outline-none text-center min-w-[100px]"
                          placeholder={t('tools.badgeText')}
                        />
                      ) : (
                        <p className="text-11 sm:text-12 font-normal text-gray-900">{displayData.badgeText}</p>
                      )}
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayData.offerText}
                        onChange={(e) => updateEditFormData('offerText', e.target.value)}
                        className="text-20 sm:text-24 font-semibold text-gray-900 bg-transparent focus:outline-none text-center w-full"
                        placeholder={t('tools.offerText')}
                      />
                    ) : (
                      <h3 className="text-20 sm:text-24 font-semibold text-gray-900">{displayData.offerText}</h3>
                    )}
                  </div>

                  {/* Show additional fields only in edit mode */}
                  {isEditing && (
                    <>
                      {/* Description */}
                      <textarea
                        value={displayData.description}
                        onChange={(e) => updateEditFormData('description', e.target.value)}
                        className="w-full text-13 sm:text-14 text-gray-500 mb-3 sm:mb-4 border border-gray-200 rounded-xl p-3 focus:border-brand-500 focus:outline-none resize-none"
                        rows={3}
                        placeholder={t('tools.campaignDescription')}
                      />

                      {/* Commission */}
                      <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                        <span className="text-13 sm:text-14 font-normal text-gray-900">{t('tools.commission')} :</span>
                        <input
                          type="text"
                          value={displayData.commission}
                          onChange={(e) => updateEditFormData('commission', e.target.value)}
                          className="text-13 sm:text-14 font-normal text-gray-900 border-b border-gray-300 hover:border-gray-400 focus:border-brand-500 focus:outline-none transition-colors bg-transparent px-1 w-20"
                          placeholder="200"
                        />
                        <span className="text-13 sm:text-14 font-normal text-gray-900">{t('campaigns.forEachBooking')}</span>
                      </div>

                      {/* Link Input */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 sm:mb-4">
                        <Input
                          value={affiliateLink}
                          readOnly
                          className="flex-1"
                        />
                        <Button  size="md" className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-500 px-4 whitespace-nowrap w-full sm:w-auto">
                          {t('tools.regenerateLink')}
                        </Button>
                      </div>

                      {/* Banner Color Selector */}
                      <div className="mb-3 sm:mb-4">
                        <p className="text-13 sm:text-14 font-normal text-gray-900 mb-3">{t('tools.bannerColor')}</p>
                        <div className="flex gap-2 sm:gap-3 flex-wrap">
                          {bannerColors.map((bannerColor) => (
                            <button
                              key={bannerColor.id}
                              onClick={() => updateEditFormData('bannerColor', bannerColor.color)}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                                displayData.bannerColor === bannerColor.color
                                  ? 'ring-2 ring-offset-2 ring-gray-900'
                                  : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
                              }`}
                              style={{ backgroundColor: bannerColor.color }}
                              aria-label={`Select ${bannerColor.name} color`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Deactivate Button */}
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="md"
                          className="text-brand-500 border-brand-500 hover:bg-brand-50 w-full sm:w-auto"
                        >
                          {t('tools.deactivateCampaign')}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Recent Activity Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-16 sm:text-18 font-normal text-gray-900">Recent Activity</h2>
                <button className="text-13 sm:text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {activityItems.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden">
                        {item.userAvatar && item.userAvatar.trim() !== '' ? (
                          <Image
                            src={item.userAvatar}
                            alt={item.userName}
                            fill
                            sizes="40px"
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-13 sm:text-14 font-normal text-gray-900">
                            {item.userName}
                          </p>
                          <p className="text-13 sm:text-14 font-normal text-green-600 whitespace-nowrap">
                            {item.commission}
                          </p>
                        </div>
                        <p className="text-11 sm:text-12 text-gray-500 mb-2">{item.date}</p>
                        <p className="text-11 sm:text-12 text-gray-600 mb-2">
                          {item.sales} {item.sales === 1 ? t('overview.booking') : t('overview.bookings')}
                        </p>
                        <Badge
                          variant={item.status === 'Confirmed' ? 'confirmed' : 'pending'}
                          className="gap-1.5 px-2 sm:px-3 py-1 text-11 sm:text-12 font-medium"
                        >
                          {item.status === 'Confirmed' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{item.status === 'Confirmed' ? t('overview.confirmed') : t('overview.pendingPayout')}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Wallet Tab Content */}
      {activeTab === 'wallet' && (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Transactions History */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h2 className="text-16 sm:text-18 font-normal text-gray-900 mb-4 sm:mb-6">{t('wallet.transactionsHistory')}</h2>
              <div className="space-y-3 sm:space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0 gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-13 sm:text-14 font-normal text-gray-900 mb-1 truncate">
                        {transaction.title}
                      </h3>
                      <p className="text-11 sm:text-12 text-gray-500 mb-0.5">
                        ID: {transaction.transactionId}
                      </p>
                      <p className="text-11 sm:text-12 text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="text-14 sm:text-16 font-normal text-green-600 whitespace-nowrap">
                      {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wallet Card & Actions */}
          <aside className="w-full lg:w-96 flex-shrink-0 space-y-3 sm:space-y-4">
            {/* Credit Card */}
            <div
              className="rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #8b2635 100%)',
              }}
            >
              {/* Card Icons */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-white/80" />
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/80" />
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-400/80 -ml-4" />
                </div>
              </div>

              {/* Card Number */}
              <div className="mb-5 sm:mb-6">
                <p className="text-14 sm:text-16 font-normal tracking-wider">34** **** **** ***7</p>
              </div>

              {/* Card Holder & Expiry */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-13 sm:text-14 font-normal">Ahmed Ramadan</p>
                </div>
                <div>
                  <p className="text-13 sm:text-14 font-normal">02/30</p>
                </div>
              </div>

              {/* Contactless Icon */}
              <div className="absolute top-5 sm:top-6 right-5 sm:right-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white/60"
                  >
                    <path d="M12 18a6 6 0 0 0 0-12" />
                    <path d="M12 15a3 3 0 0 0 0-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-13 sm:text-14 text-gray-500">{t('wallet.balance')}</p>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-11 sm:text-12 font-medium">25 %</span>
                </div>
              </div>
              <p className="text-24 sm:text-28 font-semibold text-gray-900 mb-3 sm:mb-4">3500.00 EGP</p>
              <div className="flex items-center justify-between text-11 sm:text-12 text-gray-500 mb-4 sm:mb-6">
                <span>{t('wallet.lastUpdate')}</span>
                <span className="text-right">Sep 15, 2025 11:30 am</span>
              </div>
              <div className="flex items-center justify-between text-11 sm:text-12 mb-4 sm:mb-6">
                <span className="text-gray-500">{t('wallet.status')}</span>
                <span className="text-green-600 font-medium">{t('wallet.active')}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <Button
                  variant="brand"
                  size="lg"
                  onClick={() => setShowWithdrawModal(true)}
                  className="w-full text-white"
                >
                  {t('wallet.withdrawFunds')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAddCardModal(true)}
                  className="w-full text-brand-500 border-brand-500 hover:bg-brand-50"
                >
                  {t('wallet.addNewCard')}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Add New Card Modal */}
      <AddPaymentCardModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
      />

      {/* Withdraw Funds Modal */}
      <WithdrawFundsModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        balance={3500.0}
      />
    </UserPageLayout>
  )
}
