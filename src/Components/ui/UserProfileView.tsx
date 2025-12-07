'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowLeft, User, MessageSquare, BellOff, Ban, Phone } from 'lucide-react'
import { BlockUserModal } from './BlockUserModal'
import { ReportUserModal } from './ReportUserModal'

export interface UserProfileViewProps {
  user: {
    id: string
    name: string
    avatar?: string
    lastSeen?: string
    isOnline?: boolean
  }
  mediaItems: Array<{
    id: string
    url: string
    type: 'image' | 'video'
  }>
  onBack: () => void
  onViewProfile?: () => void
  onMute?: () => void
  onBlock?: () => void
  onCall?: () => void
  className?: string
}

/**
 * UserProfileView component
 * Displays user profile information and media gallery in chat
 */
export const UserProfileView = ({
  user,
  mediaItems,
  onBack,
  onViewProfile,
  onMute,
  onBlock,
  onCall,
  className,
}: UserProfileViewProps) => {
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const handleBlockClick = () => {
    setIsBlockModalOpen(true)
  }

  const handleBlockConfirm = () => {
    onBlock?.()
  }

  const handleOpenReportFromBlock = () => {
    setIsBlockModalOpen(false)
    setIsReportModalOpen(true)
  }

  const handleReportSubmit = (_reason: string, _details: string) => {
    // TODO: Implement report submission
  }

  return (
    <div className={cn('flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-14 font-medium">Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* User Info Section */}
        <div className="flex flex-col items-center py-8 px-4">
          {/* Avatar */}
          <div className="relative mb-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-brand-500"
            />
            {user.isOnline && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
            )}
          </div>

          {/* Name */}
          <h2 className="text-24 font-semibold text-gray-900 mb-2">
            {user.name}
          </h2>

          {/* Last Seen */}
          {user.lastSeen && (
            <p className="text-14 text-gray-500 mb-6">
              {user.lastSeen}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-8 mb-8">
            <button
              onClick={onViewProfile}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                <User className="h-6 w-6 text-brand-500" />
              </div>
              <span className="text-12 text-brand-500 font-medium">Profile</span>
            </button>

            <button
              onClick={onMute}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                <BellOff className="h-6 w-6 text-brand-500" />
              </div>
              <span className="text-12 text-brand-500 font-medium">Mute</span>
            </button>

            <button
              onClick={handleBlockClick}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                <Ban className="h-6 w-6 text-brand-500" />
              </div>
              <span className="text-12 text-brand-500 font-medium">Block</span>
            </button>

            <button
              onClick={onCall}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                <Phone className="h-6 w-6 text-brand-500" />
              </div>
              <span className="text-12 text-brand-500 font-medium">Call</span>
            </button>
          </div>
        </div>

        {/* Media Section */}
        {mediaItems.length > 0 && (
          <div className="px-4 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-16 font-semibold text-gray-900">
                Media And Files
              </h3>
              <span className="text-14 text-gray-500">
                ({mediaItems.length})
              </span>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-3 gap-2">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt="Media"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Block User Modal */}
      <BlockUserModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={handleBlockConfirm}
        onReport={handleOpenReportFromBlock}
        userName={user.name}
      />

      {/* Report User Modal */}
      <ReportUserModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        userName={user.name}
      />
    </div>
  )
}

