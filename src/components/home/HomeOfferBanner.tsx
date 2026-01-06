'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

type OfferVariant = 'default' | 'newsletter'

export type HomeOfferBannerItem = {
  heading: string
  description?: string
  ctaText?: string
  ctaLink?: string
  productImage?: StaticImageData | string | null
  variant?: OfferVariant
}

export type HomeOfferBannerProps = {
  offers: HomeOfferBannerItem[]
  autoPlayInterval?: number
  onSubscribe?: (email: string) => void
  className?: string
}

export function HomeOfferBanner({
  offers,
  autoPlayInterval = 5000,
  onSubscribe,
  className = '',
}: HomeOfferBannerProps) {
  const [email, setEmail] = useState('')
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [activeDash, setActiveDash] = useState(0)

  if (!offers?.length) return null

  // ✅ لو بانر واحد من الباك: هنكرر السلايد عشان autoplay + loop يشتغلوا
  const slides = useMemo(() => {
    if (offers.length === 1) return [offers[0], offers[0], offers[0]]
    return offers
  }, [offers])

  // ✅ عدد الشرطات اللي هتظهر تحت
  // لو بانر واحد: نخليهم 3 زي الصورة
  const dashCount = offers.length > 1 ? offers.length : 3

  const handleSubscribe = () => {
    if (!onSubscribe) return
    const trimmed = email.trim()
    if (!trimmed) return
    onSubscribe(trimmed)
    setEmail('')
  }

  return (
    <section className={className}>
      <div className="container-custom">
        {/* البانر */}
        <div className="">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop={slides.length > 1}
            autoplay={
              slides.length > 1
                ? { delay: autoPlayInterval, disableOnInteraction: false }
                : false
            }
            onSwiper={setSwiper}
            onSlideChange={s => {
              // realIndex بيحسب السلايد الحقيقي (مهم مع loop)
              setActiveDash(s.realIndex % dashCount)
            }}
          >
            {slides.map((offer, idx) => {
              const hasImage = !!offer.productImage

              return (
                <SwiperSlide key={`${offer.heading}-${idx}`}>
                  <div className=" grid grid-cols-1 gap-6 lg:gap-8 px-4">
                    <div className="border border-brand-500 rounded-2xl overflow-hidden bg-white px-4 md:px-5 py-3 md:py-4">
                      {/* Text */}
                      <div
                        className={[
                          'flex flex-col justify-center',
                          hasImage ? 'text-center lg:text-left' : 'text-center',
                        ].join(' ')}
                      >
                        <h2 className="text-[18px] md:text-[20px] font-medium text-gray-900 mb-2">
                          {offer.heading}
                        </h2>

                        {offer.description ? (
                          <p className={['flex text-[13px] md:text-[14px] text-gray-500 mb-4', hasImage ? 'justify-center  lg:justify-start' : 'justify-center '].join(' ')}>
                            {offer.description}
                          </p>
                        ) : null}

                        <div
                          className={[
                            'flex',
                            hasImage
                              ? 'justify-center lg:justify-start'
                              : 'justify-center',
                          ].join(' ')}
                        >
                          <Link
                            href={offer.ctaLink ?? '/products'}
                            className="inline-flex items-center gap-2 h-10 px-6 rounded-full border border-brand-500 text-brand-500 bg-white hover:bg-gray-50 text-[13px] font-semibold"
                          >
                            {offer.ctaText ?? 'Start Shopping'}
                            <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </div>

                      {/* Image Right */}
                      {hasImage ? (
                        <div className="flex justify-end items-end overflow-hidden">
                          <Image
                            src={offer.productImage as string}
                            alt=""
                            width={320}
                            height={240}
                            priority={idx === 0}
                            className="w-auto h-[140px] md:h-[170px] lg:h-[200px] xl:h-[230px] object-contain object-bottom"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

        {/* ✅ الشرطات تحت البانر (زي الصورة) */}
        <div className="mt-4 flex justify-center items-center gap-2">
          {Array.from({ length: dashCount }).map((_, i) => {
            const isActive = i === activeDash
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  if (!swiper) return
                  // نودي للسلايد المقابل (مع loop)
                  swiper.slideToLoop(i)
                }}
                className={[
                  'h-1.5 rounded-full transition-all duration-300',
                  isActive ? 'w-12 bg-brand-500' : 'w-4 bg-gray-300',
                ].join(' ')}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
