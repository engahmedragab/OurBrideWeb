'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { SelectPopover } from '@/components/ui/SelectPopover'
import { Button } from '@/components/ui/Button'
import type { GuestSide, GuestGroupId, GuestStatus, GuestGroup } from './mockGuests'

interface AddGuestDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (guest: {
    side: GuestSide
    groupName: string // Changed from groupId to groupName
    name: string
    peopleCount: number
    registeredAt: string
    status: GuestStatus
  }) => void
  defaultSide: GuestSide
  defaultGroupId?: GuestGroupId
  availableGroups: GuestGroup[]
  forcedGroupId?: GuestGroupId // When set, locks the group and hides group selection
  allowGroupCreation?: boolean // When false, hides group creation options
}

export const AddGuestDialog = ({
  isOpen,
  onClose,
  onSubmit,
  defaultSide,
  defaultGroupId,
  availableGroups,
  forcedGroupId,
  allowGroupCreation = true,
}: AddGuestDialogProps) => {
  const [side, setSide] = useState<GuestSide>(defaultSide)
  const [name, setName] = useState('')
  const [peopleCount, setPeopleCount] = useState(1)
  const [status, setStatus] = useState<GuestStatus>('none')
  const [newGroupTitle, setNewGroupTitle] = useState('')
  const [errors, setErrors] = useState<{
    name?: string
    peopleCount?: string
    newGroup?: string
  }>({})

  useEffect(() => {
    if (isOpen) {
      setSide(defaultSide)
      setName('')
      setPeopleCount(1)
      setStatus('none')
      setNewGroupTitle('')
      setErrors({})
    }
  }, [isOpen, defaultSide])

  const handleSubmit = () => {
    const newErrors: typeof errors = {}
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (peopleCount < 1 || peopleCount > 20) {
      newErrors.peopleCount = 'People count must be between 1 and 20'
    }
    
    // Always require group name
    let groupName = ''
    if (forcedGroupId) {
      // If group is forced, use the existing group name
      const existingGroup = availableGroups.find(g => g.id === forcedGroupId)
      groupName = existingGroup?.title || ''
    } else if (allowGroupCreation) {
      // Use the new group name from input
      if (!newGroupTitle.trim()) {
        newErrors.newGroup = 'Group name is required'
      } else {
        groupName = newGroupTitle.trim()
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!groupName) {
      newErrors.newGroup = 'Group name is required'
      setErrors(newErrors)
      return
    }

    onSubmit({
      side,
      groupName: groupName, // Pass group name directly
      name: name.trim(),
      peopleCount,
      registeredAt: new Date().toISOString().split('T')[0],
      status,
    })
    onClose()
  }


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Guest"
      maxWidth="md"
      containerClassName="w-[calc(100vw-32px)] sm:w-full max-w-[560px]"
      contentClassName="p-4 sm:p-6 max-h-[75vh] overflow-y-auto md:max-h-none md:overflow-visible"
    >
      <div className="space-y-4">
        {/* Side Selection */}
        <div>
          <label className="block text-14 font-medium text-gray-700 mb-2">
            Side
          </label>
          <SelectPopover
            value={side}
            onChange={value => setSide(value as GuestSide)}
            options={[
              { value: 'bride', label: 'Bride' },
              { value: 'groom', label: 'Groom' },
            ]}
            placeholder="Select side"
          />
        </div>

        {/* Group Name - Always create new group */}
        {allowGroupCreation && (
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">
              Group Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={newGroupTitle}
              onChange={e => {
                setNewGroupTitle(e.target.value)
                if (errors.newGroup) {
                  setErrors(prev => ({ ...prev, newGroup: undefined }))
                }
              }}
              placeholder="Enter new group name"
              variant={errors.newGroup ? 'error' : 'default'}
              errorMessage={errors.newGroup}
              size="md"
            />
          </div>
        )}

        {/* Show locked group info if group is forced */}
        {forcedGroupId && (
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">
              Group
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-16 text-gray-700">
              {availableGroups.find(g => g.id === forcedGroupId)?.title || 'Selected Group'}
            </div>
          </div>
        )}

        {/* Name Input */}
        <div>
          <label className="block text-14 font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={e => {
              setName(e.target.value)
              if (errors.name) {
                setErrors(prev => ({ ...prev, name: undefined }))
              }
            }}
            placeholder="Enter guest name"
            variant={errors.name ? 'error' : 'default'}
            errorMessage={errors.name}
            size="md"
          />
        </div>

        {/* People Count */}
        <div>
          <label className="block text-14 font-medium text-gray-700 mb-2">
            Total People Number <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={peopleCount}
            onChange={e => {
              const val = parseInt(e.target.value) || 1
              const clamped = Math.max(1, Math.min(20, val))
              setPeopleCount(clamped)
              if (errors.peopleCount) {
                setErrors(prev => ({ ...prev, peopleCount: undefined }))
              }
            }}
            min={1}
            max={20}
            placeholder="Enter number of people"
            variant={errors.peopleCount ? 'error' : 'default'}
            errorMessage={errors.peopleCount}
            size="md"
          />
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-14 font-medium text-gray-700 mb-2">
            Status
          </label>
          <SelectPopover
            value={status}
            onChange={value => setStatus(value as GuestStatus)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'confirmed', label: 'Confirmed' },
            ]}
            placeholder="Select status"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} size="md" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button variant="brand" onClick={handleSubmit} size="md" className="w-full sm:w-auto text-white ">
            Add Guest
          </Button>
        </div>
      </div>
    </Modal>
  )
}



