'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { HeroCarousel, OfferBanner, LoadingSpinner, useToast } from '@/components/ui'
import { useMemo, useCallback } from 'react'
import {
  ProductCategoriesSection,
  ProductOffersSection,
  WhyBridesChooseProductsSection,
  BestProvidersSection,
} from '@/components/products'
import type {
  ProductCategory as CategoryType,
  Provider as BestProviderType,
  ProviderProduct as BestProviderProductType,
} from '@/components/products'
import { useAddProductToCart } from '@/hooks/products'
import { useStoreHome } from '@/hooks/home'
import { useProductsHome } from '@/hooks/products'
import { extractStoreHomeData } from '@/utils/home-data.utils'
import { handleApiResponseForToast } from '@/utils/api-response.utils'
import type { Product } from '@/types/product'
import flowersImage from '@/assets/images/flowers.png'
import whyBridesChooseProductsImage from '@/assets/images/bridProductSection.png'
import { ProductPageLayout } from './components/ProductPageLayout'
import {
  DEFAULT_HERO_SLIDES,
  PRODUCT_FEATURES,
  MAX_HERO_SLIDES,
  DEFAULT_HOME_PRODUCTS_COUNT,
} from './constants'
import { getCategoryIconMap } from './utils/category-icons'

export default function ProductIntroPage() {
  const { addToast } = useToast()
  // Fetch data from store home endpoint (getHomeGetStoreHome) - for banners
  const { data: storeHomeData, isLoading: storeHomeLoading } = useStoreHome()

  // Fetch data from products home endpoint (getProductGetProductsHome) - for categories and products
  const { data: productsHomeData, isLoading: productsHomeLoading } = useProductsHome()

  // Extract and map data from store home API (for banners)
  const storeData = useMemo(() => {
    if (storeHomeData) {
      return extractStoreHomeData(storeHomeData)
    }
    return {}
  }, [storeHomeData])

  // Use products home data for categories
  const categories = useMemo(() =>
    productsHomeData?.categories || [],
    [productsHomeData?.categories]
  )

  const apiBanners = useMemo(() => storeData.banners || [], [storeData.banners])
  const apiProvidersData = useMemo(() => storeData.providers || [], [storeData.providers])

  const isLoading = storeHomeLoading || productsHomeLoading

  // Map API categories to component format - memoize icon map
  const categoryIconMap = useMemo(() => getCategoryIconMap(), [])
  const mappedCategories: CategoryType[] = useMemo(() => {
    return categories.map(category => ({
      id: String(category.id),
      title: category.nameEn || category.nameAr || '',
      description: 'Exclusive coupons and discounts designed for your budget.',
      href: `/products/category/${category.slug || category.id}`,
      icon: categoryIconMap[category.slug || ''] || categoryIconMap.default,
    }))
  }, [categories, categoryIconMap])

  // Map API banners to hero carousel format - use same images as category page
  const mappedHeroSlides = useMemo(() => {
    if (apiBanners.length > 0) {
      return apiBanners.slice(0, MAX_HERO_SLIDES).map((banner, index) => {
        // Use the same images from DEFAULT_HERO_SLIDES based on index
        const defaultSlide = DEFAULT_HERO_SLIDES[index % DEFAULT_HERO_SLIDES.length]
        return {
          id: String(index + 1),
          label: banner.heading ? 'Featured' : defaultSlide.label,
          title: banner.heading || defaultSlide.title,
          description: banner.description || defaultSlide.description,
          ctaText: banner.ctaText || defaultSlide.ctaText,
          ctaLink: banner.ctaLink || defaultSlide.ctaLink,
          productImage: defaultSlide.productImage, // Use same images as category page
          discountText: banner.offerPercentage ? `${banner.offerPercentage}% OFF` : defaultSlide.discountText || '',
        }
      })
    }
    return DEFAULT_HERO_SLIDES
  }, [apiBanners])

  // Use products from products home endpoint (headers contains ProductHeaderResponse[])
  // Map ProductHeaderResponse to Product type
  const displayProducts = useMemo(() => {
    if (!productsHomeData?.headers) return []
    
    return productsHomeData.headers.slice(0, DEFAULT_HOME_PRODUCTS_COUNT).map((header): Product => ({
      id: String(header.id),
      title: header.name || header.nameEn || header.nameAr || '',
      description: header.shortDescription || header.bio || '',
      images: header.image ? [header.image] : [],
      provider: {
        id: header.providerId ? String(header.providerId) : '',
        name: header.provider?.nameEn || header.provider?.nameAr || '',
        verified: false,
        image: header.provider?.profileURL || undefined,
      },
      price: {
        original: header.regularPrice || header.price || 0,
        discounted: header.salePrice || header.price || 0,
        currency: 'USD', // Default currency, adjust if available in response
      },
      rating: {
        value: parseFloat(header.rate) || 0,
        count: header.ratingCount || 0,
      },
      category: {
        id: String(header.categoryId),
        name: '',
        slug: '',
      },
      tags: [],
      inStock: header.inStock,
      stockQuantity: header.stockQuantity || undefined,
      sku: header.sku,
    }))
  }, [productsHomeData?.headers])

  // Map providers to BestProvidersSection format
  const mappedProviders: BestProviderType[] = useMemo(() => {
    if (apiProvidersData.length === 0 || displayProducts.length === 0) {
      return []
    }

    return apiProvidersData.slice(0, 6).map((provider, index) => {
      // Find a product for this provider (try to match by provider, or use a product from the list)
      const productIndex = index % displayProducts.length
      const featuredProduct = displayProducts[productIndex]

      const providerProduct: BestProviderProductType = {
        id: featuredProduct.id,
        title: featuredProduct.title,
        image: featuredProduct.images?.[0] || '',
        rating: featuredProduct.rating?.value || 0,
        price: featuredProduct.price?.discounted || featuredProduct.price?.original || 0,
        currency: featuredProduct.price?.currency || 'USD',
        href: `/products/${featuredProduct.id}`,
      }

      return {
        id: provider.id,
        name: provider.name,
        image: provider.image,
        profession: provider.profession,
        verified: provider.verified || false,
        rating: provider.rating,
        product: providerProduct,
      }
    })
  }, [apiProvidersData, displayProducts])

  const handleWishlistToggle = (_productId: string) => {
    // TODO: Implement wishlist toggle
  }

  const { handleAddToCart: addToCart } = useAddProductToCart()

  const handleAddToCart = useCallback(
    async (productId: string) => {
      // Find the product from displayProducts
      const product = displayProducts.find(p => p.id === productId)
      if (!product) return

      try {
        const response = await addToCart(product, 1)
        const { message, type } = handleApiResponseForToast(
          response,
          'Product added to cart successfully!',
          'Failed to add product to cart'
        )
        addToast(message, type)
      } catch (error) {
        console.error('Failed to add product to cart:', error)
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to add product to cart. Please try again.'
        addToast(errorMessage, 'error')
      }
    },
    [displayProducts, addToCart, addToast]
  )

  const handleSubscribe = (_email: string) => {
    // TODO: Implement newsletter subscription
  }

  // Show loading state
  if (storeHomeLoading || productsHomeLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-white flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading products..." fullScreen={true} />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <ProductPageLayout isLoading={isLoading} loadingText="Loading products...">
      {/* Hero Carousel */}
      <HeroCarousel
        slides={mappedHeroSlides}
        autoPlay={true}
        autoPlayInterval={5000}
        showBackground={false}
      />

      {/* Consistent container wrapper for all other sections */}
      <div className="container-custom">
        {/* 2) ProductCategoriesSection */}
        {mappedCategories.length > 0 && (
          <ProductCategoriesSection
            categories={mappedCategories}
            topText="Choose"
            highlightText="From"
            bottomText="Our Product"
            bottomHighlightText="Categories"
            headerAlignment="center"
          />
        )}

        {/* 3) ProductOffersSection */}
        {displayProducts.length > 0 && (
          <ProductOffersSection
            products={displayProducts}
            timerText="23 H 45 Min"
            title="Today's Best Product Offers"
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* 4) WhyBridesChooseProductsSection */}
        <WhyBridesChooseProductsSection
          image={whyBridesChooseProductsImage}
          features={PRODUCT_FEATURES}
          topText="Why"
          highlightText="Brides"
          bottomText="Choose"
          bottomHighlightText="OurBride Products"
          headerAlignment="center"
        />

        {/* 5) BestProvidersSection */}
        {mappedProviders.length > 0 && (
          <BestProvidersSection
            providers={mappedProviders}
            topText="Best"
            highlightText="Providers"
            bottomText="With"
            bottomHighlightText="Best Products"
            headerAlignment="center"
            buttonText="Explore Now"
          />
        )}

        {/* 6) Newsletter Banner */}
        <div className="py-8 md:py-12">
          <OfferBanner
            offers={[
              {
                heading: 'Get Products Updates & Offers',
                description:
                  'Stay informed about new providers, offers, and wedding planning tips',
                variant: 'newsletter',
                ctaText: 'Subscribe',
                productImage: flowersImage,
              },
            ]}
            onSubscribe={handleSubscribe}
            noContainer={true}
          />
        </div>
      </div>
    </ProductPageLayout>
  )
}

