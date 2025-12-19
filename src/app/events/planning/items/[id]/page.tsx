'use client'

import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  CheckCircle2,
  Calendar,
  DollarSign,
  Store,
  Package,
  Sidebar,
} from 'lucide-react'
import { Button, InsightCard } from '@/components/ui'

export default function ItemDetailsPage() {
 // const { id } = useParams()

  // Temporary mock item (later replace with API / context)
  const item = {
    id:1,
    name: 'Gas Cooker',
    description: '5-burner stainless steel cooker',
    quantity: 1,
    estimatedQuantity: 1,
    cost: 9000,
    totalCost: 9000,
    remaining: 4000,
    advancePayment: 0,
    seller: 'Kitchen Pro',
    buyDate: '2025-01-01',
    iscompleted: true,
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8">
      
      {/* Status */}
      {item.iscompleted && (
        <div className="flex items-center gap-2 text-green-600 mb-6">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-14 font-normal">Completed</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-6">
            <div>
              <h1 className="text-24 md:text-28 font-normal text-gray-900 mb-2">
                {item.name}
              </h1>
              <p className="text-14 md:text-16 text-gray-600">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InfoBox label="Quantity" value={item.quantity} />
              <InfoBox label="Estimated Quantity" value={item.estimatedQuantity} />
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Store className="w-4 h-4 text-brand-500" />
              <span>{item.seller}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-brand-500" />
              <span>
                {new Date(item.buyDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <FinanceBox label="Cost" value={item.cost} />
            <FinanceBox label="Total Cost" value={item.totalCost} />
            <FinanceBox label="Advance Payment" value={item.advancePayment} />
            <FinanceBox label="Remaining" value={item.remaining} highlight />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-10">
          <Button variant="outline">Edit</Button>
          <Button variant="brand" className="text-white">
            Mark as Completed
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Helpers ---------- */

function InfoBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <p className="text-12 text-gray-500 mb-1">{label}</p>
      <p className="text-18 font-normal text-gray-900">{value}</p>
    </div>
  )
}

function FinanceBox({
  label,
  value,
  highlight,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'border rounded-xl p-5',
        highlight
          ? 'border-brand-300 bg-brand-50'
          : 'border-gray-200 bg-white'
      )}
    >
      <p className="text-12 text-gray-500 mb-2">{label}</p>
      <div className="flex items-center gap-1">
        <DollarSign className="w-5 h-5 text-brand-500" />
        <span className="text-22 font-normal text-gray-900">
          {value.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
