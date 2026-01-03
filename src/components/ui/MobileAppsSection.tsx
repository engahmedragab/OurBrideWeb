'use client'

import React from 'react'
import Image from 'next/image'
import { StoreBadges } from './StoreBadges'
import { QRCode } from './QRCode'
import { cn } from '@/lib/utils'

export interface MobileAppCardProps {
  title: string
  description: string
  gradientFrom: string
  gradientTo: string
  appStoreUrl?: string
  playStoreUrl?: string
  qrCodeValue: string
  mockupImage?: string | React.ReactNode
  className?: string
}

const MobileAppCard = ({
  title,
  description,
  gradientFrom,
  gradientTo,
  appStoreUrl,
  playStoreUrl,
  qrCodeValue,
  mockupImage,
  className,
}: MobileAppCardProps) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 md:p-8 lg:p-10 overflow-hidden',
        `bg-gradient-to-br ${gradientFrom} ${gradientTo}`,
        className
      )}
    >
      {/* Available on */}
      <div className="mb-4">
        <p className="text-14 text-gray-700 mb-3 font-medium">Available on</p>
        <div className="flex items-center gap-2">
          <StoreBadges size="sm" appStoreUrl={appStoreUrl} playStoreUrl={playStoreUrl} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-24 md:text-32 lg:text-40 font-bold text-gray-900 mb-4 leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-16 md:text-18 text-gray-700 mb-8 leading-relaxed">
        {description}
      </p>

      {/* Content Layout: QR Code and Mockup Side by Side */}
      <div className="flex flex-row items-end gap-4 lg:gap-6">
        {/* QR Code */}
        <div className="flex-shrink-0">
          <QRCode
            value={qrCodeValue}
            size={140}
            className="bg-white p-3 rounded-xl shadow-lg"
          />
        </div>

        {/* Mobile App Mockup */}
        {mockupImage && (
          <div className="relative flex-1 max-w-[280px] lg:max-w-[320px]">
            {typeof mockupImage === 'string' ? (
              <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src={mockupImage}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                {mockupImage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export interface MobileAppsSectionProps {
  className?: string
  customerAppStoreUrl?: string
  customerPlayStoreUrl?: string
  professionalAppStoreUrl?: string
  professionalPlayStoreUrl?: string
  customerQRCodeValue?: string
  professionalQRCodeValue?: string
  customerMockupImage?: string | React.ReactNode
  professionalMockupImage?: string | React.ReactNode
}

/**
 * MobileAppsSection Component
 * Displays two mobile app download sections side by side: one for customers and one for professionals
 */
export const MobileAppsSection = ({
  className,
  customerAppStoreUrl,
  customerPlayStoreUrl,
  professionalAppStoreUrl,
  professionalPlayStoreUrl,
  customerQRCodeValue = 'https://ourbride.app/download/customer',
  professionalQRCodeValue = 'https://ourbride.app/download/professional',
  customerMockupImage,
  professionalMockupImage,
}: MobileAppsSectionProps) => {
  return (
    <section className={cn('py-12 sm:py-16 md:py-20 bg-white', className)}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-32 sm:text-40 md:text-48 font-bold text-gray-900 mb-4">
            Download our mobile apps
          </h2>
          <p className="text-16 sm:text-18 md:text-20 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Book unforgettable beauty and wellness experiences with our mobile app, or run your business with our powerful, award-winning iOS and Android booking platform.
          </p>
        </div>

        {/* Two App Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Customer App Card */}
          <MobileAppCard
            title="Booking app for customers"
            description="Book unforgettable beauty and wellness experiences with the OurBride mobile app - the best way to discover top-rated salons and spas."
            gradientFrom="from-purple-400"
            gradientTo="to-blue-500"
            appStoreUrl={customerAppStoreUrl}
            playStoreUrl={customerPlayStoreUrl}
            qrCodeValue={customerQRCodeValue}
            mockupImage={customerMockupImage}
          />

          {/* Professional App Card */}
          <MobileAppCard
            title="Booking app for professionals"
            description="Get started with the OurBride for professionals and never miss an opportunity to connect with customers and build your business."
            gradientFrom="from-green-400"
            gradientTo="to-yellow-400"
            appStoreUrl={professionalAppStoreUrl}
            playStoreUrl={professionalPlayStoreUrl}
            qrCodeValue={professionalQRCodeValue}
            mockupImage={professionalMockupImage}
          />
        </div>
      </div>
    </section>
  )
}

