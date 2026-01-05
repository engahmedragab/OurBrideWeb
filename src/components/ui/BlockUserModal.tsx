'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import deleteXIcon from '@/assets/svg/deleteXIcon.svg'
import successCheck from '@/assets/svg/successCheck.svg'

export interface BlockUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  onReport?: () => void
  userName?: string
}

/**
 * Modal component for blocking a user
 * Shows confirmation step and success step
 */
export const BlockUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  onReport,
  userName = 'this user',
}: BlockUserModalProps) => {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm')

  const handleClose = () => {
    setStep('confirm')
    onClose()
  }

  const handleBlock = () => {
    setStep('success')
    onConfirm()
  }

  const handleReport = () => {
    if (onReport) {
      onReport()
    } else {
      handleClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Block User"
      maxWidth="sm"
      showCloseButton={true}
      containerClassName="w-full max-w-[380px]"
      contentClassName="px-6 pb-6 pt-0"
    >
      {step === 'confirm' ? (
        <div className="flex flex-col items-center gap-6">
          {/* Icon - Red X */}
          <div className="flex items-center justify-center mt-2">
            <Image
              src={deleteXIcon}
              alt="Block User"
              width={120}
              height={120}
              className="w-20 h-20"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-3 text-center w-full">
            <h3 className="text-16 font-semibold text-gray-900 leading-tight">
              Are you sure you want to block {userName}?
            </h3>
            <p className="text-14 font-normal text-gray-400 leading-relaxed">
              They will no longer be able to contact you once blocked.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full mt-2">
            <Button
              variant="brand"
              size="lg"
              onClick={handleClose}
              className="w-full text-white rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleBlock}
              className="w-full bg-brand-50 text-brand-500 border border-brand-500 hover:bg-brand-100 hover:text-brand-600 rounded-full"
            >
              Block User
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Success Icon - Green checkmark */}
          <div className="flex items-center justify-center mt-2">
            <Image
              src={successCheck}
              alt="Success"
              width={120}
              height={120}
              className="w-20 h-20"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-3 text-center w-full">
            <h3 className="text-16 font-semibold text-gray-900 leading-tight">
              This account has been blocked
            </h3>
            <p className="text-14 font-normal text-gray-400 leading-relaxed">
              You will no longer be able to communicate with this user to ensure
              safety and compliance with OurBride policies.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full mt-2">
            <Button
              variant="brand"
              size="lg"
              onClick={handleClose}
              className="w-full text-white rounded-full"
            >
              Done
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReport}
              className="w-full bg-white text-brand-500 border border-brand-500 hover:bg-brand-50 rounded-full"
            >
              Report
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
