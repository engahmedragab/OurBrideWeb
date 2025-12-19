'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface AddEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (eventName: string, eventCode?: string) => void
}

/**
 * AddEventModal Component
 * Modal for creating a new event or joining with an event code
 */
export const AddEventModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AddEventModalProps) => {
  const [eventName, setEventName] = useState('')
  const [eventCode, setEventCode] = useState('')

  const handleSubmit = () => {
    if (eventName.trim() || eventCode.trim()) {
      onSubmit?.(eventName.trim(), eventCode.trim() || undefined)
      setEventName('')
      setEventCode('')
      onClose()
    }
  }

  const handleClose = () => {
    setEventName('')
    setEventCode('')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (eventName.trim() || eventCode.trim())) {
      handleSubmit()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Event"
      maxWidth="md"
      containerClassName="p-5"
      headerClassName="px-0 pb-0 flex items-center justify-between gap-2.5"
      contentClassName="px-0 pt-4"
    >
      <div className="flex flex-col gap-4">
        {/* Event Name Input */}
        <div className="flex flex-col gap-2">
          <label className="text-14 font-normal text-gray-900">
            Event Name
          </label>
          <Input
            placeholder="Enter Event Name"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-auto px-4 py-3 text-14"
          />
        </div>

        {/* Divider with "Or Use an invitation Code" */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-100" />
          <p className="text-16 font-medium text-gray-500 text-center whitespace-nowrap px-2">
            Or Use an invitation Code
          </p>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Event Code Input */}
        <div className="flex flex-col gap-2">
          <label className="text-14 font-normal text-gray-900">
            Event Code
          </label>
          <Input
            placeholder="Enter Event Code"
            value={eventCode}
            onChange={e => setEventCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-auto px-4 py-3 text-14"
          />
        </div>
      </div>
    </Modal>
  )
}

