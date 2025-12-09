import { HTMLAttributes } from 'react'
import bronzeImage from './bronze.png'
import silverImage from './silver.png'
import goldImage from './gold.png'
import blueImage from './blue.png'
import pinkImage from './pink.png'
import redImage from './red.png'

/**
 * Ranking Icon Component Props
 */
export interface RankingIconProps extends HTMLAttributes<HTMLImageElement> {
  className?: string
}

/**
 * Bronze Rank Badge Icon
 * Shield-shaped badge with bronze color and star icon
 */
export const BronzeIcon = ({ className = 'w-10 h-10', ...props }: RankingIconProps) => {
  return (
    <img
      src={typeof bronzeImage === 'string' ? bronzeImage : bronzeImage.src}
      alt="Bronze rank"
      className={className}
      {...props}
    />
  )
}

/**
 * Silver Rank Badge Icon
 * Diamond-shaped badge with silver/grey color and star icon
 */
export const SilverIcon = ({ className = 'w-10 h-10', ...props }: RankingIconProps) => {
  return (
    <img
      src={typeof silverImage === 'string' ? silverImage : silverImage.src}
      alt="Silver rank"
      className={className}
      {...props}
    />
  )
}

/**
 * Gold Rank Badge Icon
 * Pentagon-shaped badge with orange-gold color and star icon
 */
export const GoldIcon = ({ className = 'w-10 h-10', ...props }: RankingIconProps) => {
  return (
    <img
      src={typeof goldImage === 'string' ? goldImage : goldImage.src}
      alt="Gold rank"
      className={className}
      {...props}
    />
  )
}

/**
 * Blue Rank Badge Icon
 * Hexagonal badge with blue color and star icon
 */
export const BlueRankIcon = ({ className = 'w-10 h-10', ...props }: RankingIconProps) => {
  return (
    <img
      src={typeof blueImage === 'string' ? blueImage : blueImage.src}
      alt="Blue rank"
      className={className}
      {...props}
    />
  )
}

/**
 * Pink Rank Badge Icon
 * Hexagonal badge with magenta/pink color and star icon
 */
export const PinkRankIcon = ({ className = 'w-10 h-10', ...props }: RankingIconProps) => {
  return (
    <img
      src={typeof pinkImage === 'string' ? pinkImage : pinkImage.src}
      alt="Pink rank"
      className={className}
      {...props}
    />
  )
}

/**
 * Red Rank Badge Icon
 * Shield-shaped badge with red color and star icon
 */
export const RedRankIcon = ({ className = 'w-10 h-10', ...props }: RankingIconProps) => {
  return (
    <img
      src={typeof redImage === 'string' ? redImage : redImage.src}
      alt="Red rank"
      className={className}
      {...props}
    />
  )
}

