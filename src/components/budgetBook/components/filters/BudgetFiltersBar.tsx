'use client'

import { SelectMenu } from '@/components/ui/SelectMenu'
import { useI18nTranslations } from '@/i18n/hooks'

export type FilterType =
  | 'all'
  | 'done'
  | 'not-done'
  | 'favorite'
  | 'not-favorite'
  

interface BudgetFiltersBarProps {
  filterType: FilterType
  onFilterChange: (filter: FilterType) => void
}

export const BudgetFiltersBar = ({
  filterType,
  onFilterChange,
}: BudgetFiltersBarProps) => {
  
  const t = useI18nTranslations('eventsPlanning.budget')
  return (
    <SelectMenu
      value={filterType}
      onChange={value => onFilterChange(value as FilterType)}
      options={[
        { label: t('filters.all'), value: 'all' },
        { label: t('filters.done'), value: 'done' },
        { label: t('filters.notDone'), value: 'not-done' }, 
        { label: t('filters.favorite'), value: 'favorite' },
        { label: t('filters.notFavorite'), value: 'not-favorite' },
      
      ]}
      placeholder={t('filters.placeholder')}
      size="lg"
      className="w-full sm:w-auto sm:min-w-[180px]"
    />
  )
}

