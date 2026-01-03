'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    Grid3x3,
    Sparkles,
    Building2,
    Flower2,
    Cake,
    Camera,
    Shirt,
    Crown,
    Heart,
    Music,
    Car,
    UtensilsCrossed,
    Palette,
    Scissors,
    Gem,
    type LucideIcon,
} from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'
import { Input } from './Input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PreparationResponse } from '@/types/responses/preparation-response'

export interface PreparationCategory {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    value: string
}

/**
 * Map service names to Lucide icons
 */
const getServiceIcon = (serviceName: string): LucideIcon => {
    const name = serviceName.toLowerCase().trim()
    
    // Bridal & Beauty
    if (name.includes('bridal') || name.includes('beauty') || name.includes('makeup') || name.includes('salon')) {
        return Sparkles
    }
    
    // Wedding Hall / Venue
    if (name.includes('hall') || name.includes('venue') || name.includes('location') || name.includes('place')) {
        return Building2
    }
    
    // Bouquet / Flowers
    if (name.includes('bouquet') || name.includes('flower') || name.includes('floral')) {
        return Flower2
    }
    
    // Wedding Cake
    if (name.includes('cake') || name.includes('dessert') || name.includes('sweet')) {
        return Cake
    }
    
    // Photography / Videography
    if (name.includes('photo') || name.includes('video') || name.includes('camera') || name.includes('film')) {
        return Camera
    }
    
    // Wedding Suit / Men's Wear
    if (name.includes('suit') || name.includes('tuxedo') || name.includes('men') || name.includes('groom')) {
        return Shirt
    }
    
    // Wedding Dress / Bridal Wear
    if (name.includes('dress') || name.includes('gown') || name.includes('bridal wear')) {
        return Heart
    }
    
    // Accessories / Jewelry
    if (name.includes('accessor') || name.includes('jewelry') || name.includes('jewellery') || name.includes('ring')) {
        return Crown
    }
    
    // Music / DJ / Entertainment
    if (name.includes('music') || name.includes('dj') || name.includes('entertainment') || name.includes('band')) {
        return Music
    }
    
    // Transportation
    if (name.includes('car') || name.includes('transport') || name.includes('vehicle') || name.includes('limousine')) {
        return Car
    }
    
    // Catering / Food
    if (name.includes('catering') || name.includes('food') || name.includes('restaurant') || name.includes('dining')) {
        return UtensilsCrossed
    }
    
    // Decoration / Design
    if (name.includes('decoration') || name.includes('design') || name.includes('decor')) {
        return Palette
    }
    
    // Hair / Styling
    if (name.includes('hair') || name.includes('styling') || name.includes('stylist')) {
        return Scissors
    }
    
    // Default icon
    return Gem
}

export interface PreparationCategorySelectProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
    preparations?: PreparationResponse[]
    isLoading?: boolean
}

/**
 * PreparationCategorySelect Component
 * Dropdown select for preparation categories with icons
 */
export const PreparationCategorySelect = ({
    value = '',
    onChange,
    placeholder = 'Preparations or venue',
    className,
    preparations = [],
    isLoading = false,
}: PreparationCategorySelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    // Map API preparations to PreparationCategory format
    const preparationCategories = useMemo(() => {
        const allOption: PreparationCategory = {
            id: 'all',
            label: 'All preparations',
            icon: Grid3x3,
            value: '',
        }

        const mappedPreparations: PreparationCategory[] = preparations.map((prep) => {
            const name = prep.nameEn || prep.nameAr || 'Unknown'
            const icon = getServiceIcon(name)
            
            return {
                id: String(prep.id),
                label: name,
                icon,
                value: String(prep.id),
            }
        })

        return [allOption, ...mappedPreparations]
    }, [preparations])

    const selectedCategory = preparationCategories.find(cat => cat.value === value) || preparationCategories[0]

    const handleSelect = (category: PreparationCategory) => {
        if (onChange) {
            onChange(category.value)
        }
        setIsOpen(false)

        // Navigate to search with category filter
        if (category.value) {
            router.push(`/providers/search?category=${category.value}`)
        } else {
            router.push('/providers/search')
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className="flex-1 min-w-0">
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={selectedCategory.label}
                        readOnly
                        prefixIcon={Search}
                        variant="fill"
                        size="lg"
                        className={cn('h-12 cursor-pointer', className)}
                        onClick={() => setIsOpen(true)}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                sideOffset={8}
                className="w-[320px] sm:w-[380px] p-0 bg-white border border-gray-200 rounded-xl shadow-xl"
            >
                <div className="max-h-[500px] overflow-y-auto">
                    {/* All Preparations Option */}
                    <button
                        onClick={() => handleSelect(preparationCategories[0])}
                        className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100',
                            selectedCategory.id === 'all' && 'bg-brand-50'
                        )}
                    >
                        <Grid3x3 className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <span className="text-16 font-medium text-gray-900">All preparations</span>
                    </button>

                    {/* Top Categories Heading */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <h3 className="text-14 font-bold text-gray-900">Top categories</h3>
                    </div>

                    {/* Category List */}
                    {isLoading ? (
                        <div className="py-8 flex items-center justify-center">
                            <span className="text-14 text-gray-600">Loading preparations...</span>
                        </div>
                    ) : preparationCategories.length > 1 ? (
                        <div className="py-2">
                            {preparationCategories.slice(1).map((category) => {
                                const Icon = category.icon
                                const isSelected = selectedCategory.id === category.id

                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleSelect(category)}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left',
                                            isSelected && 'bg-brand-50'
                                        )}
                                    >
                                        <Icon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                                        <span className="text-16 text-gray-900">{category.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-8 flex items-center justify-center">
                            <span className="text-14 text-gray-600">No preparations available</span>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

