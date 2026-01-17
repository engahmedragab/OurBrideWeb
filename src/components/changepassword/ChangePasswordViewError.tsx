'use client'

import { Lock, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { useI18nTranslations } from '@/i18n'

/**
 * Change Password View with Error States - Pure UI Only (No Logic)
 * Static error variant for visual verification
 */
export function ChangePasswordViewError() {
  const t = useI18nTranslations('changePassword')
  return (
    <div className="max-w-2xl">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-normal text-gray-900">{t('changePassword')}</h1>
        <button
          type="button"
          className="text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
        >
          {t('saveChanges')}
        </button>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Current Password Field - WITH ERROR */}
        <div className="mb-6">
          <label className="block text-14 font-normal text-gray-900 mb-2">
            {t('currentPassword')}
          </label>
          <Input
            type="password"
            placeholder={t('enterPassword')}
            prefixIcon={Lock}
            variant="error"
            suffix={<EyeOff className="h-6 w-6 text-red-500" />}
            errorMessage={t('passwordIncorrect')}
            readOnly
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="text-14 font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              {t('forgetPassword')}
            </button>
          </div>
        </div>

        {/* New Password Field - NO ERROR */}
        <div className="mb-6">
          <label className="block text-14 font-normal text-gray-900 mb-2">
            {t('newPassword')}
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
            {t('confirmNewPassword')}
          </label>
          <Input
            type="password"
            placeholder={t('confirmNewPassword')}
            prefixIcon={Lock}
            variant="error"
            suffix={<EyeOff className="h-6 w-6 text-red-500" />}
            errorMessage={t('passwordDoesNotMatch')}
            readOnly
          />
        </div>
      </div>
    </div>
  )
}
