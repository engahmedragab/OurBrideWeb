'use client'

import React from 'react'
import Image from 'next/image'
import { X, ChevronRight } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import {
  SilverIcon,
  GoldIcon,
  BlueRankIcon,
  PinkRankIcon,
  RedRankIcon,
  BronzeIcon,
} from '@/assets/rank/rankingIcons'
import diamondSvg from '@/assets/svg/Diamond.svg'

/**
 * Rank type definition
 */
export type RankType = 'bronze' | 'silver' | 'gold' | 'blue' | 'pink' | 'red'

/**
 * Rank badge mapping
 */
const rankBadgeMap: Record<
  RankType,
  React.ComponentType<{ className?: string }>
> = {
  bronze: BronzeIcon,
  silver: SilverIcon,
  gold: GoldIcon,
  blue: BlueRankIcon,
  pink: PinkRankIcon,
  red: RedRankIcon,
}

/**
 * Rank display name mapping
 */
const rankDisplayName: Record<RankType, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  blue: 'Blue',
  pink: 'Pink',
  red: 'Red',
}

/**
 * Rank Up Modal Component Props
 */
export interface RankUpModalProps {
  isOpen: boolean
  onClose: () => void
  previousRank: RankType
  newRank: RankType
  rewardValue: number
  rewardDescription?: string
  couponCode?: string
  title?: string
  message?: string
}

/**
 * Rank Up Modal Component
 * Displays a congratulatory modal when user levels up to a new rank
 */
export const RankUpModal = ({
  isOpen,
  onClose,
  previousRank,
  newRank,
  rewardValue,
  rewardDescription,
  couponCode,
  title = 'Congratulations',
  message,
}: RankUpModalProps) => {
  const NewRankIcon = rankBadgeMap[newRank]

  const defaultMessage = `You've leveled up to ${rankDisplayName[newRank]} Rank! Keep completing tasks and bookings to unlock more rewards and benefits. 🚀`

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      showCloseButton={false}
      closeOnOverlayClick={true}
      containerClassName="bg-white rounded-2xl shadow-2xl"
      contentClassName="p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:gap-4 items-center w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Title and Close Button */}
        <div className="flex gap-2 sm:gap-2.5 items-center justify-between w-full">
          <h2 className="flex-1 text-16 sm:text-18 font-medium text-gray-900 text-start">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Rank Badge */}
        <div className="flex items-center justify-center shrink-0">
          <NewRankIcon className="w-[80px] h-[80px]" />
        </div>

        {/* Message Text */}
        <div className="flex flex-col gap-1 sm:gap-1.5 items-center text-center w-full">
          <p className="text-14 sm:text-16 font-normal text-gray-500 leading-5 sm:leading-6 whitespace-pre-wrap">
            {message || defaultMessage}
          </p>
        </div>

        {/* Rank Progression Row */}
        <div className="flex flex-col gap-1.5 sm:gap-2 items-center w-full">
          <div className="flex gap-3 sm:gap-4 items-center justify-center">
            <p className="text-18 sm:text-20 font-medium text-gray-900">
              {rankDisplayName[previousRank]}
            </p>
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
            <p className="text-18 sm:text-20 font-medium text-gray-900">
              {rankDisplayName[newRank]}
            </p>
          </div>

          {/* Rewards Section */}
          <div className="flex flex-col gap-1.5 sm:gap-2 items-center w-full pt-1 sm:pt-1.5">
            <p className="text-14 sm:text-16 font-normal text-gray-500">
              Rewards
            </p>

            {/* Reward Value with Diamond Icon */}
            <div className="flex gap-1.5 sm:gap-2 items-center justify-center">
              <p className="text-16 sm:text-18 font-normal text-gray-500">
                {rewardValue}
              </p>
              <Image
                src={
                  typeof diamondSvg === 'string' ? diamondSvg : diamondSvg.src
                }
                alt="Diamond"
                width={24}
                height={24}
                className="h-5 w-5 sm:h-6 sm:w-6"
              />
            </div>

            {/* Reward Description or Coupon Code */}
            {(rewardDescription || couponCode) && (
              <p className="text-14 sm:text-16 font-normal text-gray-500 text-center">
                {rewardDescription || (couponCode && `20% Off : ${couponCode}`)}
              </p>
            )}
          </div>
        </div>

        {/* Got It Button */}
        <Button
          variant="brand"
          size="lg"
          className="w-full !text-white text-14 sm:text-16 mt-1 sm:mt-2"
          onClick={onClose}
        >
          Got It
        </Button>
      </div>
    </Modal>
  )
}
