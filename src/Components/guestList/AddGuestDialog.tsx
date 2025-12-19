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
    groupId: GuestGroupId
    name: string
    peopleCount: number
    registeredAt: string
    status: GuestStatus
  }) => void
  defaultSide: GuestSide
  defaultGroupId?: GuestGroupId
  availableGroups: GuestGroup[]
  onAddNewGroup?: (groupTitle: string) => GuestGroupId
  onGroupCreated?: (groupId: GuestGroupId) => void
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
  onAddNewGroup,
  onGroupCreated,
  forcedGroupId,
  allowGroupCreation = true,
}: AddGuestDialogProps) => {
  const [side, setSide] = useState<GuestSide>(defaultSide)
  const [groupId, setGroupId] = useState<GuestGroupId>(
    forcedGroupId || defaultGroupId || availableGroups[0]?.id || 'friends'
  )
  const [name, setName] = useState('')
  const [peopleCount, setPeopleCount] = useState(1)
  const [status, setStatus] = useState<GuestStatus>('none')
  const [groupMode, setGroupMode] = useState<'existing' | 'new'>('existing')
  const [newGroupTitle, setNewGroupTitle] = useState('')
  const [errors, setErrors] = useState<{
    name?: string
    peopleCount?: string
    newGroup?: string
  }>({})

  useEffect(() => {
    if (isOpen) {
      setSide(defaultSide)
      setGroupId(forcedGroupId || defaultGroupId || availableGroups[0]?.id || 'friends')
      setName('')
      setPeopleCount(1)
      setStatus('none')
      setGroupMode(forcedGroupId ? 'existing' : (defaultGroupId ? 'existing' : 'existing'))
      setNewGroupTitle('')
      setErrors({})
    }
  }, [isOpen, defaultSide, defaultGroupId, availableGroups, forcedGroupId])

  const handleSubmit = () => {
    const newErrors: typeof errors = {}
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (peopleCount < 1 || peopleCount > 20) {
      newErrors.peopleCount = 'People count must be between 1 and 20'
    }
    
    let finalGroupId = forcedGroupId || groupId
    
    // Handle new group creation (only if not forced and creation is allowed)
    if (!forcedGroupId && allowGroupCreation && groupMode === 'new') {
      if (!newGroupTitle.trim()) {
        newErrors.newGroup = 'Group name is required'
      } else {
        const trimmedTitle = newGroupTitle.trim()
        // Check if group with same name (case-insensitive) already exists
        const existingGroup = availableGroups.find(
          g => g.title.toLowerCase() === trimmedTitle.toLowerCase()
        )
        
        if (existingGroup) {
          // Use existing group instead of creating duplicate
          finalGroupId = existingGroup.id
        } else if (onAddNewGroup) {
          // Create new group
          finalGroupId = onAddNewGroup(trimmedTitle)
          if (onGroupCreated) {
            onGroupCreated(finalGroupId)
          }
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      side,
      groupId: finalGroupId,
      name: name.trim(),
      peopleCount,
      registeredAt: new Date().toISOString().split('T')[0],
      status,
    })
    onClose()
  }


  const groupOptions = availableGroups.map(group => ({
    value: group.id,
    label: group.title,
  }))

  const isGroupLocked = !!forcedGroupId
  const showGroupSelection = !isGroupLocked && allowGroupCreation

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

        {/* Group Selection - Only show if not locked */}
        {showGroupSelection && (
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">
              Group
            </label>
            
            {/* Toggle between existing and new group */}
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                variant={groupMode === 'existing' ? 'brand' : 'outline'}
                size="sm"
                onClick={() => {
                  setGroupMode('existing')
                  setNewGroupTitle('')
                  setErrors(prev => ({ ...prev, newGroup: undefined }))
                }}
                className={`flex-1 text-12 ${groupMode === 'existing' ? 'text-white' : ''}`}
              >
                Existing Group
              </Button>
              <Button
                type="button"
                variant={groupMode === 'new' ? 'brand' : 'outline'}
                size="sm"
                onClick={() => {
                  setGroupMode('new')
                  setNewGroupTitle('')
                  setErrors(prev => ({ ...prev, newGroup: undefined }))
                }}
                className={`flex-1 text-12 ${groupMode === 'new' ? 'text-white' : ''}`}
              >
                New Group
              </Button>
            </div>

            {groupMode === 'existing' ? (
              <SelectPopover
                value={groupId}
                onChange={value => setGroupId(value as GuestGroupId)}
                options={groupOptions.length > 0 ? groupOptions : [{ value: '', label: 'No groups available' }]}
                placeholder="Select a group"
                errorMessage={errors.newGroup}
              />
            ) : (
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
            )}
          </div>
        )}

        {/* Show locked group info if group is forced */}
        {isGroupLocked && (
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



