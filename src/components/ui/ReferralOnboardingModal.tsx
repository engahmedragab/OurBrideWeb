'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ChevronRight } from 'lucide-react'
import referralWelcomeSvg from '@/assets/svg/refferal-welcome.svg'
import referralInviteSvg from '@/assets/svg/refferal-invite.svg'
import referralCollectSvg from '@/assets/svg/refferal-collect.svg'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'
import { cn } from '@/lib/utils'

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
  const t = useI18nTranslations('referrals')
  const isRTL = useIsRTL()
  const [currentStep, setCurrentStep] = useState(0)

  const steps: Step[] = [
    {
      title: t('onboarding.steps.welcome.title'),
      description: t('onboarding.steps.welcome.description'),
      svg: typeof referralWelcomeSvg === 'string' ? referralWelcomeSvg : referralWelcomeSvg.src,
    },
    {
      title: t('onboarding.steps.invite.title'),
      description: t('onboarding.steps.invite.description'),
      svg: typeof referralInviteSvg === 'string' ? referralInviteSvg : referralInviteSvg.src,
    },
    {
      title: t('onboarding.steps.collect.title'),
      description: t('onboarding.steps.collect.description'),
      svg: typeof referralCollectSvg === 'string' ? referralCollectSvg : referralCollectSvg.src,
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
        className="fixed inset-0 bg-black/50 z-[9999] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm relative shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className={cn(
              "absolute top-4 text-gray-400 hover:text-gray-600 transition-colors z-[9999]",
              isRTL ? "left-4" : "right-4"
            )}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="p-6 text-center">
            {/* Title */}
            <h2 className="text-18 font-semibold text-gray-900 mb-6">
              {t('onboarding.title')}
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
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'w-8 bg-brand-500'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Button */}
              <button
                onClick={handleNext} className={cn(
                  "text-brand-500 text-20 font-semibold flex items-center justify-center hover:scale-110 transition-colors flex-shrink-0",
                  isRTL && "rotate-180"
                )}
                aria-label={isLastStep ? t('onboarding.finish') : t('onboarding.next')}
              >
                <ChevronRight className={cn("h-5 w-5", isRTL && "rotate-180")} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

