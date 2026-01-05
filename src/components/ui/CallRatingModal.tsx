'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { RatingInput } from '@/components/ui/RatingInput'
import Image from 'next/image'
import successCheck from '@/assets/svg/successCheck.svg'

export interface CallRatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rating: number) => void
}

/**
 * CallRatingModal component
 * Modal for rating a call after it ends
 */
export const CallRatingModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CallRatingModalProps) => {
  const [rating, setRating] = useState(0)
  const [step, setStep] = useState<'rating' | 'success'>('rating')

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating)
      setStep('success')
    }
  }

  const handleClose = () => {
    setRating(0)
    setStep('rating')
    onClose()
  }

  const handleDone = () => {
    handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Call Rating"
      maxWidth="sm"
      showCloseButton
      containerClassName="w-full max-w-[380px]"
      contentClassName="px-6 pb-6 pt-0"
    >
      {step === 'rating' ? (
        <div className="flex flex-col items-center gap-6">
          {/* Rating Stars */}
          <RatingInput
            rating={rating}
            onRatingChange={setRating}
            size="lg"
            color="brand"
            className="mt-2"
          />

          {/* Question Text */}
          <h3 className="text-16 font-normal text-gray-900 text-center">
            How Was Your Call ?
          </h3>

          {/* Submit Button */}
          <Button
            variant="brand"
            size="lg"
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full rounded-full text-white"
          >
            Submit
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Success Icon */}
          <div className="flex items-center justify-center mt-2">
            <Image
              src={successCheck}
              alt="Success"
              width={120}
              height={120}
              className="w-24 h-24"
            />
          </div>

          {/* Thank You Message */}
          <h3 className="text-16 font-normal text-gray-900 text-center">
            Thank you For Your Rating !
          </h3>

          {/* Done Button */}
          <Button
            variant="brand"
            size="lg"
            onClick={handleDone}
            className="w-full rounded-full text-white"
          >
            Done
          </Button>
        </div>
      )}
    </Modal>
  )
}
