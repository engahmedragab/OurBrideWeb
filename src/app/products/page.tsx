'use client'

import { useMemo } from 'react'
import { HeroCarousel, OfferBanner } from '@/components/ui'
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
import { useStoreHome } from '@/hooks/home'
import { useProductsHome } from '@/hooks/products'
import { extractStoreHomeData } from '@/utils/home-data.utils'
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

  // Map API categories to component format
  const categoryIconMap = getCategoryIconMap()
  const mappedCategories: CategoryType[] = useMemo(() => {
    return categories.map(category => ({
      id: String(category.id),
      title: category.name,
      description: 'Exclusive coupons and discounts designed for your budget.',
      href: `/products/category/${category.slug || category.id}`,
      icon: categoryIconMap[category.slug || ''] || categoryIconMap.default,
    }))
  }, [categories, categoryIconMap])

  // Map API banners to hero carousel format
  const mappedHeroSlides = useMemo(() => {
    if (apiBanners.length > 0) {
      return apiBanners.slice(0, MAX_HERO_SLIDES).map((banner, index) => ({
        id: String(index + 1),
        label: 'Featured',
        title: banner.heading,
        description: banner.description || '',
        ctaText: banner.ctaText || 'Shop Now',
        ctaLink: banner.ctaLink || '/products',
        productImage:
          typeof banner.productImage === 'string'
            ? banner.productImage
            : 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600',
        discountText: '',
      }))
    }
    return DEFAULT_HERO_SLIDES
  }, [apiBanners])

  // Use products from products home endpoint
  const displayProducts = useMemo(() => {
    return productsHomeData?.products?.slice(0, DEFAULT_HOME_PRODUCTS_COUNT) || []
  }, [productsHomeData?.products])

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

  const handleAddToCart = (_productId: string) => {
    // TODO: Implement add to cart
  }

  const handleSubscribe = (_email: string) => {
    // TODO: Implement newsletter subscription
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
          <div className="mb-12">
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
            />
          </div>
        </div>
    </ProductPageLayout>
  )
}

