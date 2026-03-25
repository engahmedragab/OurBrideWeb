'use client'

import { useState, useMemo } from 'react'
import { Check, Palette } from 'lucide-react'
import { templateRegistry, templateComponents, getCategoryLabel } from './templates'
import type { TemplateInfo } from './templates'

interface TemplateBrowserProps {
  selectedId?: number | null
  onSelect: (id: number) => void
  compact?: boolean
}

const categories: TemplateInfo['category'][] = ['classic', 'modern', 'floral', 'luxury', 'minimalist', 'cultural', 'playful']

const categoryColors: Record<string, string> = {
  classic: 'bg-amber-50 text-amber-700 border-amber-200',
  modern: 'bg-purple-50 text-purple-700 border-purple-200',
  floral: 'bg-pink-50 text-pink-700 border-pink-200',
  luxury: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  minimalist: 'bg-gray-50 text-gray-700 border-gray-200',
  cultural: 'bg-teal-50 text-teal-700 border-teal-200',
  playful: 'bg-orange-50 text-orange-700 border-orange-200',
}

const previewProps = {
  brideName: 'Sarah',
  groomName: 'Ahmed',
  guestName: 'Guest Name',
  weddingDate: '2026-06-15T18:00:00',
  weddinghole: 'Grand Ballroom',
  weddingAddress: 'Cairo, Egypt',
  preview: true,
}

export function TemplateBrowser({ selectedId, onSelect, compact = false }: TemplateBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateInfo['category'] | 'all'>('all')

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return templateRegistry
    return templateRegistry.filter((t) => t.category === activeCategory)
  }, [activeCategory])

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full text-12 font-medium border transition-colors ${
            activeCategory === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          All ({templateRegistry.length})
        </button>
        {categories.map((cat) => {
          const count = templateRegistry.filter((t) => t.category === cat).length
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-12 font-medium border transition-colors ${
                activeCategory === cat
                  ? categoryColors[cat] || 'bg-gray-100 text-gray-700 border-gray-300'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {getCategoryLabel(cat)} ({count})
            </button>
          )
        })}
      </div>

      {/* Template Grid */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
        {filtered.map((template) => {
          const Component = templateComponents[template.id]
          const isSelected = selectedId === template.id
          if (!Component) return null

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-200 shadow-lg shadow-brand-100/40'
                  : 'border-gray-200 hover:border-brand-300 hover:shadow-md'
              }`}
            >
              {/* Template Preview */}
              <div className="aspect-[3/4] overflow-hidden">
                <Component {...previewProps} />
              </div>

              {/* Selection Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-brand-500 flex items-center justify-center shadow-md">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}

              {/* Template Info Footer */}
              <div className="p-2.5 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-12 font-semibold text-gray-800 truncate">{template.name}</p>
                    <p className="text-10 text-gray-400 truncate">{template.nameAr}</p>
                  </div>
                  <div
                    className="flex-shrink-0 flex items-center gap-0.5 ml-2"
                    title={getCategoryLabel(template.category)}
                  >
                    <div className="h-3 w-3 rounded-full" style={{ background: template.colors.primary }} />
                    <div className="h-3 w-3 rounded-full" style={{ background: template.colors.secondary, border: '1px solid #e5e7eb' }} />
                    <div className="h-3 w-3 rounded-full" style={{ background: template.colors.accent }} />
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Palette className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-13 text-gray-400">No templates in this category</p>
        </div>
      )}
    </div>
  )
}
