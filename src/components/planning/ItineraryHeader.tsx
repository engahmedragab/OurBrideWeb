'use client'

import { useState } from 'react'
import { ArrowLeft, Pencil, Check, X, Save, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

export interface ItineraryHeaderProps {
  date: Date
  eventTitle?: string
  onRefresh?: () => void
  onSave?: () => void
  className?: string
  showBackButton?: boolean
  onEditTitle?: (title: string) => void
  onDelete?: () => void
}

export const ItineraryHeader = ({
  date,
  eventTitle,
  onRefresh: _onRefresh,
  onSave,
  className,
  showBackButton = false,
  onEditTitle,
  onDelete,
}: ItineraryHeaderProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(eventTitle || '')

  const formattedDate = format(date, 'EEEE, dd MMM, yyyy')

  const handleEditClick = () => {
    if (onEditTitle) {
      setIsEditing(true)
      setEditedTitle(eventTitle || '')
    }
  }

  const handleSaveEdit = () => {
    if (onEditTitle && editedTitle.trim()) {
      onEditTitle(editedTitle.trim())
      setIsEditing(false)
    } else if (onEditTitle) {
      // If empty, revert to default
      onEditTitle('')
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedTitle(eventTitle || '')
    setIsEditing(false)
  }

  return (
    <div className={cn('w-full', className)}>
      {showBackButton && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </button>
          <h1 className="text-16 font-normal text-gray-900">Events Itinerary</h1>
        </div>
      )}

      {/* Save button (same style as Occasions) - only show when onSave is provided */}
      {onSave && (
        <div className="mb-4 flex justify-start">
          <Button
            className="text-white"
            onClick={onSave}
            variant="brand"
            size="md"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      )}

      <div className="mb-4 flex flex-col items-center justify-center ">
        <p className="text-14 text-gray-500 mb-1">
          Event Date : {formattedDate}
        </p>
        {eventTitle && (
          <div className="flex flex-col items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-24 text-gray-900 font-medium text-center border-b-2 border-brand-500 focus:outline-none focus:border-brand-600 bg-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit()
                    } else if (e.key === 'Escape') {
                      handleCancelEdit()
                    }
                  }}
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Save title"
                >
                  <Check className="h-5 w-5 text-brand-500" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Cancel edit"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-24 text-gray-400 font-medium">{eventTitle}</h2>
                {(onEditTitle || onDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Title options"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      {onEditTitle && (
                        <DropdownMenuItem
                          onClick={handleEditClick}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={onDelete}
                          className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
            {!isEditing && <div className="h-0.5 w-12 bg-brand-500" />}
          </div>
        )}
      </div>
    </div>
  )
}

