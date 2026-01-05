'use client'

import { useMemo } from 'react'

interface Segment {
  label: string
  value: number
  color: string
  percentage: number
}

interface BudgetDonutChartProps {
  segments: Segment[]
  totalBudget: number
  remaining: number
  size?: number
  thickness?: number
  gapDeg?: number
}

/**
 * Creates an SVG arc path command for a donut segment
 * @param centerX - X coordinate of circle center
 * @param centerY - Y coordinate of circle center
 * @param radius - Radius of the arc
 * @param startAngle - Start angle in degrees (0 = right, 90 = bottom, -90 = top)
 * @param endAngle - End angle in degrees
 * @param largeArc - Whether to use the large arc (>180 degrees)
 */
const createArcPath = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  largeArc: boolean
): string => {
  const start = polarToCartesian(centerX, centerY, radius, startAngle)
  const end = polarToCartesian(centerX, centerY, radius, endAngle)
  const largeArcFlag = largeArc ? 1 : 0

  return [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    1, // Sweep flag: 1 for clockwise
    end.x,
    end.y,
  ].join(' ')
}

/**
 * Converts polar coordinates to cartesian
 */
const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

export const BudgetDonutChart = ({
  segments,
  totalBudget,
  remaining,
  size = 200,
  thickness = 30,
  gapDeg = 8, // Gap in degrees between segments (total spacing)
}: BudgetDonutChartProps) => {
  const radius = (size - thickness) / 2
  const center = size / 2
  const startAngle = -90 // Start from top (12 o'clock)

  // Calculate segments with gaps
  const segmentsWithAngles = useMemo(() => {
    if (segments.length === 0) return []

    // Calculate total value
    const totalValue = segments.reduce((sum, seg) => sum + seg.value, 0)
    if (totalValue === 0) return []

    // Calculate angles for each segment with gaps
    // Total gap degrees distributed across all segments
    const totalGapsDeg = gapDeg
    const availableDeg = 360 - totalGapsDeg
    const gapPerSegment = gapDeg / segments.length

    let currentAngle = startAngle

    return segments.map(segment => {
      // Calculate segment angle (percentage of available degrees)
      const segmentDeg = (segment.percentage / 100) * availableDeg

      const segmentStart = currentAngle
      const segmentEnd = currentAngle + segmentDeg

      // Move to next segment position (add gap after this segment)
      currentAngle = segmentEnd + gapPerSegment

      return {
        ...segment,
        startAngle: segmentStart,
        endAngle: segmentEnd,
        largeArc: segmentDeg > 180 ? 1 : 0,
      }
    })
  }, [segments, gapDeg, startAngle])

  // If no segments, show empty gray ring
  const hasData = segments.length > 0 && segments.some(s => s.value > 0)

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size}>
        {/* Base ring (light gray) - always show full circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={thickness}
        />

        {/* Segments */}
        {hasData &&
          segmentsWithAngles.map((segment, index) => (
            <path
              key={`${segment.label}-${index}`}
              d={createArcPath(
                center,
                center,
                radius,
                segment.startAngle,
                segment.endAngle,
                segment.largeArc === 1
              )}
              fill="none"
              stroke={segment.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          ))}
      </svg>
    </div>
  )
}
