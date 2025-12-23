// Mock data structure matching BudgetBook, BudgetLine, BudgetLineCategory interfaces
// This is UI-only mock data for development

export interface MockBudgetBook {
  id: number
  title: string | null
  clientName: string | null
  weddingDate: string | null
  eventLocation: string | null
  initialEstimated: number | null
  lines: MockBudgetLine[]
  lineCategories: MockBudgetLineCategory[]
}

export interface MockBudgetLine {
  id: number
  expense: string | null
  lineCategoryId: number | null
  estimated: number
  paid: number
  final: number | null
  dueDate: string | null
  count: number | null
  payer: string | null
  note: string | null
  isDone: boolean
  isFavorite: boolean
  isDeleted: boolean
  iconName: string | null
  colorName: string | null
}

export interface MockBudgetLineCategory {
  id: number
  name: string | null
  description: string | null
  iconName: string | null
  colorName: string | null
}

// Default mock data matching the reference design
export const createMockBudgetBook = (): MockBudgetBook => {
  const categories: MockBudgetLineCategory[] = [
    {
      id: 1,
      name: 'Makeup Artist',
      description: 'Beauty and makeup services',
      iconName: 'makeup',
      colorName: 'green',
    },
    {
      id: 2,
      name: 'Photography',
      description: 'Photography services',
      iconName: 'camera',
      colorName: 'green',
    },
    {
      id: 3,
      name: 'Venue',
      description: 'Event venue',
      iconName: 'venue',
      colorName: 'green',
    },
    {
      id: 4,
      name: 'Catering',
      description: 'Food and catering',
      iconName: 'catering',
      colorName: 'green',
    },
    {
      id: 5,
      name: 'Entertainment',
      description: 'Entertainment services',
      iconName: 'entertainment',
      colorName: 'yellow',
    },
    {
      id: 6,
      name: 'Decoration',
      description: 'Event decoration',
      iconName: 'decoration',
      colorName: 'blue',
    },
  ]

  const lines: MockBudgetLine[] = [
    {
      id: 1,
      expense: 'Makeup Artist',
      lineCategoryId: 1,
      estimated: 4000,
      paid: 2000,
      final: null,
      dueDate: null,
      count: null,
      payer: null,
      note: null,
      isDone: false,
      isFavorite: false,
      isDeleted: false,
      iconName: null,
      colorName: 'green',
    },
    {
      id: 2,
      expense: 'Makeup Artist',
      lineCategoryId: 1,
      estimated: 4000,
      paid: 2000,
      final: null,
      dueDate: null,
      count: null,
      payer: null,
      note: null,
      isDone: false,
      isFavorite: false,
      isDeleted: false,
      iconName: null,
      colorName: 'green',
    },
    {
      id: 3,
      expense: 'Makeup Artist',
      lineCategoryId: 1,
      estimated: 4000,
      paid: 2000,
      final: null,
      dueDate: null,
      count: null,
      payer: null,
      note: null,
      isDone: false,
      isFavorite: false,
      isDeleted: false,
      iconName: null,
      colorName: 'green',
    },
    {
      id: 4,
      expense: 'Makeup Artist',
      lineCategoryId: 1,
      estimated: 4000,
      paid: 2000,
      final: null,
      dueDate: null,
      count: null,
      payer: null,
      note: null,
      isDone: false,
      isFavorite: false,
      isDeleted: false,
      iconName: null,
      colorName: 'green',
    },
    {
      id: 5,
      expense: 'Makeup Artist',
      lineCategoryId: 5,
      estimated: 4000,
      paid: 2000,
      final: null,
      dueDate: null,
      count: null,
      payer: null,
      note: null,
      isDone: false,
      isFavorite: false,
      isDeleted: false,
      iconName: null,
      colorName: 'yellow',
    },
    {
      id: 6,
      expense: 'Makeup Artist',
      lineCategoryId: 6,
      estimated: 4000,
      paid: 2000,
      final: null,
      dueDate: null,
      count: null,
      payer: null,
      note: null,
      isDone: false,
      isFavorite: false,
      isDeleted: false,
      iconName: null,
      colorName: 'blue',
    },
  ]

  return {
    id: 1,
    title: 'Wedding Budget 2024',
    clientName: 'Aya Mohamed',
    weddingDate: '2024-12-15T00:00:00Z',
    eventLocation: 'Cairo, Egypt',
    initialEstimated: 120000,
    lines,
    lineCategories: categories,
  }
}

// Helper to get color from colorName
export const getColorFromName = (colorName: string | null): string => {
  switch (colorName) {
    case 'green':
      return '#22C55E' // green-500
    case 'yellow':
      return '#EAB308' // yellow-500
    case 'blue':
      return '#3B82F6' // blue-500
    case 'red':
      return '#EF4444' // red-500
    default:
      return '#737373' // gray-500
  }
}

// Helper to calculate budget statistics
// activeCategoryId: null = "All", number = specific category
export const calculateBudgetStats = (
  book: MockBudgetBook,
  activeCategoryId: number | null = null
) => {
  const totalBudget = book.initialEstimated || 0

  // Filter lines by active category
  let filteredLines = book.lines.filter(line => !line.isDeleted)
  if (activeCategoryId !== null) {
    filteredLines = filteredLines.filter(
      line => line.lineCategoryId === activeCategoryId
    )
  }

  // Calculate totals from filtered lines
  const totalEstimated = filteredLines.reduce((sum, line) => sum + line.estimated, 0)
  const totalPaid = filteredLines.reduce((sum, line) => sum + (line.paid ?? 0), 0)
  const count = filteredLines.length

  // Budget logic:
  // budget = max(budgetBook.initialEstimated ?? 0, 0)
  // spent = sum(paid ?? 0) across filtered lines
  // remaining = max(budget - spent, 0)
  // remaining MUST NOT exceed budget
  const budget = Math.max(totalBudget, 0)
  const spent = totalPaid
  const remaining = Math.max(budget - spent, 0)

  // Saved percentage: savedPercent = budget > 0 ? (remaining / budget) * 100 : 0
  // Clamp savedPercent between 0 and 100
  const savedPercentage = Math.max(
    0,
    Math.min(100, budget > 0 ? (remaining / budget) * 100 : 0)
  )

  // Calculate category breakdown (always show all categories, but highlight active)
  // For donut chart: value = sum(paid ?? 0) per category
  const categoryStats = book.lineCategories.map(category => {
    const categoryLines = book.lines.filter(
      line => line.lineCategoryId === category.id && !line.isDeleted
    )
    // Value rule: sum(paid ?? 0) per category (for donut chart)
    const categoryValue = categoryLines.reduce(
      (sum, line) => sum + (line.paid ?? 0),
      0
    )
    const categoryTotal = categoryLines.reduce((sum, line) => sum + line.estimated, 0)
    const categoryPercentage = totalBudget > 0 ? (categoryTotal / totalBudget) * 100 : 0

    return {
      category,
      total: categoryTotal,
      value: categoryValue, // For donut chart visualization (sum of paid)
      percentage: categoryPercentage,
      lines: categoryLines,
    }
  })

  return {
    totalBudget,
    totalEstimated,
    totalPaid,
    remaining,
    savedPercentage,
    count,
    categoryStats,
  }
}

