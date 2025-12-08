import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export type RankKey =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'topMember'

const rankConfig: Record<
  RankKey,
  {
    label: string
    gradientFrom: string
    gradientTo: string
  }
> = {
  bronze: {
    label: 'Bronze',
    gradientFrom: '#8C4500',
    gradientTo: '#D1A66E',
  },
  silver: {
    label: 'Silver',
    gradientFrom: '#6B7280',
    gradientTo: '#E5E7EB',
  },
  gold: {
    label: 'Gold',
    gradientFrom: '#F07E00',
    gradientTo: '#F7F4CF',
  },
  platinum: {
    label: 'Platinum',
    gradientFrom: '#8AA8B5',
    gradientTo: '#DCE5E8',
  },
  diamond: {
    label: 'Diamond',
    gradientFrom: '#C026D3',
    gradientTo: '#F9A8D4',
  },
  topMember: {
    label: 'Top Member',
    gradientFrom: '#DC2626',
    gradientTo: '#FCA5A5',
  },
}

const rankBadgeVariants = cva(
  'relative rounded-l-lg overflow-hidden transition-all duration-200',
  {
    variants: {
      clickable: {
        true: 'cursor-pointer hover:shadow-lg hover:scale-[1.02]',
        false: '',
      },
      showContent: {
        true: 'px-4 py-3',
        false: '',
      },
    },
    defaultVariants: {
      clickable: false,
      showContent: true,
    },
  }
)

export interface RankBadgeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>,
    VariantProps<typeof rankBadgeVariants> {
  rankKey: RankKey
  title?: string
  rankingValue?: number
  className?: string
  onClick?: () => void
  showText?: boolean
}

/**
 * RankBadge component displays a colored badge for different membership ranks
 * @param rankKey - The rank type (bronze, silver, gold, platinum, diamond, topMember)
 * @param title - Optional override for the rank label text
 * @param rankingValue - The ranking number to display (e.g., 22568)
 * @param className - Additional CSS classes for the container
 * @param onClick - Optional click handler for navigation
 * @param showText - Whether to show text content (default: true)
 */
const RankBadge = forwardRef<HTMLDivElement, RankBadgeProps>(
  (
    {
      rankKey,
      title,
      rankingValue,
      className,
      onClick,
      clickable,
      showText = true,
      ...props
    },
    ref
  ) => {
    const config = rankConfig[rankKey]
    const displayTitle = title || config.label
    const hasClickHandler = !!onClick
    const hasContent = Boolean(showText && (displayTitle || rankingValue !== undefined))

    return (
      <div
        ref={ref}
        className={cn(
          rankBadgeVariants({
            clickable: hasClickHandler || clickable,
            showContent: hasContent,
          }),
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${config.gradientFrom} 0%, ${config.gradientTo} 100%)`,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
        }}
        onClick={onClick}
        role={hasClickHandler ? 'button' : undefined}
        tabIndex={hasClickHandler ? 0 : undefined}
        onKeyDown={
          hasClickHandler
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick()
                }
              }
            : undefined
        }
        {...props}
      >
        {/* Content - only shown if showText is true */}
        {hasContent && (
          <div className="relative z-10 flex flex-col gap-1">
            {displayTitle && (
              <h3 className="text-10 lg:text-10 font-bold leading-tight text-white">
                {displayTitle}
              </h3>
            )}
            {rankingValue !== undefined && (
              <p className="text-8 lg:text-10 font-medium leading-tight text-white opacity-90">
                Ranking : {rankingValue.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)

RankBadge.displayName = 'RankBadge'

export { RankBadge, rankBadgeVariants }


