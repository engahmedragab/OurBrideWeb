'use client'

import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ChevronRight, Copy, ExternalLink } from 'lucide-react'
import diamondSvg from '@/assets/svg/Diamond.svg'

/**
 * How Points Work Modal Component Props
 */
export interface HowPointsWorkModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Weekly Mission Item Interface
 */
interface WeeklyMissionItem {
  title: string
  points: number
  progress: string
  actionType?: 'link' | 'pill' | 'button'
  actionLabel?: string
  actionUrl?: string
  onAction?: () => void
}

/**
 * Daily Task Item Interface
 */
interface DailyTaskItem {
  title: string
  points: number
}

/**
 * How Points Work Modal Component
 * Displays information about how points work
 */
export const HowPointsWorkModal = ({
  isOpen,
  onClose,
}: HowPointsWorkModalProps) => {
  const weeklyMissions: WeeklyMissionItem[] = [
    {
      title: 'Invite 5 Friends',
      points: 500,
      progress: '0/5 Invited',
      actionType: 'pill',
      actionLabel: 'invitation.ourbride.eg.com',
      onAction: () => {
        // TODO: Copy link to clipboard
      },
    },
    {
      title: 'Make Order Over 500 EGP',
      points: 500,
      progress: '0/500 EGP',
      actionType: 'link',
      actionLabel: 'View Products',
      onAction: () => {
        // TODO: Navigate to products
      },
    },
    {
      title: 'Share OUR BRIDE on social Media',
      points: 500,
      progress: '0/1 Done',
      actionType: 'link',
      actionLabel: 'Share Now',
      onAction: () => {
        // TODO: Share on social media
      },
    },
  ]

  const dailyTasks: DailyTaskItem[] = [
    {
      title: 'Book A Service',
      points: 20,
    },
    {
      title: 'Checkout A Service',
      points: 30,
    },
    {
      title: 'Buy A Product',
      points: 30,
    },
    {
      title: 'Share A Community Post',
      points: 25,
    },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      showCloseButton={false}
      closeOnOverlayClick={true}
      containerClassName="bg-white rounded-2xl shadow-2xl"
      contentClassName="p-4 sm:p-5 flex flex-col h-[calc(100vh-8rem)] max-h-[765px]"
    >
      <div className="flex flex-col gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Header with Title and Close Button */}
        <div className="flex gap-2.5 items-start justify-between w-full shrink-0">
          <h2 className="flex-1 text-16 sm:text-18 font-medium text-gray-900 text-start">
            How Points Work
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Section 1: Complete Weekly tasks */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="text-16 sm:text-18 font-medium text-gray-900 leading-6">
                Complete Weekly tasks on Gifts Center
              </p>
            </div>

            {/* Section 2: Weekly Missions */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center justify-between">
                <p className="text-16 sm:text-18 font-medium text-gray-900 leading-6">
                  Weekly Missions
                </p>
                <p className="text-14 sm:text-16 font-normal text-gray-500">
                  Restore in: 6 D 23 H 59 M
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {weeklyMissions.map((mission, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-xl p-4 sm:p-5 bg-white flex flex-col gap-2"
                  >
                    {/* Mission Title and Reward */}
                    <div className="flex items-center justify-between">
                      <p className="flex-1 text-14 sm:text-16 font-normal text-gray-900">
                        {mission.title}
                      </p>
                      <div className="flex gap-1.5 sm:gap-2 items-center shrink-0">
                        <p className="text-18 sm:text-20 font-medium text-gray-900">
                          {mission.points}
                        </p>
                        <Image
                          src={
                            typeof diamondSvg === 'string'
                              ? diamondSvg
                              : diamondSvg.src
                          }
                          alt="Diamond"
                          width={24}
                          height={24}
                          className="h-5 w-5 sm:h-6 sm:w-6"
                        />
                      </div>
                    </div>

                    {/* Progress and Action */}
                    <div className="flex items-center justify-between">
                      <p className="text-14 sm:text-16 font-normal text-gray-500">
                        {mission.progress}
                      </p>
                      {mission.actionType === 'pill' && mission.actionLabel && (
                        <button
                          onClick={mission.onAction}
                          className="flex gap-1.5 sm:gap-2 items-center bg-green-100 border border-green-500 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:opacity-80 transition-opacity"
                        >
                          <p className="text-12 sm:text-14 font-medium text-green-500">
                            {mission.actionLabel}
                          </p>
                          <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                        </button>
                      )}
                      {mission.actionType === 'link' && mission.actionLabel && (
                        <button
                          onClick={mission.onAction}
                          className="flex gap-1.5 sm:gap-2 items-center hover:opacity-80 transition-opacity"
                        >
                          <p className="text-14 sm:text-16 font-medium text-brand-500">
                            {mission.actionLabel}
                          </p>
                          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-500" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Level Up Your Rank */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="text-16 sm:text-18 font-medium text-gray-900 leading-6">
                Level Up Your Rank By Daily Tasks
              </p>
            </div>

            {/* Section 4: Make bookings, orders and share posts */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="text-16 sm:text-18 font-medium text-gray-900 leading-6">
                Make bookings, orders and share posts in the community
              </p>
              <div className="flex flex-col gap-4">
                {dailyTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <p className="text-14 sm:text-16 font-normal text-gray-900">
                      {task.title}
                    </p>
                    <div className="flex gap-2 items-center shrink-0">
                      <p className="text-14 sm:text-16 font-normal text-gray-900">
                        {task.points}
                      </p>
                      <Image
                        src={
                          typeof diamondSvg === 'string'
                            ? diamondSvg
                            : diamondSvg.src
                        }
                        alt="Diamond"
                        width={24}
                        height={24}
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: How To Redeem Points */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex flex-col gap-2">
                <p className="text-16 sm:text-18 font-medium text-gray-900 leading-6">
                  How To Redeem Points
                </p>
                <p className="text-14 sm:text-16 font-normal text-gray-500 leading-6">
                  Use your points for discounts on services, special offers,
                  Redeem Your Points By Clicking On Redeem In the Offers Section
                </p>
              </div>
            </div>

            {/* Section 6: Points to Discount Conversion */}
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="flex gap-3 sm:gap-4 items-center justify-center">
                <p className="text-20 sm:text-24 font-medium text-gray-900">
                  750
                </p>
                <Image
                  src={
                    typeof diamondSvg === 'string' ? diamondSvg : diamondSvg.src
                  }
                  alt="Diamond"
                  width={32}
                  height={32}
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
                <p className="text-20 sm:text-24 font-medium text-gray-900">
                  = 1% Discount
                </p>
              </div>
              <p className="text-14 sm:text-16 font-normal text-gray-500 text-center">
                Discount Limit : 10%
              </p>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="shrink-0 pt-2 sm:pt-3">
          <Button
            variant="brand"
            size="lg"
            className="w-full !text-white text-14 sm:text-16"
            onClick={onClose}
          >
            Got It
          </Button>
        </div>
      </div>
    </Modal>
  )
}
