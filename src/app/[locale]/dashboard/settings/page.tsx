'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useI18nLocale, useI18nTranslations, useIsRTL } from '@/i18n'
import {
  Toggle,
  DeleteAccountModal,
  LogoutModal,
  SelectPopover,
} from '@/components/ui'
import { ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

/**
 * Settings page component
 */
export default function SettingsPage() {
  const t = useI18nTranslations('settings')
  const isRTL = useIsRTL()
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useI18nLocale()
  
  // Map locale to language display name
  const localeToLanguage = useMemo<Record<string, string>>(() => ({
    'en': 'English',
    'ar': 'العربية',
  }), [])
  
  const languageToLocale = useMemo<Record<string, string>>(() => ({
    'English': 'en',
    'العربية': 'ar',
  }), [])

  const [appLanguage, setAppLanguage] = useState(localeToLanguage[currentLocale] || 'English')
  const [darkMode, setDarkMode] = useState(false)
  const [bookingConfirmations, setBookingConfirmations] = useState(true)
  const [offerAlerts, setOfferAlerts] = useState(true)
  const [communityUpdates, setCommunityUpdates] = useState(true)
  const [messages, setMessages] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  // Update language when locale changes
  useEffect(() => {
    setAppLanguage(localeToLanguage[currentLocale] || 'English')
  }, [currentLocale, localeToLanguage])

  const languages = [
    { value: 'English', label: 'English' },
    { value: 'العربية', label: 'العربية' },
  ]

  const handleLanguageChange = (newLanguage: string) => {
    setAppLanguage(newLanguage)
    
    // Get the locale for the selected language
    const newLocale = languageToLocale[newLanguage]
    if (newLocale && newLocale !== currentLocale) {
      // Construct the new URL with the new locale prefix
      const newPath = `/${newLocale}${pathname === '/' ? '' : pathname}`
      
      // Use window.location to navigate to the new locale path
      // This will trigger the middleware to handle locale switching and direction change
      if (typeof window !== 'undefined') {
        window.location.href = newPath
      }
    }
  }

  const handleDeleteAccount = () => {
    // TODO: Implement delete account logic
  }

  const handleLogout = () => {
    // Remove token from localStorage if exists
    localStorage.removeItem('token')
    // Navigate to login page
    router.push('/auth/login')
  }

  /**
   * Setting row component for consistent layout
   */
  const SettingRow = ({
    label,
    action,
    className,
  }: {
    label: string | React.ReactNode
    action: React.ReactNode
    className?: string
  }) => (
    <div
      className={`flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 ${className || ''}`}
    >
      <div className="flex-1">
        {typeof label === 'string' ? (
          <p className="text-14 font-normal text-gray-600">{label}</p>
        ) : (
          <div className="text-14 font-normal">{label}</div>
        )}
      </div>
      <div className="flex items-center gap-2">{action}</div>
    </div>
  )

  /**
   * Settings section component
   */
  const SettingsSection = ({
    title,
    children,
    className,
  }: {
    title: string
    children: React.ReactNode
    className?: string
  }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 mb-6 ${className || ''}`}
    >
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-16 font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6">{children}</div>
    </div>
  )

  return (
    <>
      <div className="max-w-4xl" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-gray-900">{t('title')}</h1>
        </div>

        {/* App Preferences Section */}
        <SettingsSection title={t('appPreferences.title')}>
          <SettingRow
            label={t('appPreferences.appLanguage')}
            action={
              <div className="w-[140px]">
                <SelectPopover
                  value={appLanguage}
                  onChange={handleLanguageChange}
                  options={languages}
                  placeholder={t('appPreferences.selectLanguage')}
                />
              </div>
            }
          />
          <SettingRow
            label={t('appPreferences.darkMode')}
            action={
              <Toggle
                checked={darkMode}
                onChange={setDarkMode}
              />
            }
          />
        </SettingsSection>

        {/* Security & Privacy Section */}
        <SettingsSection title={t('securityPrivacy.title')}>
          <SettingRow
            label={t('securityPrivacy.password')}
            action={
              <Link
                href="/dashboard/settings/change-password"
                className="flex items-center gap-1 text-14 font-medium text-brand-500 hover:text-brand-600"
              >
                {t('securityPrivacy.changePassword')}
                <ChevronRight className={cn("h-4 w-4 text-brand-500", isRTL && "rotate-180")} />
              </Link>
            }
          />
          <SettingRow
            label={t('securityPrivacy.blockedUsers')}
            action={
              <button
                onClick={() => {
                  // TODO: Implement view blocked users
                }}
                className="flex items-center gap-1 text-14 font-medium text-brand-500 hover:text-brand-600"
              >
                {t('securityPrivacy.viewAll')}
                <ChevronRight className={cn("h-4 w-4 text-brand-500", isRTL && "rotate-180")} />
              </button>
            }
          />
        </SettingsSection>

        {/* Notifications Management Section */}
        <SettingsSection title={t('notifications.title')}>
          <SettingRow
            label={t('notifications.bookingConfirmations')}
            action={
              <Toggle
                checked={bookingConfirmations}
                onChange={setBookingConfirmations}
              />
            }
          />
          <SettingRow
            label={t('notifications.offerAlerts')}
            action={
              <Toggle
                checked={offerAlerts}
                onChange={setOfferAlerts}
              />
            }
          />
          <SettingRow
            label={t('notifications.communityUpdates')}
            action={
              <Toggle
                checked={communityUpdates}
                onChange={setCommunityUpdates}
              />
            }
          />
          <SettingRow
            label={t('notifications.messages')}
            action={
              <Toggle
                checked={messages}
                onChange={setMessages}
              />
            }
          />
          <SettingRow
            label={t('notifications.emailNotifications')}
            action={
              <Toggle
                checked={emailNotifications}
                onChange={setEmailNotifications}
              />
            }
          />
        </SettingsSection>

        {/* Orders & Payments Section */}
        <SettingsSection title={t('ordersPayments.title')}>
          <SettingRow
            label={t('ordersPayments.ordersList')}
            action={
              <Link
                href="/orders"
                className={cn(
                  "flex items-center gap-1 text-14 font-medium text-gray-900 hover:text-gray-700",
                  isRTL && "flex-row-reverse"
                )}
              >
                <ChevronRight className={cn("h-4 w-4 text-gray-900", isRTL && "rotate-180")} />
              </Link>
            }
          />
          <SettingRow
            label={t('ordersPayments.paymentHistory')}
            action={
              <button
                onClick={() => {
                  // TODO: Implement payment history
                }}
                className={cn(
                  "flex items-center gap-1 text-14 font-medium text-gray-900 hover:text-gray-700",
                  isRTL && "flex-row-reverse"
                )}
              >
                <ChevronRight className={cn("h-4 w-4 text-gray-900", isRTL && "rotate-180")} />
              </button>
            }
          />
        </SettingsSection>

        {/* Legal Section */}
        <SettingsSection title={t('legal.title')}>
          <SettingRow
            label={t('legal.termsConditions')}
            action={
              <Link
                href="/dashboard/settings/terms"
                className={cn(
                  "flex items-center gap-1 text-14 font-medium text-gray-900 hover:text-gray-700",
                  isRTL && "flex-row-reverse"
                )}
              >
                <ChevronRight className={cn("h-4 w-4 text-gray-900", isRTL && "rotate-180")} />
              </Link>
            }
          />
          <SettingRow
            label={t('legal.privacyPolicy')}
            action={
              <Link
                href="/dashboard/settings/privacy"
                className={cn(
                  "flex items-center gap-1 text-14 font-medium text-gray-900 hover:text-gray-700",
                  isRTL && "flex-row-reverse"
                )}
              >
                <ChevronRight className={cn("h-4 w-4 text-gray-900", isRTL && "rotate-180")} />
              </Link>
            }
          />
          <SettingRow
            label={t('legal.communityGuidelines')}
            action={
              <Link
                href="/dashboard/settings/community"
                className={cn(
                  "flex items-center gap-1 text-14 font-medium text-gray-900 hover:text-gray-700",
                  isRTL && "flex-row-reverse"
                )}
              >
                <ChevronRight className={cn("h-4 w-4 text-gray-900", isRTL && "rotate-180")} />
              </Link>
            }
          />
        </SettingsSection>

        {/* Account Actions Section (no title) */}
        <div className="bg-white rounded-xl  shadow-sm border border-gray-100 mb-6">
          <div className="px-6">
            <SettingRow
              label={<span className="text-brand-500">{t('accountActions.logout')}</span>}
              action={
                <button
                  onClick={() => setLogoutModalOpen(true)}
                  className={cn(
                    "flex items-center gap-1 text-14 font-medium text-brand-500 hover:text-brand-600",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <ChevronRight className={cn("h-4 w-4 text-gray-900", isRTL && "rotate-180")} />
                </button>
              }
            />
            <SettingRow
              label={t('accountActions.deleteAccount')}
              action={
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className={cn(
                    "flex items-center gap-1 text-14 font-medium text-gray-600 hover:text-gray-700",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <ChevronRight className={cn("h-4 w-4 text-gray-900", isRTL && "rotate-180")} />
                </button>
              }
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  )
}

