'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui'
import { useI18nTranslations } from '@/i18n'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Package,
  Heart,
  ShoppingBag,
  Gift,
  Bell,
  Wallet,
  BookOpen,
  CheckCircle2,
  Clock,
} from 'lucide-react'

interface ProfilePageContentProps {
  mineInfo: any
}

/**
 * Profile Page Content Component
 * Displays user profile information from mine-info endpoint
 */
export function ProfilePageContent({ mineInfo }: ProfilePageContentProps) {
  const t = useI18nTranslations('profile')
  const router = useRouter()

  // Extract data from the API response structure
  const data = mineInfo?.data || mineInfo || {}
  const userProfile = data.userProfile || {}
  const user = userProfile.user || {}

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.userName || user.email || 'User'

  const profileImage = user.profileUrl || 'https://via.placeholder.com/200'
  const email = user.email || ''
  const phone = user.phoneNumber || ''
  const birthDate = user.birthDate || ''
  const profileType = userProfile.profileType || ''
  const gender = user.gender || ''
  const status = user.status || ''
  const type = user.type || ''

  // Extract statistics
  const itemBook = data.itemBook || {}
  const serviceBook = data.serviceBook || {}
  const todoBook = data.todoBook || {}
  const couponsCount = data.couponsCount || 0
  const pointsCount = data.pointsCount || 0
  const walletAmount = data.wallatAmount || 0
  const giftsCardsCount = data.giftsCardsCount || 0
  const notificationsCount = data.notificationsCount || 0
  const notificationsUnReadCount = data.notificationsUnReadCount || 0

  return (
    <div className="flex flex-col space-y-6">
      {/* Profile Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Profile Picture */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
            <Image
              src={profileImage}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="rounded-full object-cover border-2 border-gray-200"
            />
          </div>

          {/* Name and Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-20 sm:text-24 font-normal text-gray-900">
                {displayName}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                className="text-14 font-normal text-brand-500 hover:text-brand-600 hover:bg-transparent p-0 h-auto"
                onClick={() => router.push('/profile/edit')}
              >
                <Edit className="h-4 w-4 mr-1" />
                {t('header.edit')}
              </Button>
            </div>

            {/* User Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {profileType && (
                <div className="flex items-center gap-2 text-14 font-normal text-gray-700">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{profileType}</span>
                </div>
              )}
              {notificationsUnReadCount > 0 && (
                <div className="flex items-center gap-2 text-14 font-normal text-gray-700">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <span>{t('stats.unread', { count: notificationsUnReadCount })}</span>
                </div>
              )}
              {pointsCount > 0 && (
                <div className="flex items-center gap-2 text-14 font-normal text-gray-700">
                  <Gift className="h-4 w-4 text-gray-400" />
                  <span>{t('stats.points', { count: pointsCount })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <h2 className="text-18 sm:text-20 font-normal text-gray-900 mb-4">
          {t('personalInfo.title')}
        </h2>
        <div className="space-y-4">
          {email && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-12 text-gray-500 mb-1">{t('personalInfo.email')}</p>
                <p className="text-14 sm:text-16 font-normal text-gray-900 break-all">
                  {email}
                </p>
              </div>
            </div>
          )}

          {phone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-12 text-gray-500 mb-1">{t('personalInfo.phone')}</p>
                <p className="text-14 sm:text-16 font-normal text-gray-900">
                  {phone}
                </p>
              </div>
            </div>
          )}

          {profileType && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-12 text-gray-500 mb-1">{t('personalInfo.profileType')}</p>
                <p className="text-14 sm:text-16 font-normal text-gray-900">
                  {profileType}
                </p>
              </div>
            </div>
          )}

          {type && type !== 'Guest' && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-12 text-gray-500 mb-1">{t('personalInfo.accountType')}</p>
                <p className="text-14 sm:text-16 font-normal text-gray-900">
                  {type}
                </p>
              </div>
            </div>
          )}

          {gender && gender !== 'Unknown' && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-12 text-gray-500 mb-1">{t('personalInfo.gender')}</p>
                <p className="text-14 sm:text-16 font-normal text-gray-900">
                  {gender}
                </p>
              </div>
            </div>
          )}

          {birthDate && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-12 text-gray-500 mb-1">{t('personalInfo.dateOfBirth')}</p>
                <p className="text-14 sm:text-16 font-normal text-gray-900">
                  {new Date(birthDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {user.userName && user.userName !== user.email && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-12 text-gray-500 mb-1">{t('personalInfo.username')}</p>
                <p className="text-14 sm:text-16 font-normal text-gray-900">
                  {user.userName}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <h2 className="text-18 sm:text-20 font-normal text-gray-900 mb-4">
          {t('statistics.title')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Item Book */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-brand-500" />
              <p className="text-12 text-gray-500">{t('statistics.items')}</p>
            </div>
            <p className="text-18 font-normal text-gray-900">{itemBook.count || 0}</p>
            <p className="text-12 text-gray-500 mt-1">
              {t('statistics.completed', { count: itemBook.completed || 0 })}
            </p>
          </div>

          {/* Service Book */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="h-5 w-5 text-brand-500" />
              <p className="text-12 text-gray-500">{t('statistics.services')}</p>
            </div>
            <p className="text-18 font-normal text-gray-900">{serviceBook.count || 0}</p>
            <p className="text-12 text-gray-500 mt-1">
              {t('statistics.completed', { count: serviceBook.completed || 0 })}
            </p>
          </div>

          {/* Todo Book */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-brand-500" />
              <p className="text-12 text-gray-500">{t('statistics.todos')}</p>
            </div>
            <p className="text-18 font-normal text-gray-900">{todoBook.count || 0}</p>
            <p className="text-12 text-gray-500 mt-1">
              {t('statistics.completed', { count: todoBook.completed || 0 })}
            </p>
          </div>

          {/* Coupons */}
          {couponsCount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-brand-500" />
                <p className="text-12 text-gray-500">{t('statistics.coupons')}</p>
              </div>
              <p className="text-18 font-normal text-gray-900">{couponsCount}</p>
            </div>
          )}

          {/* Points */}
          {pointsCount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-brand-500" />
                <p className="text-12 text-gray-500">{t('statistics.points')}</p>
              </div>
              <p className="text-18 font-normal text-gray-900">{pointsCount}</p>
            </div>
          )}

          {/* Wallet */}
          {walletAmount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-brand-500" />
                <p className="text-12 text-gray-500">{t('statistics.wallet')}</p>
              </div>
              <p className="text-18 font-normal text-gray-900">
                {walletAmount.toLocaleString()}
              </p>
            </div>
          )}

          {/* Gift Cards */}
          {giftsCardsCount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-brand-500" />
                <p className="text-12 text-gray-500">{t('statistics.giftCards')}</p>
              </div>
              <p className="text-18 font-normal text-gray-900">{giftsCardsCount}</p>
            </div>
          )}

          {/* Notifications */}
          {notificationsCount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-5 w-5 text-brand-500" />
                <p className="text-12 text-gray-500">{t('statistics.notifications')}</p>
              </div>
              <p className="text-18 font-normal text-gray-900">{notificationsCount}</p>
              {notificationsUnReadCount > 0 && (
                <p className="text-12 text-brand-500 mt-1">
                  {t('statistics.unread', { count: notificationsUnReadCount })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Partner Information - if available */}
      {userProfile.partner && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <h2 className="text-18 sm:text-20 font-normal text-gray-900 mb-4">
            {t('partner.title')}
          </h2>
          <div className="space-y-4">
            {userProfile.partner.name && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-12 text-gray-500 mb-1">{t('partner.name')}</p>
                  <p className="text-14 sm:text-16 font-normal text-gray-900">
                    {userProfile.partner.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

