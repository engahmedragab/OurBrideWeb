'use client'

import React, { useState } from 'react'
import {
  Package,
  Store,
  Calendar,
  Tag,
  MapPin,
  Link as LinkIcon,
  Clock,
  NotebookPen,
  CheckCircle2,
  Circle,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { useIsRTL } from '@/i18n'
import EditItemModal from '@/components/ui/EditItemModal'

interface ItemData {
  id: string
  name: string
  description: string
  quantity: number
  cost: number
  totalCost: number
  advancePayment: number
  remaining: number
  seller: string
  buyDate: string
  iscompleted: boolean
  hasProvider: boolean
  providerType: string
  providerName: string
  providerAddress: string
  providerLink: string
  hasReminder: boolean
  reminderDate: string
  reminderTime: string
  reminderNote: string
  notesContent: string
}

interface ItemDetailsPageClientProps {
  itemId: string
}

export function ItemDetailsPageClient({
  itemId,
}: ItemDetailsPageClientProps) {
  const isRTL = useIsRTL()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [itemData, setItemData] = useState<ItemData>({
    id: itemId,
    name: 'Sharp Inverter Refrigerator 18ft',
    description:
      'Digital refrigerator, Black color, model SJ-GV58G-BK, equipped with Plasma Cluster technology for odor prevention.',
    quantity: 1,
    cost: 45000,
    totalCost: 45000,
    advancePayment: 15000,
    remaining: 30000,
    seller: 'B.TECH Egypt',
    buyDate: '2025-05-15',
    iscompleted: false,
    hasProvider: true,
    providerType: 'Installation Service',
    providerName: 'El-Araby Group Service Center',
    providerAddress: 'Qalyub, Cairo-Alexandria Agricultural Road',
    providerLink: 'https://www.elarabygroup.com/en/service-centers',
    hasReminder: true,
    reminderDate: '2025-05-20',
    reminderTime: '14:00',
    reminderNote:
      'Call customer service to activate the warranty and confirm installation date.',
    notesContent:
      '10-year full warranty. Down payment paid via Credit Card. Remaining balance to be paid in cash upon delivery.',
  })

  const handleSave = (updatedData: ItemData) => {
    const total = (updatedData.cost || 0) * (updatedData.quantity || 0)
    const remain = total - (updatedData.advancePayment || 0)

    setItemData({
      ...updatedData,
      totalCost: total,
      remaining: remain,
    })

    setIsEditModalOpen(false)
  }

  // Currency formatter
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace('EGP', '£')

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-22 md:text-26 font-normal text-gray-900">
            {itemData.name}
          </h1>

          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-12 font-normal',
              itemData.iscompleted
                ? 'bg-green-50 text-green-700'
                : 'bg-orange-50 text-orange-600'
            )}
          >
            {itemData.iscompleted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
            {itemData.iscompleted ? 'Completed' : 'In Progress'}
          </div>
        </div>

        <Button
          variant="brand"
          size="md"
          onClick={() => setIsEditModalOpen(true)}
          className="text-white"
        >
          Edit Details
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
            <h3 className="flex items-center gap-2 text-12 font-normal uppercase text-gray-400 tracking-wider">
              <Package className="w-4 h-4 text-brand-500" />
              Basic Information
            </h3>

            <p className="text-14 md:text-15 text-gray-700 leading-relaxed">
              {itemData.description || 'No description provided.'}
            </p>

            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <Store className="w-5 h-5 text-brand-500" />
              <div>
                <p className="text-12 text-gray-500">Seller</p>
                <p className="text-14 font-normal text-gray-900">
                  {itemData.seller || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Provider Details */}
          {itemData.hasProvider && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
              <h3 className="flex items-center gap-2 text-12 font-normal uppercase text-gray-400 tracking-wider">
                <Tag className="w-4 h-4 text-brand-500" />
                Provider Details
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-12 text-gray-500">Type</p>
                  <p className="text-14 font-normal text-gray-900">
                    {itemData.providerType}
                  </p>
                </div>
                <div>
                  <p className="text-12 text-gray-500">Name</p>
                  <p className="text-14 font-normal text-gray-900">
                    {itemData.providerName}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 text-14 text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-500" />
                {itemData.providerAddress}
              </div>

              {itemData.providerLink && (
                <Link
                  href={itemData.providerLink}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-14 text-brand-500 hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  Visit provider website
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="text-center border-b border-gray-100 pb-5">
              <p className="text-12 text-gray-500 uppercase">Total Cost</p>
              <p className="text-28 font-normal text-brand-500 mt-1">
                {formatCurrency(itemData.totalCost)}
              </p>
            </div>

            <div className="space-y-3 text-14">
              <div className="flex justify-between text-gray-600">
                <span>Unit × Qty</span>
                <span className="font-normal text-gray-900">
                  {formatCurrency(itemData.cost)} × {itemData.quantity}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Advance Paid</span>
                <span className="font-normal text-green-600">
                  -{formatCurrency(itemData.advancePayment)}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-dashed">
                <span className="font-normal text-gray-900">Remaining</span>
                <span className="font-normal text-orange-500">
                  {formatCurrency(itemData.remaining)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 bg-brand-50 rounded-xl py-2">
              <Calendar className="w-4 h-4 text-brand-500" />
              <span className="text-12 text-brand-700">
                {itemData.buyDate}
              </span>
            </div>
          </div>

          {/* Reminder */}
          {itemData.hasReminder && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 space-y-3">
              <h4 className="flex items-center gap-2 text-12 uppercase text-orange-700">
                <Clock className="w-4 h-4" />
                Reminder
              </h4>
              <p className="text-14 font-normal text-orange-800">
                {itemData.reminderDate} at {itemData.reminderTime}
              </p>
              <p className="text-13 text-orange-700">
                {itemData.reminderNote}
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            <h4 className="flex items-center gap-2 text-12 uppercase text-gray-400">
              <NotebookPen className="w-4 h-4 text-brand-500" />
              Notes
            </h4>
            <p className="text-13 text-gray-600 leading-relaxed whitespace-pre-wrap">
              {itemData.notesContent || 'No additional notes recorded.'}
            </p>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <Link
        href="/events/planning/items"
        className={cn(
          "inline-flex items-center gap-2 text-14 text-gray-500 hover:text-brand-500 transition-colors",
          isRTL && "flex-row-reverse"
        )}
      >
        <ChevronLeft className={cn("w-4 h-4", isRTL && "scale-x-[-1]")} />
        Back to items
      </Link>

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        itemData={itemData as unknown as Record<string, unknown>}
        onSave={(updatedData) => handleSave(updatedData as unknown as ItemData)}
      />
    </div>
  )
}
