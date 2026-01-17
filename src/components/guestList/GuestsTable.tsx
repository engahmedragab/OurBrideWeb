'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, ChevronDown, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Badge } from '@/components/ui/Badge'
import type { Guest, GuestGroup, GuestGroupId } from './mockGuests'
import { formatDate } from './mockGuests'

interface GuestsTableProps {
    categories: GuestGroup[]
    guests: Guest[]
    onToggleSelect: (id: string) => void
    onToggleStatus: (id: string) => void
    onDelete: (id: string) => void
    onAddGuest: (groupId: GuestGroupId) => void
    onAddCategory: () => void
}

export const GuestsTable = ({
    categories,
    guests,
    onToggleSelect,
    onToggleStatus,
    onDelete,
    onAddGuest,
    onAddCategory,
}: GuestsTableProps) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev)
            if (next.has(categoryId)) {
                next.delete(categoryId)
            } else {
                next.add(categoryId)
            }
            return next
        })
    }

    // Group guests by table
    const guestsByCategory = useMemo(() => {
        const map = new Map<string, Guest[]>()
        for (const category of categories) {
            map.set(category.id, [])
        }
        for (const guest of guests) {
            const categoryGuests = map.get(guest.groupId) || []
            categoryGuests.push(guest)
            map.set(guest.groupId, categoryGuests)
        }
        return map
    }, [categories, guests])

    // Calculate stats for each table
    const categoryStats = useMemo(() => {
        const map = new Map<string, { total: number; confirmed: number }>()
        for (const category of categories) {
            const categoryGuests = guestsByCategory.get(category.id) || []
            const confirmed = categoryGuests.filter(g => g.status === 'confirmed').length
            map.set(category.id, {
                total: categoryGuests.length,
                confirmed,
            })
        }
        return map
    }, [categories, guestsByCategory])

    if (categories.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 text-center">
                    <p className="text-16 text-gray-600 mb-2">No tables yet</p>
                    <p className="text-14 text-gray-500 mb-4">Create a table to start adding guests.</p>
                    <Button
                        variant="brand"
                        size="sm"
                        onClick={onAddCategory}
                        className="text-white"
                        type="button"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Table
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="border-b border-gray-200 bg-gray-50 hidden md:block">
                <div className="grid grid-cols-12 gap-4 px-4 py-3">
                    <div className="col-span-1">
                        <span className="text-12 font-semibold text-gray-700 uppercase">Select</span>
                    </div>
                    <div className="col-span-4">
                        <span className="text-12 font-semibold text-gray-700 uppercase">Table / Guest Name</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-12 font-semibold text-gray-700 uppercase">People</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-12 font-semibold text-gray-700 uppercase">Registered</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-12 font-semibold text-gray-700 uppercase">Status</span>
                    </div>
                    <div className="col-span-1">
                        <span className="text-12 font-semibold text-gray-700 uppercase">Actions</span>
                    </div>
                </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
                {categories.map(category => {
                    const categoryGuests = guestsByCategory.get(category.id) || []
                    const stats = categoryStats.get(category.id) || { total: 0, confirmed: 0 }
                    const isExpanded = expandedCategories.has(category.id)
                    const hasGuests = categoryGuests.length > 0

                    return (
                        <div key={category.id} className="bg-white">
                            {/* Table Row */}
                            <div
                                className="grid grid-cols-12 gap-2 md:gap-4 px-2 md:px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => toggleCategory(category.id)}
                            >
                                <div className="col-span-1 flex items-center">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleCategory(category.id)
                                        }}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                <div className="col-span-8 md:col-span-4 flex items-center min-w-0">
                                    <span className="text-14 font-semibold text-gray-900 truncate">{category.title}</span>
                                    <span className="ml-2 text-12 text-gray-500 hidden md:inline">
                                        ({stats.total} guests, {stats.confirmed} confirmed)
                                    </span>
                                </div>
                                <div className="col-span-2 hidden md:flex items-center">
                                    <span className="text-14 text-gray-600">{stats.total}</span>
                                </div>
                                <div className="col-span-2 hidden md:flex items-center">
                                    <span className="text-14 text-gray-600">—</span>
                                </div>
                                <div className="col-span-2 hidden md:flex items-center">
                                    <span className="text-14 text-gray-600">—</span>
                                </div>
                                <div className="col-span-3 md:col-span-1 flex items-center justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onAddGuest(category.id)
                                        }}
                                        className="text-brand-500 hover:text-brand-600 hover:bg-brand-50"
                                        type="button"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Guest Rows (Nested) */}
                            {isExpanded && (
                                <div className="bg-gray-50 border-t border-gray-200">
                                    {!hasGuests ? (
                                        <div className="px-4 py-6 text-center">
                                            <p className="text-14 text-gray-500 mb-3">No guests in this table</p>
                                            <Button
                                                variant="outlineBrand"
                                                size="sm"
                                                onClick={() => onAddGuest(category.id)}
                                                className="text-brand-500"
                                                type="button"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Guest
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {categoryGuests.map(guest => (
                                                <div
                                                    key={guest.id}
                                                    className="grid grid-cols-12 gap-2 md:gap-4 px-2 md:px-4 py-3 hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="col-span-1 flex items-center">
                                                        <Checkbox
                                                            checked={guest.selected}
                                                            onChange={() => onToggleSelect(guest.id)}
                                                            variant="default"
                                                            size="md"
                                                        />
                                                    </div>
                                                    <div className="col-span-6 md:col-span-4 flex flex-col md:flex-row md:items-center min-w-0">
                                                        <span className="text-14 font-medium text-gray-900 truncate">{guest.name || 'Unnamed'}</span>
                                                        <span className="text-12 text-gray-500 md:hidden mt-1">
                                                            {guest.peopleCount} people • {formatDate(guest.registeredAt)}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 hidden md:flex items-center">
                                                        <span className="text-14 text-gray-600">{guest.peopleCount}</span>
                                                    </div>
                                                    <div className="col-span-2 hidden md:flex items-center">
                                                        <span className="text-14 text-gray-600">{formatDate(guest.registeredAt)}</span>
                                                    </div>
                                                    <div className="col-span-4 md:col-span-2 flex items-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => onToggleStatus(guest.id)}
                                                            className="cursor-pointer"
                                                            aria-label={`Toggle status for ${guest.name}`}
                                                        >
                                                            {guest.status === 'confirmed' ? (
                                                                <Badge variant="confirmed" size="sm" className="flex items-center gap-1.5 px-2.5 py-1">
                                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                                    <span className="text-12">Confirmed</span>
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex items-center gap-1.5 px-2.5 py-1 text-gray-500 border-gray-300"
                                                                >
                                                                    <XCircle className="h-3.5 w-3.5" />
                                                                    <span className="text-12">None</span>
                                                                </Badge>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="col-span-1 flex items-center justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => onDelete(guest.id)}
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            aria-label={`Delete ${guest.name}`}
                                                            type="button"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Add Table Button */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                <Button
                    variant="outlineBrand"
                    size="sm"
                    onClick={onAddCategory}
                    className="text-brand-500 hover:bg-brand-500 hover:text-white"
                    type="button"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Table
                </Button>
            </div>
        </div>
    )
}
