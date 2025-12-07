'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import { SearchInput } from './SearchInput'
import { ArrowLeft, MessageSquare } from 'lucide-react'

export interface MessagesCenterLayoutProps {
  conversationsList: ReactNode
  chatView: ReactNode
  searchValue?: string
  onSearchChange?: (value: string) => void
  className?: string
}

/**
 * MessagesCenterLayout component
 * Responsive layout for messages center with mobile conversation toggle
 */
export const MessagesCenterLayout = ({
  conversationsList,
  chatView,
  searchValue = '',
  onSearchChange,
  className,
}: MessagesCenterLayoutProps) => {
  const [showConversations, setShowConversations] = useState(true)

  return (
    <div className={cn('flex gap-4 h-full', className)}>
      {/* Left Sidebar - Conversations List */}
      <div
        className={cn(
          'w-full md:w-96 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden shadow-sm',
          'md:flex',
          showConversations ? 'flex' : 'hidden md:flex'
        )}
      >
        {/* Search Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-18 sm:text-20 font-semibold text-gray-900 mb-3 sm:mb-4">
            Messages Center
          </h2>
          <SearchInput
            placeholder="Search Chat"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
            size="md"
            className="w-full"
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">{conversationsList}</div>
      </div>

      {/* Right Side - Chat View */}
      <div
        className={cn(
          'flex-1 flex flex-col gap-4',
          'md:flex',
          showConversations ? 'hidden md:flex' : 'flex'
        )}
      >
        {/* Mobile Back Button */}
        <button
          onClick={() => setShowConversations(true)}
          className="md:hidden flex items-center gap-2 text-brand-500 hover:text-brand-600 transition-colors py-2 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-14 font-medium">Back to Conversations</span>
        </button>
        {chatView}
      </div>

      {/* Mobile Conversation Toggle FAB (when chat is hidden) */}
      {!showConversations && (
        <button
          onClick={() => setShowConversations(true)}
          className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brand-500 text-white shadow-lg flex items-center justify-center hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          aria-label="Show conversations"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}


