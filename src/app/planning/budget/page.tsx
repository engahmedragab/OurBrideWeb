'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  BudgetCategoryCard,
  type BudgetCategory,
  type BudgetItem,
} from '@/components/ui/BudgetCategoryCard'
import { SummaryMetricCard } from '@/components/ui/SummaryMetricCard'
import { CategoryFilterChips, type CategoryFilter } from '@/components/ui/CategoryFilterChips'
import { AddBudgetItemModal } from '@/components/ui/AddBudgetItemModal'
import { DeleteBudgetItemModal } from '@/components/ui/DeleteBudgetItemModal'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'

// Mock data - Replace with actual API data
const mockCategories: CategoryFilter[] = [
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'beauty', name: 'Beauty & Health' },
  { id: 'cake', name: 'Cake' },
  { id: 'hospitality', name: 'Hospitality' },
  { id: 'party', name: 'At the Party' },
]

const mockBudgetCategories: BudgetCategory[] = [
  {
    id: 'entertainment',
    name: 'Entertainment',
    total: 5000.0,
    estimatedCost: 5000.0,
    finalCost: 0.0,
    items: [],
  },
  {
    id: 'beauty',
    name: 'Beauty & Health',
    total: 2300.0,
    estimatedCost: 2300.0,
    finalCost: 0.0,
    items: [],
  },
  {
    id: 'cake',
    name: 'Cake',
    total: 2500.0,
    estimatedCost: 2500.0,
    finalCost: 0.0,
    items: [
      {
        id: 'cake-1',
        itemType: 'Cake',
        name: 'Cake and Cutting Fees',
        estimatedCost: 2000.0,
        paidAmount: 1000.0,
      },
      {
        id: 'cake-2',
        itemType: 'Buffet',
        name: 'Buffets',
        estimatedCost: 500.0,
        paidAmount: 300.0,
      },
    ],
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    total: 0.0,
    estimatedCost: 0.0,
    finalCost: 0.0,
    items: [],
  },
  {
    id: 'party',
    name: 'At the Party',
    total: 0.0,
    estimatedCost: 0.0,
    finalCost: 0.0,
    items: [],
  },
]

