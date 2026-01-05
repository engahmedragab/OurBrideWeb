interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
}

export const ProgressRing = ({
  percentage,
  size = 60,
  strokeWidth = 6,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  // Calculate green color intensity based on percentage
  // 0% = light green (#86EFAC), 100% = dark green (#16A34A)
  const getGreenColor = (percent: number): string => {
    const clampedPercent = Math.max(0, Math.min(100, percent))

    // Interpolate between light green and dark green
    // Light green: #86EFAC (rgb(134, 239, 172))
    // Dark green: #16A34A (rgb(22, 163, 74))
    const r1 = 134
    const g1 = 239
    const b1 = 172
    const r2 = 22
    const g2 = 163
    const b2 = 74

    const ratio = clampedPercent / 100
    const r = Math.round(r1 + (r2 - r1) * ratio)
    const g = Math.round(g1 + (g2 - g1) * ratio)
    const b = Math.round(b1 + (b2 - b1) * ratio)

    return `rgb(${r}, ${g}, ${b})`
  }

  const greenColor = getGreenColor(percentage)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={greenColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
    </div>
  )
}
