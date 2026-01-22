import { Button } from './Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { ArrowUpDown } from 'lucide-react'
import type { ProductSortOption } from '@/types/product'
import { useI18nTranslations } from '@/i18n/hooks'

export interface ProductSortProps {
  sortOptions: ProductSortOption[]
  currentSort: string
  onSortChange: (sortValue: string) => void
  className?: string
}

export const ProductSort = ({
  sortOptions,
  currentSort,
  onSortChange,
  className,
}: ProductSortProps) => {
  const currentOption = sortOptions.find(opt => opt.value === currentSort)
  const tC = useI18nTranslations('common')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`gap-2 ${className || ''}`}>
          <ArrowUpDown className="h-4 w-4" />
          <span className="text-14">
            {tC('sort')} {currentOption ? tC(`productSortOptions.${currentOption.value}`) : tC('productSortOptions.default')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sortOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={currentSort === option.value ? 'bg-brand-50' : ''}
          >
            {tC(`productSortOptions.${option.value}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
