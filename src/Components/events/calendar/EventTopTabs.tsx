import { Tabs } from '@/components/ui'

export interface EventTopTabsProps {
  activeTab: string
  onTabChange?: (value: string) => void
  className?: string
}

/**
 * EventTopTabs Component
 * Displays the top navigation tabs for the Event Dashboard
 */
export const EventTopTabs = ({
  activeTab,
  onTabChange,
  className,
}: EventTopTabsProps) => {
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'budget', label: 'Budget' },
    { value: 'lists', label: 'Lists' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'my-bookings', label: 'My Bookings' },
    { value: 'event-invitation', label: 'Event Invitation' },
  ]

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <Tabs
          items={tabs}
          activeValue={activeTab}
          onChange={onTabChange}
          variant="underline"
          className="min-w-max"
        />
      </div>
    </div>
  )
}

