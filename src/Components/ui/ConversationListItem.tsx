'use client'

import { cn } from '@/lib/utils'
import type { Conversation } from '@/types/message'

export interface ConversationListItemProps {
  conversation: Conversation
  isActive?: boolean
  onClick?: () => void
  className?: string
}

/**
 * ConversationListItem component
 * Displays a single conversation item in the messages list
 */
export const ConversationListItem = ({
  conversation,
  isActive = false,
  onClick,
  className,
}: ConversationListItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-4 rounded-xl transition-all duration-200 text-left',
        'hover:bg-gray-50',
        isActive && 'bg-brand-50 hover:bg-brand-50',
        className
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={
            conversation.participantAvatar ||
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
          }
          alt={conversation.participantName}
          className="w-12 h-12 rounded-full object-cover"
        />
        {conversation.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name and Time */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className={cn(
              'text-14 font-semibold truncate',
              isActive ? 'text-brand-500' : 'text-gray-900'
            )}
          >
            {conversation.participantName}
          </h3>
          <span
            className={cn(
              'text-10 font-normal flex-shrink-0',
              isActive ? 'text-brand-500' : 'text-gray-500'
            )}
          >
            {conversation.lastMessageTime}
          </span>
        </div>

        {/* Last Message */}
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'text-12 truncate',
              isActive
                ? 'text-brand-500 font-medium'
                : conversation.unreadCount > 0
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-500 font-normal'
            )}
          >
            {conversation.lastMessage}
          </p>

          {/* Unread Badge */}
          {conversation.unreadCount > 0 && (
            <div className="flex-shrink-0 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
              <span className="text-10 font-semibold text-white">
                {conversation.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

