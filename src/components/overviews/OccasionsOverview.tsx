'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { Calendar, Star, ChevronRight } from 'lucide-react'
import { MainOccasionBookResponse } from '@/types/responses'
import flowerImg from '@/assets/images/flowers.png'

export interface OccasionsOverviewProps {
  book?: MainOccasionBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

const OccasionAvatar = ({ title }: { title: string }) => {
  const imageSrc = typeof flowerImg === 'string' ? flowerImg : flowerImg.src
  return (
    <div className="w-11 h-11 overflow-hidden bg-gray-100 shrink-0 rounded-full">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}

export const OccasionsOverview = ({
  book,
  onInit,
  onNavigate,
}: OccasionsOverviewProps) => {
  const needsInit = !!book && !book.isBookInit

  const activeOccasions = useMemo(() => {
    const occasions = (book?.occasions || book?.lines || []) as any[]
    return occasions.filter(o => !o?.isDeleted)
  }, [book?.occasions, book?.lines])

  const sortedOccasions = useMemo(() => {
    return [...activeOccasions].sort((a, b) => {
      const dateA = new Date(a?.date).getTime()
      const dateB = new Date(b?.date).getTime()
      return dateA - dateB
    })
  }, [activeOccasions])

  const displayOccasions = useMemo(
    () => sortedOccasions.slice(0, 3),
    [sortedOccasions]
  )

  const count = activeOccasions.length

  const handleClickAll = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (needsInit && onInit) await onInit()
    onNavigate?.()
  }

  if (!book) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-14 font-semibold text-gray-900">Occasions</h2>

        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClickAll}
          type="button"
        >
          View All
        </button>
      </div>

      {/* List */}
      <div className="px-2 pb-2">
        {displayOccasions.length > 0 ? (
          <div className="divide-y divide-gray-100 rounded-lg">
            {displayOccasions.map((occasion: any) => {
              const title =
                occasion?.titleEn || occasion?.titleAr || 'Untitled Occasion'
              const provider =
                occasion?.providerName ||
                occasion?.subTitleEn ||
                occasion?.subTitleAr ||
                ''
              const date = occasion?.date

              return (
                <button
                  key={occasion?.id}
                  type="button"
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                  onClick={handleClickAll}
                >
                  <OccasionAvatar title={title} />

                  <div className="min-w-0 flex-1">
                    {/* Title + favorite */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-13 font-semibold text-gray-900 truncate">
                        {title}
                      </p>

                      {occasion?.isFavorite ? (
                        <Star
                          className="w-4 h-4 text-brand-500 shrink-0"
                          fill="currentColor"
                        />
                      ) : null}
                    </div>

                    {/* Provider line */}
                    {provider ? (
                      <p className="text-12 text-gray-600 truncate mt-0.5">
                        <span className="text-gray-500">Provider: </span>
                        <span className="text-gray-700">{provider}</span>
                      </p>
                    ) : null}

                    {/* Date line */}
                    {date && date !== '0001-01-01T00:00:00' ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-12 text-gray-500">
                          {format(new Date(date), 'd MMM, dd MMMM')}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-13 text-gray-500 text-center py-6">
            No bookings yet
          </p>
        )}
      </div>
    </div>
  )
}
