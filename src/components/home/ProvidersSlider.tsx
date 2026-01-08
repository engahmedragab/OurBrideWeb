"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

import { Card, ProviderCardSkeleton } from "@/components/ui"
import type {  ProviderCardData } from "@/components/ui"
import { memo } from "react"
import {  useProviderCardHandlers } from "@/hooks"

interface ProvidersSliderSectionProps {
  providers: ProviderCardData[]
  isLoading: boolean
}

// Memoized Provider Card Component
const ProviderCardItem = memo(
    ({ provider }: { provider: ProviderCardData }) => {
      const handlers = useProviderCardHandlers(parseInt(provider.id, 10))
      return (
        <Card
          cardData={{
            type: 'provider',
            ...provider,
            onFollowToggle: handlers.handleFollowToggle,
            onFavoriteToggle: handlers.handleFavoriteToggle,
            isLoadingFollow: handlers.isLoadingFollow,
            isLoadingFavorite: handlers.isLoadingFavorite,
          }}
        />
      )
    }
  )
  ProviderCardItem.displayName = 'ProviderCardItem'

export default function ProvidersSliderSection({
  providers,
  isLoading,
}: ProvidersSliderSectionProps) {
  return (
    <section className="container-custom py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-28  lg:text-5xl font-black mb-4 md:mb-6">
          <span className="font-normal text-gray-900">
            Discover <span className="font-semibold text-gray-900">Trusted</span>
          </span>
          <br />
          <span className="font-semibold text-gray-900">
            Wedding <span className="font-normal text-gray-900">Providers</span>
          </span>
        </h2>
      </div>

      {isLoading ? (
        <ProviderCardSkeleton count={4} />
      ) : (
        <div className="w-full">
          <Swiper
            className="w-full"
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },  // small screens
              1024: { slidesPerView: 4 }, // large screens
            }}
          >
            {providers.map((provider) => (
              <SwiperSlide key={provider.id} className="h-auto">
                <ProviderCardItem provider={provider} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  )
}
