/**
 * Provider Home Section Component
 * Horizontal scrolling section for provider lists
 */

import { ProviderHomeCard } from './ProviderHomeCard'
import type { ProviderHomeFeaturedProviderResponse } from '@/types/responses/provider-home-featured-provider-response'
import { cn } from '@/lib/utils'

export interface ProviderHomeSectionProps {
  title: string
  providers: ProviderHomeFeaturedProviderResponse[]
  category?: string
  className?: string
}

export const ProviderHomeSection = ({
  title,
  providers,
  category,
  className,
}: ProviderHomeSectionProps) => {
  if (!providers || providers.length === 0) {
    return null
  }

  return (
    <section className={cn('py-8 bg-white', className)}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-24 md:text-28 font-bold text-gray-900">{title}</h2>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide pb-4">
            <div className="flex gap-4">
              {providers.map((provider) => (
                <ProviderHomeCard
                  key={provider.id}
                  provider={provider}
                  category={category}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

