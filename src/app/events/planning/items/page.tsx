'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  List,
  Plus,
  Package,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  ShoppingBag,
  Store,
} from 'lucide-react'
import Link from 'next/link'
import {
  Button,
  Checkbox,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui'


const INITIAL_ITEMS = [
    {
      "id": 1,
      "name": "Sofa",
      "category": "Furniture",
      "description": "A three-seat fabric sofa",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 4500,
      "totalCost": 4500,
      "advancePayment": 1000,
      "remaining": 3500,
      "seller": "Home Comfort Store",
      "buyDate": "2025-01-12",
      "iscompleted": true
    },
    {
      "id": 2,
      "name": "Bed",
      "category": "Furniture",
      "description": "King size wooden bed frame",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 5200,
      "totalCost": 5200,
      "advancePayment": 2000,
      "remaining": 3200,
      "seller": "SleepWell Furniture",
      "buyDate": "2025-02-03",
        "iscompleted": true

    },
    {
      "id": 3,
      "name": "Refrigerator",
      "category": "Home Appliances",
      "description": "No-frost 14ft refrigerator",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 9800,
      "totalCost": 9800,
      "advancePayment": 5000,
      "remaining": 4800,
      "seller": "Appliance World",
      "buyDate": "2025-01-20",
          "iscompleted": true
    },
    {
      "id": 4,
      "name": "Gas Cooker",
      "category": "Kitchen Appliances",
      "description": "5-burner stainless steel cooker",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 6300,
      "totalCost": 6300,
      "advancePayment": 3000,
      "remaining": 3300,
      "seller": "Kitchen Pro",
      "buyDate": "2025-03-01",
          "iscompleted": false

    },
    {
      "id": 5,
      "name": "Washing Machine",
      "category": "Home Appliances",
      "description": "Automatic front-load washing machine",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 7500,
      "totalCost": 7500,
      "advancePayment": 2000,
      "remaining": 5500,
      "seller": "Smart Appliances",
      "buyDate": "2025-02-15",
      "iscompleted": true
    },
    {
      "id": 6,
      "name": "Dining Table",
      "category": "Furniture",
      "description": "Wooden dining table with 6 chairs",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 6900,
      "totalCost": 6900,
      "advancePayment": 2500,
      "remaining": 4400,
      "seller": "Luxury Wood",
      "buyDate": "2025-02-17",
          "iscompleted": false
    },
    {
      "id": 7,
      "name": "Microwave",
      "category": "Kitchen Appliances",
      "description": "Digital microwave oven",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 1800,
      "totalCost": 1800,
      "advancePayment": 800,
      "remaining": 1000,
      "seller": "Kitchen Store",
      "buyDate": "2025-01-25",
          "iscompleted": true
    },
    {
      "id": 8,
      "name": "TV 55 inch",
      "category": "Home Appliances",
      "description": "Smart 4K LED TV",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 9500,
      "totalCost": 9500,
      "advancePayment": 3500,
      "remaining": 6000,
      "seller": "ElectroMart",
      "buyDate": "2025-03-05",
          "iscompleted": true
    },
    {
      "id": 9,
      "name": "Wardrobe",
      "category": "Furniture",
      "description": "3-door wooden wardrobe",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 4800,
      "totalCost": 4800,
      "advancePayment": 2000,
      "remaining": 2800,
      "seller": "Modern Home",
      "buyDate": "2025-02-10",
          "iscompleted": true
    },
    {
      "id": 10,
      "name": "Vacuum Cleaner",
      "category": "Home Appliances",
      "description": "High power vacuum cleaner",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 1200,
      "totalCost": 1200,
      "advancePayment": 300,
      "remaining": 900,
      "seller": "CleanTech",
      "buyDate": "2025-01-30",
          "iscompleted": true
    },
    {
      "id": 11,
      "name": "Kitchen Utensils Set",
      "category": "Kitchen Tools",
      "description": "20-piece stainless steel kitchen utensil set",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 600,
      "totalCost": 600,
      "advancePayment": 200,
      "remaining": 400,
      "seller": "Kitchen Essentials",
      "buyDate": "2025-03-02",
          "iscompleted": false
    },
    {
      "id": 12,
      "name": "Curtains",
      "category": "Home Decor",
      "description": "Blackout curtains for bedroom",
      "quantity": 2,
      "estimatedQuantity": 2,
      "cost": 350,
      "totalCost": 700,
      "advancePayment": 200,
      "remaining": 500,
      "seller": "Decor House",
      "buyDate": "2025-02-18",
          "iscompleted": false
    },
    {
      "id": 13,
      "name": "Carpet",
      "category": "Home Decor",
      "description": "Large soft living room carpet",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 2200,
      "totalCost": 2200,
      "advancePayment": 700,
      "remaining": 1500,
      "seller": "Soft Floors",
      "buyDate": "2025-01-27",
          "iscompleted": true
    },
    {
      "id": 14,
      "name": "Blender",
      "category": "Kitchen Appliances",
      "description": "High-speed blender",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 900,
      "totalCost": 900,
      "advancePayment": 300,
      "remaining": 600,
      "seller": "Kitchen Pro",
      "buyDate": "2025-02-12",
          "iscompleted": true
    },
    {
      "id": 15,
      "name": "Study Desk",
      "category": "Furniture",
      "description": "Wooden study desk with drawers",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 2600,
      "totalCost": 2600,
      "advancePayment": 1000,
      "remaining": 1600,
      "seller": "Office Line",
      "buyDate": "2025-03-07",
          "iscompleted": true
    },
    {
      "id": 16,
      "name": "Air Fryer",
      "category": "Kitchen Appliances",
      "description": "Digital air fryer 5L",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 2200,
      "totalCost": 2200,
      "advancePayment": 700,
      "remaining": 1500,
      "seller": "Kitchen Max",
      "buyDate": "2025-02-23",
          "iscompleted": true
    },
    {
      "id": 17,
      "name": "Coffee Machine",
      "category": "Kitchen Appliances",
      "description": "Automatic espresso coffee machine",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 3200,
      "totalCost": 3200,
      "advancePayment": 1000,
      "remaining": 2200,
      "seller": "Coffee Gear",
      "buyDate": "2025-03-09",
          "iscompleted": true
    },
    {
      "id": 18,
      "name": "Side Table",
      "category": "Furniture",
      "description": "Small wooden side table",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 500,
      "totalCost": 500,
      "advancePayment": 150,
      "remaining": 350,
      "seller": "Wood Art",
      "buyDate": "2025-02-14",
          "iscompleted": true
    },
    {
      "id": 19,
      "name": "Bookshelf",
      "category": "Furniture",
      "description": "5-tier wooden bookshelf",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 1400,
      "totalCost": 1400,
      "advancePayment": 400,
      "remaining": 1000,
      "seller": "Office Line",
      "buyDate": "2025-01-28",
          "iscompleted": true
    },
    {
      "id": 20,
      "name": "Electric Kettle",
      "category": "Kitchen Appliances",
      "description": "1.7L stainless steel kettle",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 450,
      "totalCost": 450,
      "advancePayment": 100,
      "remaining": 350,
      "seller": "Kitchen Store",
      "buyDate": "2025-03-03",
      "iscompleted": true
    },
    {
      "id": 21,
      "name": "Ceiling Fan",
      "category": "Home Appliances",
      "description": "3-blade ceiling fan",
      "quantity": 2,
      "estimatedQuantity": 2,
      "cost": 650,
      "totalCost": 1300,
      "advancePayment": 300,
      "remaining": 1000,
      "seller": "Cool Air",
      "buyDate": "2025-02-11",
          "iscompleted": true
    },
    {
      "id": 22,
      "name": "Iron",
      "category": "Home Appliances",
      "description": "Steam iron",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 350,
      "totalCost": 350,
      "advancePayment": 100,
      "remaining": 250,
      "seller": "Home Tools",
      "buyDate": "2025-03-04",
          "iscompleted": true
    },
    {
      "id": 23,
      "name": "Pillows Set",
      "category": "Home Decor",
      "description": "Set of 4 soft pillows",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 450,
      "totalCost": 450,
      "advancePayment": 150,
      "remaining": 300,
      "seller": "Soft Home",
      "buyDate": "2025-02-22",
          "iscompleted": true
    },
    {
      "id": 24,
      "name": "Bed Sheets",
      "category": "Home Decor",
      "description": "Cotton king-size bed sheets",
      "quantity": 2,
      "estimatedQuantity": 2,
      "cost": 300,
      "totalCost": 600,
      "advancePayment": 200,
      "remaining": 400,
      "seller": "Textile House",
      "buyDate": "2025-03-06",
          "iscompleted": true
    },
    {
      "id": 25,
      "name": "Table Lamp",
      "category": "Home Decor",
      "description": "LED bedside table lamp",
      "quantity": 1,
      "estimatedQuantity": 1,
      "cost": 550,
      "totalCost": 550,
      "advancePayment": 200,
      "remaining": 350,
      "seller": "Light Hub",
      "buyDate": "2025-02-09",
          "iscompleted": true
    }
];

// CONSTANT ROUTES
const ITEM_DETAILS_BASE_PATH = '/planning/items';
const ADD_NEW_ITEM_PATH = '/events/planning/items/new';


export default function ItemsPage() {
const [items, setItems] = useState(INITIAL_ITEMS);

    // 1. Unique Categories
    const uniqueCategories = useMemo(() => {
        const cats = items.map(item => item.category);
        return ['All', ...new Set(cats)];
    }, [items]);


    // States
    const [activeCategory, setActiveCategory] = useState('All')
    const [expandedCategory, setExpandedCategory] = useState<string | null>('All')


    // 2. Filtered Items by Category
    const filteredItems = useMemo(() => {
        return activeCategory === 'All'
            ? items
            : items.filter(item => item.category === activeCategory);
    }, [items, activeCategory]);


    // 3. Global Statistics
    const { completedCount, remainingCount } = useMemo(() => {
        return {
            completedCount: filteredItems.filter(i => i.iscompleted).length,
            remainingCount: filteredItems.filter(i => !i.iscompleted).length
        };
    }, [filteredItems]);


    // 4. Group Items
    interface GroupedItemData {
        totalItems: number
        items: typeof INITIAL_ITEMS
    }

    const groupedItems = useMemo(() => {
        return filteredItems.reduce(
            (groups: Record<string, GroupedItemData>, item) => {
                const category = item.category

                if (!groups[category]) {
                    groups[category] = {
                        totalItems: 0,
                        items: [],
                    }
                }

                groups[category].items.push(item)
                groups[category].totalItems += item.quantity || 0

                return groups
            },
            {}
        )
    }, [filteredItems])

    const categoriesArray = Object.entries(groupedItems);


    // 5. Handlers
    const handleCategoryChange = (category: string) => {
        setActiveCategory(category)
        setExpandedCategory(category)
    }

    const handleToggleExpand = (category: string) => {
        setExpandedCategory(prev => (prev === category ? null : category))
    }

    const toggleComplete = (id: number) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, iscompleted: !item.iscompleted }
                    : item
            )
        )
    }

    const handleAddNewCategory = () => {
        // Handler for adding new category
        console.log('Add new category')
    }

    // --- NEW FUNCTION: Function to handle saving/renaming the category ---
   /*  const handleSaveCategory = (oldName: string, newName: string) => {
        const trimmedName = newName.trim();

        if (trimmedName && !categoriesList.includes(trimmedName)) {
            // Update the list with the new name
            setCategoriesList(prevList => 
                prevList.map(cat => (cat === oldName ? trimmedName : cat))
            );
            
            // Set the new name as the active category
            setActiveCategory(trimmedName);
        } else if (trimmedName && trimmedName !== oldName) {
            // Case where the name is valid but already exists (optional: handle error/duplicate)
        } else if (!trimmedName) {
            // Case where the name is empty, remove the category (optional: prevent removal)
            setCategoriesList(prevList => prevList.filter(cat => cat !== oldName));
            setActiveCategory('All'); // Reset active filter
        }

        setEditingCategory(null); // Exit editing mode
    }; */

    return (
        <>
            <div className="w-full mx-auto">
                
                {/* ---------- FILTER BUTTONS ----------- */}
              <NavigationMenu>
                <NavigationMenuList className="flex space-x-2">
                  {uniqueCategories.map((category: string) => {
                    const isActive = category === activeCategory;
                  return (
                    <NavigationMenuItem key={category}>
                      <NavigationMenuLink
                        onClick={() => handleCategoryChange(category)}                         
                        className={cn(
                          'px-5 py-2.5 text-14 md:text-16 font-normal rounded-full whitespace-nowrap transition-colors duration-200 cursor-pointer',
                          isActive
                            ? 'bg-brand-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {category}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
          


                {/* ---------- TOP STATS ----------- */}
                <div className="flex flex-col items-center py-8 md:py-12 bg-white border-b border-gray-100">
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 w-full max-w-5xl">
                        {/* Count Card */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border-2 border-brand-100 hover:border-brand-200 transition-all duration-200 min-w-[180px] md:min-w-[220px] flex-1 max-w-[240px]">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4 md:mb-5">
                                    <Package className="w-7 h-7 md:w-8 md:h-8 text-brand-500" />
                                </div>
                                <p className="text-14 md:text-16 font-normal text-gray-600 mb-3">Count</p>
                                <p className="text-32 md:text-40 lg:text-48 font-normal text-brand-500 leading-none">{filteredItems.length}</p>
                            </div>
                        </div>

                        {/* Completed Card */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border-2 border-green-100 hover:border-green-200 transition-all duration-200 min-w-[180px] md:min-w-[220px] flex-1 max-w-[240px]">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 md:mb-5">
                                    <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8 text-green-600" />
                                </div>
                                <p className="text-14 md:text-16 font-normal text-gray-600 mb-3">Completed</p>
                                <p className="text-32 md:text-40 lg:text-48 font-normal text-green-600 leading-none">{completedCount}</p>
                            </div>
                        </div>

                        {/* Remaining Card */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border-2 border-orange-100 hover:border-orange-200 transition-all duration-200 min-w-[180px] md:min-w-[220px] flex-1 max-w-[240px]">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4 md:mb-5">
                                    <Clock className="w-7 h-7 md:w-8 md:h-8 text-orange-500" />
                                </div>
                                <p className="text-14 md:text-16 font-normal text-gray-600 mb-3">Remaining</p>
                                <p className="text-32 md:text-40 lg:text-48 font-normal text-orange-500 leading-none">{remainingCount}</p>
                            </div>
                        </div>
                    </div>


                    {/* ---------- Category Title ----------- */}
                    <div className="mt-8 md:mt-10 mb-6 md:mb-8">
                        <h3 className="text-18 md:text-20 font-normal text-gray-900">
                            Items in <span className="text-brand-500">{activeCategory}</span>
                        </h3>
                    </div>

                    {/* ---------- ACCORDION GROUPS ----------- */}
                    <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
                        <div className="space-y-5 md:space-y-7">
                            {categoriesArray.map(([categoryName, data]) => {
                                const isExpanded = categoryName === expandedCategory;
                                
                                return (
                                    <div
                                        key={categoryName}
                                        className={cn(
                                            'bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 border',
                                            isExpanded
                                              ? 'border-brand-200 shadow-lg'
                                              : 'border-gray-200 hover:border-gray-300'
                                        )}
                                    >
                                        {/* Accordion Header */}
                                        <button
                                            onClick={() => handleToggleExpand(categoryName)}
                                            className={cn(
                                                'flex items-center justify-between w-full p-6 md:p-7 transition-all duration-200',
                                                isExpanded
                                                  ? 'bg-brand-50 hover:bg-brand-100'
                                                  : 'bg-gray-50 hover:bg-gray-100'
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                    <ShoppingBag className="w-6 h-6 text-brand-500" />
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-16 md:text-18 font-normal text-gray-900 block">
                                                        {categoryName}
                                                    </span>
                                                    <span className="text-12 md:text-14 text-gray-500 mt-1 block">
                                                        {data.items.length} {data.items.length === 1 ? 'item' : 'items'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {/* Completion Progress */}
                                                <div className="hidden sm:flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                        <span className="text-12 font-normal text-gray-700">
                                                            {
                                                                data.items.filter(i => i.iscompleted)
                                                                    .length
                                                            }
                                                            /{data.items.length}
                                                        </span>
                                                    </div>
                                                    <div className="w-28 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${
                                                                    (data.items.filter(i => i.iscompleted)
                                                                        .length /
                                                                        data.items.length) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <ChevronRight
                                                    className={cn(
                                                        'w-5 h-5 md:w-6 md:h-6 text-gray-500 transition-transform duration-300',
                                                        isExpanded ? 'rotate-90' : 'rotate-0'
                                                    )}
                                                />
                                            </div>
                                        </button>
                                        {/* Accordion Body */}
                                        {isExpanded && (
                                            <div className="border-t border-gray-100 p-6 md:p-8 space-y-4 md:space-y-6">
                                                {data.items.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className={cn(
                                                            'group relative bg-white border rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-lg',
                                                            item.iscompleted
                                                              ? 'border-green-300 bg-gradient-to-br from-green-50/50 to-white'
                                                              : 'border-gray-200 hover:border-brand-200'
                                                        )}
                                                    >
                                                        {/* Status Badge */}
                                                        {item.iscompleted && (
                                                            <div className="absolute top-5 right-5 bg-green-500 text-white px-4 py-1.5 rounded-full text-12 font-normal flex items-center gap-2 shadow-sm">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                Completed
                                                            </div>
                                                        )}

                                                        <div className="flex flex-col sm:flex-row gap-5 md:gap-7">
                                                            {/* Left Section - Checkbox and Main Info */}
                                                            <div className="flex gap-5 flex-1 min-w-0">
                                                                {/* Checkbox */}
                                                                <div className="flex-shrink-0 pt-1">
                                                                    <Checkbox
                                                                        checked={item.iscompleted}
                                                                        onChange={() =>
                                                                            toggleComplete(item.id)
                                                                        }
                                                                        size="md"
                                                                        variant={
                                                                            item.iscompleted
                                                                                ? 'successFilled'
                                                                                : 'gray'
                                                                        }
                                                                        shape="square"
                                                                        className="cursor-pointer"
                                                                    />
                                                                </div>

                                                                {/* Main Content */}
                                                                <Link
                                                                    href={`${ITEM_DETAILS_BASE_PATH}/${item.id}`}
                                                                    className="flex-1 min-w-0"
                                                                >
                                                                    {/* Item Name */}
                                                                    <div className="flex items-start gap-2 mb-4">
                                                                        <h4
                                                                            className={cn(
                                                                                'text-18 md:text-20 font-normal text-gray-900',
                                                                                item.iscompleted &&
                                                                                    'line-through text-gray-400'
                                                                            )}
                                                                        >
                                                                            {item.name}
                                                                        </h4>
                                                                    </div>

                                                                    {/* Description */}
                                                                    {item.description && (
                                                                        <p className="text-14 md:text-15 text-gray-600 mb-4 line-clamp-2">
                                                                            {item.description}
                                                                        </p>
                                                                    )}

                                                                    {/* Info Grid */}
                                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                                                                        {/* Buy Date */}
                                                                        <div className="flex items-center gap-2 text-13 md:text-14 text-gray-600">
                                                                            <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0" />
                                                                            <span className="truncate">
                                                                                {new Date(
                                                                                    item.buyDate
                                                                                ).toLocaleDateString(
                                                                                    'en-US',
                                                                                    {
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                        year: 'numeric',
                                                                                    }
                                                                                )}
                                                                            </span>
                                                                        </div>

                                                                        {/* Seller */}
                                                                        {item.seller && (
                                                                            <div className="flex items-center gap-2 text-13 md:text-14 text-gray-600">
                                                                                <Store className="w-4 h-4 text-brand-500 flex-shrink-0" />
                                                                                <span className="truncate">
                                                                                    {item.seller}
                                                                                </span>
                                                                            </div>
                                                                        )}

                                                                        {/* Category Badge */}
                                                                        <div className="hidden sm:flex items-center">
                                                                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-12 font-normal bg-gray-100 text-gray-700">
                                                                                {item.category}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Payment Progress */}
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between text-12 md:text-13 text-gray-600">
                                                                            <span>Payment Progress</span>
                                                                            <span className="font-normal">
                                                                                {Math.round(
                                                                                    (item.advancePayment /
                                                                                        item.totalCost) *
                                                                                        100
                                                                                )}
                                                                                %
                                                                            </span>
                                                                        </div>
                                                                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                                            <div
                                                                                className={cn(
                                                                                    'h-full rounded-full transition-all duration-500',
                                                                                    item.remaining === 0
                                                                                        ? 'bg-green-500'
                                                                                        : 'bg-brand-500'
                                                                                )}
                                                                                style={{
                                                                                    width: `${
                                                                                        (item.advancePayment /
                                                                                            item.totalCost) *
                                                                                        100
                                                                                    }%`,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="flex items-center justify-between text-11 md:text-12 text-gray-500">
                                                                            <span>
                                                                                Paid:{' '}
                                                                                <span className="font-normal text-green-600">
                                                                                    {item.advancePayment.toLocaleString()}
                                                                                </span>
                                                                            </span>
                                                                            <span>
                                                                                Remaining:{' '}
                                                                                <span className="font-normal text-gray-700">
                                                                                    {item.remaining.toLocaleString()}
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>

                                                            {/* Right Section - Cost and Quantity */}
                                                            <div className="flex sm:flex-col items-center gap-5 sm:gap-4 flex-shrink-0">
                                                                {/* Total Cost */}
                                                                <div className="text-center">
                                                                    <div className="text-11 md:text-12 text-gray-500 mb-2">
                                                                        Total Cost
                                                                    </div>
                                                                    <div className="flex items-baseline justify-center gap-1.5">
                                                                        <DollarSign className="w-5 h-5 text-brand-500" />
                                                                        <span className="text-20 md:text-24 font-normal text-gray-900">
                                                                            {item.totalCost.toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Buttons inside accordion */}
                                                <div className="flex justify-end gap-4 pt-5 border-t border-gray-100">
                                                    <Link href={ADD_NEW_ITEM_PATH}>
                                                        <Button
                                                            variant="brand"
                                                            size="md"
                                                            className="gap-2 font-normal text-white"
                                                        >
                                                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                                            <span className="hidden sm:inline">Add Item</span>
                                                        </Button>
                                                    </Link>

                                                    <Button variant="outline" size="md" className="gap-2 font-normal text-white bg-brand-500 border-brand-500 hover:bg-brand-600">
                                                        <List className="w-4 h-4 md:w-5 md:h-5" />
                                                        <span className="hidden sm:inline">View List</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>


                        {/* Add New Item — bottom button */}
                        <div className="mt-8 text-center">
                          <Button variant="brand" size="lg" onClick={handleAddNewCategory} className="text-white">
                              <Plus className="w-5 h-5 mr-2" />
                              Add new Item
                          </Button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
