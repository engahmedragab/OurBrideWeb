'use client'

import { Lock, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

/**
 * Change Password View with Error States - Pure UI Only (No Logic)
 * Static error variant for visual verification
 */
export function ChangePasswordViewError() {
  return (
    <div className="max-w-2xl">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-normal text-gray-900">Change Password</h1>
        <button
          type="button"
          className="text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Current Password Field - WITH ERROR */}
        <div className="mb-6">
          <label className="block text-14 font-normal text-gray-900 mb-2">
            Current Password
          </label>
          <Input
            type="password"
            placeholder="Enter Password"
            prefixIcon={Lock}
            variant="error"
            suffix={<EyeOff className="h-6 w-6 text-red-500" />}
            errorMessage="Password isn't correct, please try again"
            readOnly
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              Forget Password?
            </button>
          </div>
        </div>

        {/* New Password Field - NO ERROR */}
        <div className="mb-6">
          <label className="block text-14 font-normal text-gray-900 mb-2">
            New Password
          </label>
          <Input
            type="password"
            placeholder="Enter New Password"
            prefixIcon={Lock}
            suffix={<EyeOff className="h-6 w-6 text-gray-400" />}
            readOnly
          />
        </div>

        {/* Confirm New Password Field - WITH ERROR */}
        <div>
          <label className="block text-14 font-normal text-gray-900 mb-2">
            Confirm New Password
          </label>
          <Input
            type="password"
            placeholder="Confirm New Password"
            prefixIcon={Lock}
            variant="error"
            suffix={<EyeOff className="h-6 w-6 text-red-500" />}
            errorMessage="Password doesn't match, please try again"
            readOnly
          />
        </div>
      </div>
    </div>
  )
}
