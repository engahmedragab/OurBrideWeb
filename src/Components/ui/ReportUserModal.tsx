'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Circle } from 'lucide-react'
import Image from 'next/image'
import successCheck from '@/assets/svg/successCheck.svg'

export interface ReportUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string, details: string) => void
  userName?: string
}

/**
 * Modal component for reporting a user
 * Shows form step and success step
 */
export const ReportUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  userName = 'this user',
}: ReportUserModalProps) => {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [details, setDetails] = useState<string>('')

  const reportReasons = [
    'Spam / Fake Activity',
    'Fake Profile',
    'Scam / Fraud',
    'Harassment / Abuse',
    'Other',
  ]

  const handleClose = () => {
    setStep('form')
    setSelectedReason('')
    setDetails('')
    onClose()
  }

  const handleSubmitReport = () => {
    if (!selectedReason) return
    onSubmit(selectedReason, details)
    setStep('success')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Report User"
      maxWidth="sm"
      showCloseButton={true}
      containerClassName="w-full max-w-[380px]"
      contentClassName="px-6 pb-6 pt-2"
    >
      {step === 'form' ? (
        <div className="flex flex-col gap-4">
          {/* Report Reasons */}
          <div className="flex flex-col gap-2">
            {reportReasons.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => setSelectedReason(reason)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 text-14 font-normal text-gray-900 hover:bg-gray-50 hover:border-brand-500 transition-colors text-left"
              >
                <div className="flex-shrink-0">
                  {selectedReason === reason ? (
                    <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-brand-500" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <span>{reason}</span>
              </button>
            ))}
          </div>

          {/* Details Textarea */}
          <div className="flex flex-col gap-2">
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tell Us What Happened ?"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-14 font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 resize-none min-h-[80px]"
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="brand"
            size="lg"
            onClick={handleSubmitReport}
            disabled={!selectedReason}
            className="w-full text-white rounded-full mt-2"
          >
            Submit
          </Button>
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
              Report Submitted
            </h3>
            <p className="text-14 font-normal text-gray-400 leading-relaxed">
              Thank you for your report. Our team will review your report and
              update you soon.
            </p>
          </div>

          {/* Done Button */}
          <div className="flex flex-col gap-3 w-full mt-2">
            <Button
              variant="brand"
              size="lg"
              onClick={handleClose}
              className="w-full text-white rounded-full"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

