interface DonutChartData {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutChartData[]
}

export const DonutChart = ({ data }: DonutChartProps) => {
  // Filter out invalid data and calculate total
  const validData = data.filter(
    item =>
      typeof item.value === 'number' && !isNaN(item.value) && item.value >= 0
  )
  const total = validData.reduce((sum, item) => sum + item.value, 0)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  let currentOffset = 0

  // If total is 0 or invalid, show empty chart
  if (total === 0 || !isFinite(total)) {
    return (
      <div className="relative w-[220px] h-[220px] mx-auto">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="24"
          />
        </svg>
      </div>
    )
  }

  const segments = validData.map((item, index) => {
    const percentage = (item.value / total) * 100
    const dashLength = (percentage / 100) * circumference
    const strokeDasharray = `${dashLength} ${circumference}`
    const strokeDashoffset = -currentOffset
    currentOffset += dashLength

    // Ensure values are valid numbers
    const validDashArray = isFinite(dashLength)
      ? strokeDasharray
      : `0 ${circumference}`
    const validDashOffset = isFinite(strokeDashoffset) ? strokeDashoffset : 0

    return (
      <circle
        key={index}
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke={item.color}
        strokeWidth="24"
        strokeDasharray={validDashArray}
        strokeDashoffset={validDashOffset}
        strokeLinecap="round"
        className="transition-all duration-500"
        transform="rotate(-90 100 100)"
      />
    )
  })

  return (
    <div className="relative w-[220px] h-[220px] mx-auto">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth="24"
        />
        {/* Segments */}
        {segments}
      </svg>
    </div>
  )
}
