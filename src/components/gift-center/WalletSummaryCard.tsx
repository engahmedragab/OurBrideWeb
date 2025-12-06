'use client'

import { Info } from 'lucide-react'

/**
 * Wallet Summary Card Component
 * Displays user's wallet balance and information
 */
export const WalletSummaryCard = () => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="text-12 sm:text-14 text-gray-500">Your Balance</span>
          <Info className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
        </div>
      </div>
      <div className="text-24 sm:text-32 font-semibold text-gray-900 mb-3 sm:mb-4">500 EGP</div>
      <p className="text-10 sm:text-12 text-gray-500 mb-1 sm:mb-2">
        Last update: 03/03/2023 1:00 am
      </p>
      <p className="text-10 sm:text-12 text-gray-500">
        Notice: Balance Can Only Used In Our Mobile App Only
      </p>
    </div>
  )
}

