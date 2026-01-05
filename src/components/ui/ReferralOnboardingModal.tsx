'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ChevronRight } from 'lucide-react'
import referralWelcomeSvg from '@/assets/svg/refferal-welcome.svg'
import referralInviteSvg from '@/assets/svg/refferal-invite.svg'
import referralCollectSvg from '@/assets/svg/refferal-collect.svg'

export interface ReferralOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Step {
  title: string
  description: string
  svg: string
}

/**
 * ReferralOnboardingModal Component
 * Shows a 3-step onboarding flow for the referral system
 */
export const ReferralOnboardingModal = ({
  isOpen,
  onClose,
}: ReferralOnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps: Step[] = [
    {
      title: 'Welcome To Referral System',
      description:
        "Invite people using your custom link\nThey'll get special offers, and earn\nrewards!",
      svg:
        typeof referralWelcomeSvg === 'string'
          ? referralWelcomeSvg
          : referralWelcomeSvg.src,
    },
    {
      title: 'Invite People To Earn More Coupons',
      description:
        'Invite friends\nand get coupons you can use to buy\nproducts or services',
      svg:
        typeof referralInviteSvg === 'string'
          ? referralInviteSvg
          : referralInviteSvg.src,
    },
    {
      title: 'Collect Diamond Points',
      description:
        'Earn extra Diamond Points\nwith every referral and unlock Special\nrewards!',
      svg:
        typeof referralCollectSvg === 'string'
          ? referralCollectSvg
          : referralCollectSvg.src,
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  if (!isOpen) return null

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm relative shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="p-6 text-center">
            {/* Title */}
            <h2 className="text-18 font-semibold text-gray-900 mb-6">
              Referral
            </h2>

            {/* SVG Illustration */}
            <div className="mb-6 flex justify-center">
              <Image
                src={currentStepData.svg}
                alt={currentStepData.title}
                width={160}
                height={160}
                className="w-40 h-40 object-contain"
              />
            </div>

            {/* Step Title */}
            <h3 className="text-18 font-semibold text-gray-900 mb-3">
              {currentStepData.title}
            </h3>

            {/* Step Description */}
            <p className="text-14 text-gray-500 mb-6 whitespace-pre-line leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Progress Dots and Navigation */}
            <div className="flex items-center justify-between">
              {/* Progress Dots */}
              <div className="flex items-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'w-8 bg-brand-500'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Button */}
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors shadow-md flex-shrink-0"
                aria-label={isLastStep ? 'Finish' : 'Next'}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