export default function BudgetPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all')
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>('cake')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<{
    id: string
    itemType: string
    itemName: string
    estimatedCost: number
    paidAmount: number
    notes?: string
    categoryId: string
  } | null>(null)
  const [deletingItem, setDeletingItem] = useState<{
    id: string
    name: string
    categoryId: string
  } | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(mockBudgetCategories)
  
  // Manual adjustments for summary cards (separate from items)
  const [summaryAdjustments, setSummaryAdjustments] = useState({
    estimatedCost: 0,
    paid: 0,
  })

  // Calculate summary metrics based on actual items + manual adjustments
  const totalEstimatedCost = budgetCategories.reduce(
    (sum, cat) => sum + cat.items.reduce((itemSum, item) => itemSum + item.estimatedCost, 0),
    0
  ) + summaryAdjustments.estimatedCost
  
  const totalPaid = budgetCategories.reduce(
    (sum, cat) => sum + cat.items.reduce((itemSum, item) => itemSum + item.paidAmount, 0),
    0
  ) + summaryAdjustments.paid
  
  const totalPending = totalEstimatedCost - totalPaid
  const totalCount = budgetCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  )

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filter categories based on selection
  const filteredCategories =
    selectedCategoryId === 'all'
      ? budgetCategories
      : budgetCategories.filter(cat => cat.id === selectedCategoryId)

  const handleToggleCategory = (categoryId: string) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId)
  }

  const handleAddItem = (data: {
    itemType: string
    itemName: string
    estimatedCost: number
    paidAmount: number
    notes?: string
  }) => {
    if (editingItem) {
      // Edit existing item
      setBudgetCategories(prev =>
        prev.map(cat => {
          if (cat.id === editingItem.categoryId) {
            return {
              ...cat,
              items: cat.items.map(item =>
                item.id === editingItem.id
                  ? {
                      ...item,
                      itemType: data.itemType,
                      name: data.itemName,
                      estimatedCost: data.estimatedCost,
                      paidAmount: data.paidAmount,
                      notes: data.notes,
                    }
                  : item
              ),
            }
          }
          return cat
        })
      )
      addToast('Item updated successfully', 'success', 3000)
      setEditingItem(null)
    } else {
      // Add new item to selected category or first category if none selected
      const targetCategoryId = selectedCategoryId !== 'all' ? selectedCategoryId : budgetCategories[0]?.id
      
      if (targetCategoryId) {
        const newItem = {
          id: `item-${Date.now()}`,
          itemType: data.itemType,
          name: data.itemName,
          estimatedCost: data.estimatedCost,
          paidAmount: data.paidAmount,
          notes: data.notes,
        }

        setBudgetCategories(prev => {
          const categoryExists = prev.some(cat => cat.id === targetCategoryId)
          
          if (!categoryExists) {
            // If category doesn't exist, add it
            const categoryFromFilter = mockCategories.find(c => c.id === targetCategoryId)
            if (categoryFromFilter) {
              return [
                ...prev,
                {
                  id: targetCategoryId,
                  name: categoryFromFilter.name,
                  total: 0.0,
                  estimatedCost: 0.0,
                  finalCost: 0.0,
                  items: [newItem],
                },
              ]
            }
          }
          
          return prev.map(cat =>
            cat.id === targetCategoryId
              ? { ...cat, items: [...cat.items, newItem] }
              : cat
          )
        })
        
        // Expand the category to show the new item
        setExpandedCategoryId(targetCategoryId)
        addToast('Item added successfully', 'success', 3000)
      } else {
        addToast('Please select a category', 'error', 3000)
      }
    }
    setIsAddModalOpen(false)
  }

  const handleEditItem = (item: BudgetItem) => {
    // Find which category this item belongs to
    const category = budgetCategories.find(cat =>
      cat.items.some(i => i.id === item.id)
    )
    
    if (category) {
      setEditingItem({
        id: item.id,
        itemType: item.itemType || '',
        itemName: item.name,
        estimatedCost: item.estimatedCost,
        paidAmount: item.paidAmount,
        notes: item.notes,
        categoryId: category.id,
      })
      setIsAddModalOpen(true)
    }
  }

  const handleDeleteItem = (item: BudgetItem) => {
    // Find which category this item belongs to
    const category = budgetCategories.find(cat =>
      cat.items.some(i => i.id === item.id)
    )
    
    if (category) {
      setDeletingItem({
        id: item.id,
        name: item.name,
        categoryId: category.id,
      })
      setIsDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    if (deletingItem) {
      setBudgetCategories(prev =>
        prev.map(cat =>
          cat.id === deletingItem.categoryId
            ? { ...cat, items: cat.items.filter(item => item.id !== deletingItem.id) }
            : cat
        )
      )
      addToast('Item deleted successfully', 'success', 3000)
      setDeletingItem(null)
    }
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setEditingItem(null)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeletingItem(null)
  }

  const handleAddItemFromCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setEditingItem(null)
    setIsAddModalOpen(true)
    // Expand the category to show the empty state
    setExpandedCategoryId(categoryId)
  }

  const handleUpdateAmount = (itemId: string, field: 'estimatedCost' | 'paidAmount', amount: number) => {
    setBudgetCategories(prev =>
      prev.map(cat => ({
        ...cat,
        items: cat.items.map(item =>
          item.id === itemId
            ? { ...item, [field]: amount }
            : item
        ),
      }))
    )
  }

  // Calculate base values (without adjustments)
  const baseEstimatedCost = budgetCategories.reduce(
    (sum, cat) => sum + cat.items.reduce((itemSum, item) => itemSum + item.estimatedCost, 0),
    0
  )
  const basePaid = budgetCategories.reduce(
    (sum, cat) => sum + cat.items.reduce((itemSum, item) => itemSum + item.paidAmount, 0),
    0
  )

  // Handle direct value changes in summary cards
  const handleEstimatedCostChange = (newValue: number) => {
    setSummaryAdjustments(prev => ({
      ...prev,
      estimatedCost: Math.max(0, newValue - baseEstimatedCost),
    }))
  }

  const handlePaidChange = (newValue: number) => {
    setSummaryAdjustments(prev => ({
      ...prev,
      paid: Math.max(0, newValue - basePaid),
    }))
  }

  const handlePendingChange = (newValue: number) => {
    // Adjusting pending means adjusting estimated cost
    const newEstimatedCost = newValue + totalPaid
    handleEstimatedCostChange(newEstimatedCost)
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-24 sm:pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
          </button>
          <h1 className="text-18 sm:text-20 md:text-24 lg:text-28 font-semibold text-gray-900">
            Budgets
          </h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Desktop Add Button */}
          {!isMobile && (
            <Button
              variant="brand"
              size="md"
              onClick={() => {
                setEditingItem(null)
                setIsAddModalOpen(true)
              }}
              className="text-white"
            >
              <Plus className="h-4 w-4 mr-2 text-white" />
              Add New
            </Button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-4 sm:mb-6">
        <CategoryFilterChips
          categories={mockCategories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      </div>

      {/* Summary Metrics */}
      <div className="mb-4 sm:mb-6">
        <div
          className={cn(
            'grid gap-3 sm:gap-4',
            'grid-cols-1',
            'sm:grid-cols-2',
            'lg:grid-cols-3'
          )}
        >
          <SummaryMetricCard
            label="Estimated Cost"
            value={totalEstimatedCost}
            variant="default"
            editable
            onValueChange={handleEstimatedCostChange}
          />
          <SummaryMetricCard
            label="Paid"
            value={totalPaid}
            subLabel="Pending"
            subValue={totalPending}
            variant="highlight"
            editable
            editableSub
            onValueChange={handlePaidChange}
            onSubValueChange={handlePendingChange}
          />
          <SummaryMetricCard
            label="Count"
            value={totalCount}
            subLabel="Items"
            subValue={totalCount}
            variant="highlight"
          />
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-3 sm:space-y-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <BudgetCategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedCategoryId === category.id}
              onToggle={() => handleToggleCategory(category.id)}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onAddItem={handleAddItemFromCategory}
              onUpdateAmount={handleUpdateAmount}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-16">No budget categories found</p>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      {isMobile && (
        <button
          onClick={() => {
            setEditingItem(null)
            setIsAddModalOpen(true)
          }}
          className="fixed bottom-4 right-4 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-600 transition-colors flex items-center justify-center"
          aria-label="Add new item"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}

      {/* Modals */}
      <AddBudgetItemModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddItem}
        editingItem={editingItem}
      />

      <DeleteBudgetItemModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={deletingItem?.name}
      />
    </div>
  )
}
