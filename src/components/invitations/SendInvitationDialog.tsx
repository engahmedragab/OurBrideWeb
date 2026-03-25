'use client'

import { useState } from 'react'
import { X, Send, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SendInvitationDialogProps {
  isOpen: boolean
  onClose: () => void
  onSend: (channel: string, customMessage?: string) => void
  guestName?: string
  isBulk?: boolean
  isPending?: boolean
}

export function SendInvitationDialog({
  isOpen,
  onClose,
  onSend,
  guestName,
  isBulk = false,
  isPending = false,
}: SendInvitationDialogProps) {
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp')
  const [customMessage, setCustomMessage] = useState('')
  const [useCustomMessage, setUseCustomMessage] = useState(false)

  if (!isOpen) return null

  const handleSubmit = () => {
    onSend(channel, useCustomMessage ? customMessage : undefined)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h3 className="text-16 font-bold text-gray-900">
              {isBulk ? 'Send All Invitations' : 'Send Invitation'}
            </h3>
            {guestName && (
              <p className="text-13 text-gray-500 mt-0.5">To: {guestName}</p>
            )}
            {isBulk && (
              <p className="text-12 text-gray-400 mt-0.5">
                This will send to all draft invitations with a phone number
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Channel Selection */}
          <div>
            <label className="text-12 font-medium text-gray-600 mb-2 block">Send via</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  channel === 'whatsapp'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-13 font-medium">WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('sms')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  channel === 'sms'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <Send className="h-5 w-5" />
                <span className="text-13 font-medium">SMS</span>
              </button>
            </div>
          </div>

          {/* Custom Message Toggle */}
          {!isBulk && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomMessage}
                  onChange={(e) => setUseCustomMessage(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-13 text-gray-700">Custom message</span>
              </label>

              {useCustomMessage && (
                <div className="mt-3">
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Dear {guestName}, you are invited to {brideName} & {groomName}'s wedding..."
                    className="w-full h-28 px-4 py-3 rounded-xl border border-gray-200 text-13 text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:ring-1 focus:ring-brand-200 outline-none resize-none transition-colors"
                  />
                  <p className="text-10 text-gray-400 mt-1">
                    Placeholders: {'{guestName}'}, {'{brideName}'}, {'{groomName}'}, {'{weddingDate}'}, {'{venue}'}, {'{qrLink}'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="brand"
              className="flex-1 text-white"
              onClick={handleSubmit}
              disabled={isPending}
              type="button"
            >
              <Send className="h-4 w-4 mr-2" />
              {isPending ? 'Sending...' : isBulk ? 'Send All' : 'Send'}
            </Button>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
