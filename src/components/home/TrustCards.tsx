'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'

import { Card } from '@/components/ui/Card' // عدّلي المسار حسب مشروعك

type TrustCardBackground = 'white' | 'gray'

type TrustCardItem = {
  readonly id: string
  readonly heading: string
  readonly description: string
  readonly rotation?: number
  readonly background: TrustCardBackground
}

type TrustCardsProps = {
  cards: readonly TrustCardItem[]
  positionClasses?: readonly string[]
  className?: string
}

function getBgClass(bg: TrustCardBackground): string {
  return bg === 'gray' ? 'bg-gray-50' : 'bg-white'
}

function getDesktopCenterClass(index: number): string {
  // index صفر-based
  if (index === 4) return 'lg:col-start-2'
  if (index === 5) return 'lg:col-start-3'
  return ''
}

export default function TrustCards({
  cards,
  positionClasses = [],
  className = '',
}: TrustCardsProps) {
  if (!cards.length) return null

  return (
    <div className={className}>
      {/* ================= Mobile / Tablet (Slider) ================= */}
      <div className="block lg:hidden">
        <Swiper
          modules={[FreeMode]}
          freeMode
          grabCursor
          slidesPerView={1.1}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.1 },
          }}
        >
          {cards.map(card => (
            <SwiperSlide key={card.id} className="h-auto">
              <Card
                cardData={{
                  type: 'trust',
                  heading: card.heading,
                  description: card.description,

                  background: card.background,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ================= Desktop (Grid) ================= */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(4,1fr)] items-center justify-center gap-6 md:gap-5 relative">
          {cards.map((card, index) => {
            const positionClass = positionClasses[index] ?? ''
            const centerClass = getDesktopCenterClass(index)

            return (
              <div
                key={card.id}
                className={[
                  'relative flex items-center justify-center',
                  positionClass,
                  centerClass,
                ].join(' ')}
              >
                <Card
                  cardData={{
                    type: 'trust',
                    heading: card.heading,
                    description: card.description,
                    rotation: card.rotation,
                    background: card.background,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
