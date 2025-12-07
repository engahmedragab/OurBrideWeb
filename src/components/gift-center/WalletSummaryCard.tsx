'use client'

import { Info } from 'lucide-react'

/**
 * Wallet Summary Card Component
 * Displays user's wallet balance and information
 */
export const WalletSummaryCard = () => {
  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-100 shadow-sm">
      {/* Last Update */}
      <p className="text-8 sm:text-10 text-gray-500 mb-2 sm:mb-3">
        Last Update: 1/9/2025 11:17 AM
      </p>

      {/* Your Balance Section */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-10 sm:text-12 text-gray-600 font-normal">Your Balance</span>
          <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
        </div>
        <div className="text-14 sm:text-16 font-regular text-gray-900">500 EGP</div>
      </div>

      {/* Notice */}
      <p className="text-8 sm:text-10 text-gray-500">
        Notice: Balance Can Only Used in Our Bride App Only
      </p>
    </div>
  )
}

