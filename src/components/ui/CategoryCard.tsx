'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface CategoryCardProps {
  id: string
  title: string
  description: string
  href: string
  icon?: string | ReactNode
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
          'bg-white border border-gray-100 rounded-xl flex flex-col gap-4 items-center justify-center px-[38px] py-[123px] h-[468px] hover:shadow-lg transition-all duration-300',
          className
        )}
      >
        {icon && (
          <div className="relative w-[120px] h-[120px] flex-shrink-0">
            {typeof icon === 'string' ? (
              <Image
                src={icon}
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
          <h3 className="text-24 font-normal text-gray-900 leading-[32px]">
            {title}
          </h3>
          <p className="text-24 font-normal text-gray-500 leading-[32px] max-w-[304px]">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}


