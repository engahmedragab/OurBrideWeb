'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  maxVisiblePages?: number
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxVisiblePages = 5,
}: PaginationProps) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      let startPage = Math.max(2, currentPage - halfVisible)
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible)

      // Adjust if we're near the start
      if (currentPage <= halfVisible + 1) {
        endPage = Math.min(totalPages - 1, maxVisiblePages)
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - halfVisible) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 1)
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('ellipsis-start')
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number, e: React.MouseEvent) => {
    e.preventDefault()
    onPageChange(page)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 relative z-10 pointer-events-auto',
        className
      )}
    >
      {/* Previous Button */}
      <Button
        variant="default"
        size="icon"
        className="h-10 w-10 rounded-lg bg-brand-500 hover:bg-brand-600 text-white border-0 relative z-10"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
        type="button"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 relative z-10">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <button
                key={`ellipsis-${index}`}
                className="h-10 min-w-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 flex items-center justify-center relative z-10"
                disabled
                aria-label="More pages"
                type="button"
              >
                ...
              </button>
            )
          }

          const pageNumber = page as number
          const isActive = pageNumber === currentPage

          return (
            <Button
              key={pageNumber}
              variant="outline"
              className={cn(
                'h-10 min-w-10 rounded-lg bg-white text-gray-900 relative z-10',
                isActive
                  ? 'border-brand-500 hover:border-brand-600'
                  : 'border-gray-300 hover:border-gray-400'
              )}
              onClick={e => handlePageClick(pageNumber, e)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
              type="button"
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="default"
        size="icon"
        className="h-10 w-10 rounded-lg bg-brand-500 hover:bg-brand-600 text-white border-0 relative z-10"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        type="button"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
