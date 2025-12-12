'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib'
import { CheckSquare, ChevronRight, List, Plus } from 'lucide-react'
import Link from 'next/link';
import { Button, Checkbox, NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/Components/ui';


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
const ADD_NEW_ITEM_PATH = '/planning/items/new';
const ITEM_DETAILS_BASE_PATH = '/planning/items';


export default function ItemsPage() {
const [items, setItems] = useState(INITIAL_ITEMS);

    // 1. Unique Categories
    const uniqueCategories = useMemo(() => {
        const cats = items.map(item => item.category);
        return ['All', ...new Set(cats)];
    }, [items]);


    // States
    const [categoriesList, setCategoriesList] = useState<string[]>(uniqueCategories);
    
    const [editingCategory, setEditingCategory] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const [activeCategory, setActiveCategory] = useState('All');
    const [expandedCategory, setExpandedCategory] = useState('All');


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
    const groupedItems = useMemo(() => {
        return filteredItems.reduce((groups, item) => {
            const category = item.category;

            if (!groups[category]) {
                groups[category] = {
                    totalItems: 0,
                    items: []
                };
            }

            groups[category].items.push(item);
            groups[category].totalItems += item.quantity || 0;

            return groups;
        }, {});
    }, [filteredItems]);

    const categoriesArray = Object.entries(groupedItems);


    // 5. Handlers
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setExpandedCategory(category);
    };

    const handleToggleExpand = (category) => {
        setExpandedCategory(prev =>
            prev === category ? null : category
        );
    };

    const toggleComplete = (id) => {
    setItems(prev =>
        prev.map(item =>
            item.id === id
                ? { ...item, iscompleted: !item.iscompleted }
                : item
        )
      );
    }
    const handleAddNewCategory = () => {
        const newCategoryName = 'New Category';
        
        // 1. Add a temporary category name to the list
        setCategoriesList(prevList => [...prevList, newCategoryName]);

        // 2. Set the state to indicate we are editing/naming the new category
        setEditingCategory(newCategoryName); 
    };

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
                          "px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200 cursor-pointer",
                          isActive
                            ? 'bg-brand-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
                <div className="flex flex-col items-center p-4 bg-white border-b shadow-sm">
                    <div className="flex gap-2 text-center">
                        <div className="bg-white rounded-lg p-3 shadow-md border-b-4">
                            <p className="text-xs text-gray-500">Count</p>
                            <p className="text-xl font-bold text-brand-600 mt-1">{filteredItems.length}</p>
                        </div>

                        <div className="bg-white rounded-lg p-3 shadow-md border-b-4">
                            <p className="text-xs text-gray-500">Completed</p>
                            <p className="text-xl font-bold text-gbrandreen-600 mt-1">{completedCount}</p>
                        </div>

                        <div className="bg-white rounded-lg p-3 shadow-md border-b-4">
                            <p className="text-xs text-gray-500">Remaining</p>
                            <p className="text-xl font-bold text-brand-600 mt-1">{remainingCount}</p>
                        </div>
                    </div>


                    {/* ---------- Category Title ----------- */}
                    <div className="mt-4">
                        <h3 className="text-sm font-medium">Items in {activeCategory}:</h3>
                    </div>


                    {/* ---------- ACCORDION GROUPS ----------- */}
                    <div className="p-4 max-w-lg mx-auto w-full">
                        <div className="space-y-4">
                            {categoriesArray.map(([categoryName, data]) => {
                                const isExpanded = categoryName === expandedCategory;
                                
                                return (
                                    <div
                                        key={categoryName}
                                        className={cn(
                                            "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300",
                                            isExpanded ? 'border border-brand-200' : 'border border-transparent'
                                        )}
                                    >

                                        {/* Accordion Header */}
                                      <div className="space-y-2 ">
                                        <button
                                            onClick={() => handleToggleExpand(categoryName)}
                                            className={cn(
                                                "flex items-center justify-between w-full p-4 transition-colors",
                                                isExpanded ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
                                            )}
                                        >
                                            <span className="text-base font-medium text-gray-600">
                                                {categoryName}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-brand-600 font-bold text-lg">{data.totalItems} Item</span>
                                                <ChevronRight
                                                    className={cn(
                                                        "w-5 h-5 text-gray-500 transition-transform duration-300",
                                                        isExpanded ? 'rotate-90' : 'rotate-0'
                                                    )}
                                                />
                                            </div>
                                        </button>
                                      </div>
                                        {/* Accordion Body */}
                                        {isExpanded && (
                                            <div className="border-t border-gray-100 p-4 space-y-3">
                                                {data.items.map((item) => (
                                                
                                                <div key={item.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-3 pr-0">

                                                    <div className="flex items-center space-x-3">
                                                       <Checkbox
                                                          checked={item.iscompleted}
                                                          onChange={() => toggleComplete(item.id)}
                                                          size="md"
                                                          variant={item.iscompleted ? "successFilled" : "gray"}
                                                          shape="square"
                                                          className="cursor-pointer"
                                                        />
                                                    </div>

                                                    <Link
                                                      href={`${ITEM_DETAILS_BASE_PATH}/${item.id}`}
                                                      className="flex justify-between items-center flex-1 ml-3 p-2 rounded-lg transition-all hover:bg-gray-50 hover:shadow-sm"
                                                    >
                                                      {/* LEFT SIDE (name + buy date) */}
                                                      <div>
                                                        <span className="text-base font-medium text-gray-800 block">
                                                          {item.name}
                                                        </span>

                                                        <span className="text-xs text-brand-600 block mt-0.5">
                                                          Buy Date: <span className="text-gray-500">{item.buyDate}</span>
                                                        </span>
                                                      </div>

                                                      {/* RIGHT SIDE (paid + remaining + quantity) */}
                                                      <div className="flex items-center space-x-3">
                                                        <div className="text-right">
                                                          <span className="text-xs text-brand-600 block">
                                                            Paid: {item.advancePayment}
                                                          </span>
                                                          <span className="text-xs text-gray-500 block">
                                                            Remaining: {item.remaining}
                                                          </span>
                                                        </div>

                                                        <div className="bg-brand-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">
                                                          {item.quantity}
                                                        </div>
                                                      </div>
                                                    </Link>
                                                </div>
                                                
                                                ))}

                                                {/* Buttons inside accordion */}
                                                <div className="flex justify-end space-x-4 pt-2">
                                                    <Link href={ADD_NEW_ITEM_PATH}>
                                                        <Button variant={"brand"} size={"sm"} className='text-white'>
                                                            <Plus className="w-5 h-5" />
                                                        </Button>
                                                    </Link>

                                                    <Button variant={"outline"} size={"sm"}>
                                                        <List className="w-4 h-4" />
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
                          <Button variant={"brand"} size={'xl'} className='text-white' onClick={handleAddNewCategory}>
                              <Plus className="w-6 h-6 mr-2" />
                              Add new Item
                          </Button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
