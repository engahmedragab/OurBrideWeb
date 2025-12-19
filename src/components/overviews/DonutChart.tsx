interface DonutChartData {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutChartData[]
}

export const DonutChart = ({ data }: DonutChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  let currentOffset = 0

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
    const strokeDashoffset = -currentOffset
    currentOffset += (percentage / 100) * circumference

    return (
      <circle
        key={index}
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke={item.color}
        strokeWidth="24"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
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

