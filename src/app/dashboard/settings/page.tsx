'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Toggle,
  DeleteAccountModal,
  LogoutModal,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui'
import { ChevronRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'

/**
 * Settings page component
 */
export default function SettingsPage() {
  const router = useRouter()
  const [appLanguage, setAppLanguage] = useState('English')
  const [darkMode, setDarkMode] = useState(false)
  const [bookingConfirmations, setBookingConfirmations] = useState(true)
  const [offerAlerts, setOfferAlerts] = useState(true)
  const [communityUpdates, setCommunityUpdates] = useState(true)
  const [messages, setMessages] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const languages = ['English', 'Arabic', 'French', 'Spanish']

  const handleDeleteAccount = () => {
    // TODO: Implement delete account logic
    console.log('Delete account')
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
      <div className="max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-gray-900">Settings</h1>
        </div>

        {/* App Preferences Section */}
        <SettingsSection title="App Preferences">
          <SettingRow
            label="App Language"
            action={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-14 font-medium text-brand-500 hover:text-brand-600">
                    {appLanguage}
                    <ChevronDown className="h-4 w-4 text-brand-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {languages.map(lang => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => setAppLanguage(lang)}
                      className={appLanguage === lang ? 'bg-brand-50' : ''}
                    >
                      {lang}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />
          <SettingRow
            label="Dark Mode"
            action={
              <Toggle
                checked={darkMode}
                onChange={setDarkMode}
                variant="brand"
              />
            }
          />
        </SettingsSection>

        {/* Security & Privacy Section */}
        <SettingsSection title="Security & Privacy">
          <SettingRow
            label="Password"
            action={
              <Link
                href="/reset-password"
                className="flex items-center gap-1 text-14 font-medium text-brand-500 hover:text-brand-600"
              >
                Change Password
                <ChevronRight className="h-4 w-4 text-brand-500" />
              </Link>
            }
          />
          <SettingRow
            label="Blocked Users"
            action={
              <button
                onClick={() => {
                  // TODO: Implement view blocked users
                  console.log('View blocked users')
                }}
                className="flex items-center gap-1 text-14 font-medium text-brand-500 hover:text-brand-600"
              >
                View All
                <ChevronRight className="h-4 w-4 text-brand-500" />
              </button>
            }
          />
        </SettingsSection>

        {/* Notifications Management Section */}
        <SettingsSection title="Notifications Management">
          <SettingRow
            label="Booking Confirmations & Updates"
            action={
              <Toggle
                checked={bookingConfirmations}
                onChange={setBookingConfirmations}
                variant="brand"
              />
            }
          />
          <SettingRow
            label="Offer Alerts"
            action={
              <Toggle
                checked={offerAlerts}
                onChange={setOfferAlerts}
                variant="brand"
              />
            }
          />
          <SettingRow
            label="Community Updates"
            action={
              <Toggle
                checked={communityUpdates}
                onChange={setCommunityUpdates}
                variant="brand"
              />
            }
          />
          <SettingRow
            label="Messages"
            action={
              <Toggle
                checked={messages}
                onChange={setMessages}
                variant="brand"
              />
            }
          />
          <SettingRow
            label="E-mail Notifications"
            action={
              <Toggle
                checked={emailNotifications}
                onChange={setEmailNotifications}
                variant="brand"
              />
            }
          />
        </SettingsSection>

        {/* Orders & Payments Section */}
        <SettingsSection title="Orders & Payments">
          <SettingRow
            label="Orders List"
            action={
              <Link
                href="/orders"
                className="flex items-center gap-1 text-14 font-medium text-gray-900 hover:text-gray-700"
              >
                <ChevronRight className="h-4 w-4 text-gray-900" />
              </Link>
            }
          />
          <SettingRow
            label="Payment History"
            action={
              <button
                onClick={() => {
                  // TODO: Implement payment history
                  console.log('Payment history')
                }}
                className="flex items-center gap-1 text-14 font-medium text-gray-900 hover:text-gray-700"
              >
                <ChevronRight className="h-4 w-4 text-gray-900" />
              </button>
            }
          />
        </SettingsSection>

        {/* Legal Section */}
        <SettingsSection title="Legal">
          <SettingRow
            label="Terms & Conditions"
            action={
              <Link
                href="/dashboard/settings/terms"
                className="flex items-center gap-1 text-14 font-medium text-gray-900 hover:text-gray-700"
              >
                <ChevronRight className="h-4 w-4 text-gray-900" />
              </Link>
            }
          />
          <SettingRow
            label="Privacy Policy"
            action={
              <Link
                href="/dashboard/settings/privacy"
                className="flex items-center gap-1 text-14 font-medium text-gray-900 hover:text-gray-700"
              >
                <ChevronRight className="h-4 w-4 text-gray-900" />
              </Link>
            }
          />
          <SettingRow
            label="Community Guidelines"
            action={
              <Link
                href="/dashboard/settings/community"
                className="flex items-center gap-1 text-14 font-medium text-gray-900 hover:text-gray-700"
              >
                <ChevronRight className="h-4 w-4 text-gray-900" />
              </Link>
            }
          />
        </SettingsSection>

        {/* Account Actions Section (no title) */}
        <div className="bg-white rounded-xl  shadow-sm border border-gray-100 mb-6">
          <div className="px-6">
            <SettingRow
              label={<span className="text-brand-500">Logout</span>}
              action={
                <button
                  onClick={() => setLogoutModalOpen(true)}
                  className="flex items-center gap-1 text-14 font-medium text-brand-500 hover:text-brand-600"
                >
                  <ChevronRight className="h-4 w-4 text-gray-900" />
                </button>
              }
            />
            <SettingRow
              label="Delete Account"
              action={
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="flex items-center gap-1 text-14 font-medium text-gray-600 hover:text-gray-700"
                >
                  <ChevronRight className="h-4 w-4 text-gray-900" />
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

