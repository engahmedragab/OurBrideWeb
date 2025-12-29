'use client'

import { SelectMenu } from '@/components/ui/SelectMenu'

export type FilterType =
  | 'all'
  | 'done'
  | 'not-done'
  | 'favorite'
  | 'not-favorite'
  | 'deleted'
  | 'not-deleted'

interface BudgetFiltersBarProps {
  filterType: FilterType
  onFilterChange: (filter: FilterType) => void
}

export const BudgetFiltersBar = ({
  filterType,
  onFilterChange,
}: BudgetFiltersBarProps) => {
  return (
    <SelectMenu
      value={filterType}
      onChange={value => onFilterChange(value as FilterType)}
      options={[
        { label: 'All', value: 'all' },
        { label: 'Done', value: 'done' },
        { label: 'Not Done', value: 'not-done' },
        { label: 'Favorite', value: 'favorite' },
        { label: 'Not Favorite', value: 'not-favorite' },
        { label: 'Deleted', value: 'deleted' },
        { label: 'Not Deleted', value: 'not-deleted' },
      ]}
      placeholder="Select filter..."
      size="lg"
      className="w-full sm:w-auto sm:min-w-[180px]"
    />
  )
}

