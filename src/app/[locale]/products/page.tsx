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
import flowersRight from '@/assets/images/flowersRight.png'
import whyBridesChooseProductsImage from '@/assets/images/bridProductSection.png'
import { ProductPageLayout } from './components/ProductPageLayout'
import {
  DEFAULT_HERO_SLIDES,
  PRODUCT_FEATURES,
  MAX_HERO_SLIDES,
  DEFAULT_HOME_PRODUCTS_COUNT,
} from './constants'
import { getCategoryIconMap } from './utils/category-icons'
import { useI18nTranslations, useIsRTL, useLocale } from '@/i18n'

export default function ProductIntroPage() {
  const { addToast } = useToast()
 
  // localization
  const t = useI18nTranslations('products')
  const tCommon = useI18nTranslations('common')
  const isRTL = useIsRTL()
  const locale = useLocale()

  // Fetch data from store home endpoint (getHomeGetStoreHome) - for banners
  const { data: storeHomeData, isLoading: storeHomeLoading } = useStoreHome()

  // Fetch data from products home endpoint (getProductGetProductsHome) - for categories and products
  const { data: productsHomeData, isLoading: productsHomeLoading } = useProductsHome()
  
  // Extract and map data from store home API (for banners)
  const storeData = useMemo(() => {
    if (storeHomeData) {
      return extractStoreHomeData(storeHomeData, locale)
    }
    return {}
  }, [storeHomeData, locale])

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
      description: t('exclusiveCoupons.text'),
      href: `/products/category/${category.slug || category.id}`,
      icon: categoryIconMap[category.slug || ''] || categoryIconMap.default,
    }))
  }, [categories, categoryIconMap, t])

  // Get translated hero slides
  const translatedHeroSlides = useMemo(() => {
    return DEFAULT_HERO_SLIDES.map((slide, index) => {
      const slideKey = `slide${index + 1}` as 'slide1' | 'slide2'
      return {
        ...slide,
        label: t(`productHeroSlides.${slideKey}.label`),
        title: t(`productHeroSlides.${slideKey}.title`),
        description: t(`productHeroSlides.${slideKey}.description`),
        ctaText: t(`productHeroSlides.${slideKey}.ctaText`),
      }
    })
  }, [t])

  // Map API banners to hero carousel format - use same images as category page
  const mappedHeroSlides = useMemo(() => {
    if (apiBanners.length > 0) {
      return apiBanners.slice(0, MAX_HERO_SLIDES).map((banner, index) => {
        // Use the same images from translated hero slides based on index
        const defaultSlide = translatedHeroSlides[index % translatedHeroSlides.length]
        return {
          id: String(index + 1),
          labelAr: banner.headingAr ? tCommon('productCommon.featured') : defaultSlide.label,
          labelEn: banner.headingEn ? tCommon('productCommon.featured') : defaultSlide.label,
          title: banner.heading || defaultSlide.title,
          descriptionAr: banner.descriptionAr || defaultSlide.description,
          descriptionEn: banner.descriptionEn || defaultSlide.description,
          ctaText: banner.ctaText || defaultSlide.ctaText,
          ctaLink: banner.ctaLink || defaultSlide.ctaLink,
          productImage: defaultSlide.productImage, // Use same images as category page
          discountText: banner.offerPercentage ? `${banner.offerPercentage}${tCommon('productCommon.percentOff')}` : defaultSlide.discountText || '',
        }
      })
    }
    return translatedHeroSlides
  }, [apiBanners, tCommon, translatedHeroSlides])

  // Use products from products home endpoint (headers contains ProductHeaderResponse[])
  // Map ProductHeaderResponse to Product type
  const displayProducts = useMemo(() => {
    if (!productsHomeData?.headers) return []
    
    return productsHomeData.headers.slice(0, DEFAULT_HOME_PRODUCTS_COUNT).map((header): Product => ({
      id: String(header.id),
      nameAr: header.nameAr || header.nameEn || '',
      nameEn: header.nameEn || header.nameAr || '',
      descriptionAr:  header.shortDescriptionAr || header.shortDescriptionEn || header.shortDescription,
      descriptionEn: header.shortDescriptionEn ||  header.shortDescriptionAr,
      images: header.image ? [header.image] : [],
      provider: {
        id: header.providerId ? String(header.providerId) : '',
        nameAr:header.provider?.nameAr || header.provider?.nameEn || '',
        nameEn: header.provider?.nameEn || header.provider?.nameAr || '',
        verified: false,
        image: header.provider?.profileURL || undefined,
      },
      price: {
        original: header.regularPrice || header.price || 0,
        discounted: header.salePrice || header.price || 0,
        currency: tCommon('productCommon.currencyUSD'),
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
  }, [productsHomeData?.headers, isRTL])
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
        nameAr: featuredProduct.nameAr,
        nameEn: featuredProduct.nameEn,
        image: featuredProduct.images?.[0] || '',
        rating: featuredProduct.rating?.value || 0,
        price: featuredProduct.price?.discounted || featuredProduct.price?.original || 0,
        currency: featuredProduct.price?.currency || tCommon('productCommon.currencyUSD'),
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
          tCommon('productCommon.addToCartSuccess'),
          tCommon('productCommon.addToCartError')
        )
        addToast(message, type)
      } catch (error) {
        console.error('Failed to add product to cart:', error)
        const errorMessage =
          error instanceof Error
            ? error.message
            : tCommon('productCommon.addToCartErrorRetry')
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
          <LoadingSpinner size="lg" text={tCommon('productsLoading')} fullScreen={true} />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <ProductPageLayout isLoading={isLoading} loadingText={tCommon('productsLoading')}>
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
            topText={t('productCategoriesSection.choose')}
            highlightText={t('productCategoriesSection.from')}
            bottomText={t('productCategoriesSection.ourProduct')}
            bottomHighlightText={t('productCategoriesSection.categories')}
            headerAlignment="center"
          />
        )}

        {/* 3) ProductOffersSection */}
        {displayProducts.length > 0 && (
          <ProductOffersSection
            products={displayProducts}
            timerText={t('productOffersSection.timerText')}
            title={t('productOffersSection.title')}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* 4) WhyBridesChooseProductsSection */}
        <WhyBridesChooseProductsSection
          image={whyBridesChooseProductsImage}
          features={PRODUCT_FEATURES}
          topText={t('whyBridesChooseProducts.why')}
          highlightText={t('whyBridesChooseProducts.brides')}
          bottomText={t('whyBridesChooseProducts.choose')}
          bottomHighlightText={t('whyBridesChooseProducts.ourBrideProducts')}
          headerAlignment="center"
        />

        {/* 5) BestProvidersSection */}
        {mappedProviders.length > 0 && (
          <BestProvidersSection
            providers={mappedProviders}
            topText={t('bestProvidersSection.topText')}
            highlightText={t('bestProvidersSection.highlightText')}
            bottomText={t('bestProvidersSection.bottomText')}
            bottomHighlightText={t('bestProvidersSection.bottomHighlightText')}
            headerAlignment="center"
            buttonText={t('bestProvidersSection.buttonText')}
          />
        )}

        {/* 6) Newsletter Banner */}
        <div className="py-8 md:py-12">
          <OfferBanner
            offers={[
              {
                heading: t('newsletterBanner.heading'),
                description:
                  t('newsletterBanner.description'),
                variant: 'newsletter',
                ctaText: t('newsletterBanner.ctaText'),
                productImage:flowersImage,
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

