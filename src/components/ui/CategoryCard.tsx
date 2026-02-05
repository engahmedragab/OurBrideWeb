'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'

export interface CategoryCardProps {
  id: string
  title: string
  description: string
  href: string
  icon?: string | StaticImageData | ReactNode
  className?: string
}

/**
 * CategoryCard Component
 * Reusable card component for displaying categories
 * Can be used for Products, Services, or any category listing
 */
export const CategoryCard = ({
  title,
  description,
  href,
  icon,
  className,
}: CategoryCardProps) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          'bg-white border border-gray-200/70 rounded-xl flex flex-col gap-2 md:gap-3 items-center justify-center px-4 md:px-6 py-5 md:py-8 h-[220px] md:h-[280px] hover:shadow-lg transition-all duration-300',
          className
        )}
      >
        {icon && (
          <div className="relative w-[64px] h-[64px] md:w-[80px] md:h-[80px] flex-shrink-0">
            {typeof icon === 'string' || (icon && typeof icon === 'object' && 'src' in icon) ? (
              <Image
                src={typeof icon === 'string' ? icon : icon.src}
                alt={title}
                fill
                className="object-contain"
              />
            ) : (
              icon
            )}
          </div>
        )}
        <div className="flex flex-col gap-2 items-center text-center">
          <h3 className="text-[13px] md:text-18 font-semibold text-gray-900 leading-[20px] md:leading-[24px]">
            {title}
          </h3>
          <p className="text-[11px] md:text-14 font-normal text-gray-400 leading-[18px] md:leading-[20px] max-w-[200px]">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}


