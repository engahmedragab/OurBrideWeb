'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Button, Badge, ProductImageGallery } from '@/components/ui'
import {
  Heart,
  ShoppingCart,
  Star,
  CheckCircle2,
  Share2,
  Minus,
  Plus,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

// Mock data - Replace with API call
const mockProduct: Product = {
  id: '1',
  title: 'Essential Wedding Cream',
  description:
    'Premium quality wedding cream for bridal beauty. Perfect for your special day.',
  longDescription:
    'This essential wedding cream is specially formulated for brides who want to look their absolute best on their special day. Made with premium ingredients, it provides long-lasting hydration and a radiant glow. Perfect for all skin types, this cream ensures your skin looks flawless in photos and throughout your wedding celebration.',
  images: [
    'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800',
    'https://images.unsplash.com/photo-1583241801824-9055b66b9d29?w=800',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
  ],
  provider: {
    id: '1',
    name: 'YUNJAC',
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  price: {
    original: 6000,
    discounted: 4500,
    currency: 'egp',
  },
  rating: {
    value: 4.5,
    count: 128,
  },
  category: {
    id: '1',
    name: 'Makeup',
    slug: 'makeup',
  },
  tags: ['Makeup', 'Body Care', 'Wedding', 'Premium'],
  inStock: true,
  stockQuantity: 50,
  sku: 'WWC-001',
  specifications: [
    { label: 'Brand', value: 'YUNJAC' },
    { label: 'Size', value: '100ml' },
    { label: 'Type', value: 'Cream' },
    { label: 'Skin Type', value: 'All Types' },
  ],
  isWishlisted: false,
  showTopOfferBadge: true,
}

export default function ProductDetail({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(mockProduct)

  // Fetch product based on id - Replace with API call
  useEffect(() => {
    if (id) {
      // TODO: Replace with actual API call
      // const fetchProduct = async () => {
      //   const data = await getProductById(id)
      //   setProduct(data)
      // }
      // fetchProduct()
      setProduct(mockProduct)
    }
  }, [id])

  const hasDiscount = product.price.discounted < product.price.original
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price.original - product.price.discounted) /
          product.price.original) *
          100
      )
    : 0

  const handleWishlistToggle = () => {
    setProduct({ ...product, isWishlisted: !product.isWishlisted })
  }

  const handleAddToCart = () => {
    // TODO: Implement add to cart
    console.log('Add to cart:', product.id, quantity)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product.stockQuantity || 99)))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-6 md:py-8">
          {/* Back Button */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-14 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <div>
              <ProductImageGallery
                images={product.images}
                productName={product.title}
              />
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.showTopOfferBadge && (
                    <Badge
                      variant="default"
                      className="bg-brand-500 !text-white border-0 px-3 py-1 text-12 font-normal rounded-full"
                    >
                      Top Offers
                    </Badge>
                  )}
                  {hasDiscount && (
                    <Badge
                      variant="default"
                      className="bg-red-500 !text-white border-0 px-2 py-1 text-12 font-semibold"
                    >
                      -{discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
                <h1 className="text-32 md:text-40 font-black text-gray-900 mb-3">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-brand-500 text-brand-500" />
                    <span className="text-18 font-semibold text-gray-900">
                      {product.rating.value}
                    </span>
                    <span className="text-14 text-gray-500">
                      ({product.rating.count} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Provider */}
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <span className="text-16 text-gray-700">Provider:</span>
                <div className="flex items-center gap-2">
                  <span className="text-16 font-semibold text-gray-900">
                    {product.provider.name}
                  </span>
                  {product.provider.verified && (
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {hasDiscount && (
                    <span className="text-20 font-normal text-gray-400 line-through">
                      {product.price.original.toLocaleString()}{' '}
                      {product.price.currency}
                    </span>
                  )}
                  <span className="text-32 md:text-40 font-black text-gray-900">
                    {product.price.discounted.toLocaleString()}{' '}
                    {product.price.currency}
                  </span>
                </div>
                {product.inStock ? (
                  <p className="text-14 text-green-600 font-medium">
                    In Stock ({product.stockQuantity} available)
                  </p>
                ) : (
                  <p className="text-14 text-red-600 font-medium">
                    Out of Stock
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-18 font-semibold text-gray-900">
                  Description
                </h3>
                <p className="text-16 text-gray-600 leading-relaxed">
                  {product.longDescription || product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div className="space-y-3">
                  <h3 className="text-18 font-semibold text-gray-900">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-12 text-gray-500">{spec.label}</span>
                        <span className="text-14 font-medium text-gray-900">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-12 px-3 py-1 border-gray-200 text-gray-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-16 font-semibold text-gray-900">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-16 font-semibold text-gray-900 w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={
                        quantity >= (product.stockQuantity || 99)
                      }
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1 h-12 rounded-full bg-brand-500 hover:bg-brand-600 text-white"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-12 rounded-full border-gray-300"
                    onClick={handleWishlistToggle}
                    aria-label={
                      product.isWishlisted
                        ? 'Remove from wishlist'
                        : 'Add to wishlist'
                    }
                  >
                    <Heart
                      className={cn(
                        'h-5 w-5',
                        product.isWishlisted
                          ? 'fill-brand-500 text-brand-500'
                          : ''
                      )}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-12 rounded-full border-gray-300"
                    aria-label="Share product"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

