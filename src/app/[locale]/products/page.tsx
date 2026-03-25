'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { HeroCarousel, OfferBanner, LoadingSpinner, useToast } from '@/components/ui'
import { useMemo, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import Image from 'next/image'
import 'swiper/css'
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
import type { ProductHeaderResponse } from '@/types/responses/product-header-response'
import type { ProductBrandResponse } from '@/types/responses/product-brand-response'
import flowersImage from '@/assets/images/flowers.png'
import flowersImageRight from '@/assets/images/flowersRight.png'
import whyBridesChooseProductsImage from '@/assets/images/bridProductSection.png'
import { ProductPageLayout } from './components/ProductPageLayout'
import {
  DEFAULT_HERO_SLIDES,
  PRODUCT_FEATURES,
  MAX_HERO_SLIDES,
  DEFAULT_HOME_PRODUCTS_COUNT,
} from './constants'
import { getCategoryIcons, getDefaultCategoryIcon } from './utils/category-icons'
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

  // Map API categories to component format - use static icons (no slug matching)
  const categoryIcons = useMemo(() => getCategoryIcons(), [])
  const defaultIcon = useMemo(() => getDefaultCategoryIcon(), [])
  const mappedCategories: CategoryType[] = useMemo(() => {
    return categories.map((category, index) => ({
      id: String(category.id),
      title: category.nameEn || category.nameAr || '',
      description: category.descriptionEn || category.descriptionAr || t('exclusiveCoupons.text'),
      href: `/products/category/${category.slug || category.id}`,
      icon: categoryIcons[index % categoryIcons.length] || defaultIcon,
    }))
  }, [categories, categoryIcons, defaultIcon, t])

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
          label: banner.heading ? tCommon('productCommon.featured') : defaultSlide.label,
          title: banner.heading || defaultSlide.title,
          description: banner.description || defaultSlide.description,
          ctaText: banner.ctaText || defaultSlide.ctaText,
          ctaLink: banner.ctaLink || defaultSlide.ctaLink,
          productImage: defaultSlide.productImage, // Use same images as category page
          discountText: banner.offerPercentage ? `${banner.offerPercentage}${tCommon('productCommon.percentOff')}` : defaultSlide.discountText || '',
        }
      })
    }
    return translatedHeroSlides
  }, [apiBanners, tCommon, translatedHeroSlides])

  // Helper function to map ProductHeaderResponse to Product type
  const mapProductHeaderToProduct = useCallback((header: ProductHeaderResponse): Product => ({
    id: String(header.id),
    title: isRTL ? header.nameAr || header.nameEn || header.name : header.name || header.nameEn || header.nameAr || '',
    description: isRTL ? header.shortDescriptionAr || header.shortDescriptionEn || header.shortDescription : header.shortDescription || header.shortDescriptionAr || header.shortDescriptionEn || '',
    images: header.image ? [header.image] : [],
    provider: {
      id: header.providerId ? String(header.providerId) : '',
      name: isRTL ? header.provider?.nameAr || header.provider?.nameEn || '' : header.provider?.nameEn || header.provider?.nameAr || '',
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
  }), [isRTL, tCommon])

  // Use products from products home endpoint (headers contains ProductHeaderResponse[])
  // Map ProductHeaderResponse to Product type
  const displayProducts = useMemo(() => {
    if (!productsHomeData?.headers) return []
    return productsHomeData.headers.slice(0, DEFAULT_HOME_PRODUCTS_COUNT).map(mapProductHeaderToProduct)
  }, [productsHomeData?.headers, mapProductHeaderToProduct])

  // Extract and map tags products
  const tagsProducts = useMemo(() => {
    if (!productsHomeData?.tags) return []
    return productsHomeData.tags.slice(0, DEFAULT_HOME_PRODUCTS_COUNT).map(mapProductHeaderToProduct)
  }, [productsHomeData?.tags, mapProductHeaderToProduct])

  // Extract and map attributes products
  const attributesProducts = useMemo(() => {
    if (!productsHomeData?.attributes) return []
    return productsHomeData.attributes.slice(0, DEFAULT_HOME_PRODUCTS_COUNT).map(mapProductHeaderToProduct)
  }, [productsHomeData?.attributes, mapProductHeaderToProduct])

  // Extract brands
  const brands = useMemo(() => {
    return productsHomeData?.brands || []
  }, [productsHomeData?.brands])

  // Extract and map flash sale products (grouped by date)
  const flashSaleProducts = useMemo(() => {
    if (!productsHomeData?.flashSaleGrouped) return []
    // Get all products from all dates, flatten the grouped structure
    const allFlashSaleProducts: ProductHeaderResponse[] = []
    Object.values(productsHomeData.flashSaleGrouped).forEach((products) => {
      if (Array.isArray(products)) {
        allFlashSaleProducts.push(...products)
      }
    })
    return allFlashSaleProducts.slice(0, DEFAULT_HOME_PRODUCTS_COUNT).map(mapProductHeaderToProduct)
  }, [productsHomeData?.flashSaleGrouped, mapProductHeaderToProduct])

  // Extract statistics
  const statistics = useMemo(() => {
    return productsHomeData?.statistics || null
  }, [productsHomeData?.statistics])
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
  }, [apiProvidersData, displayProducts, tCommon])

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
        const errorMessage =
          error instanceof Error
            ? error.message
            : tCommon('productCommon.addToCartErrorRetry')
        addToast(errorMessage, 'error')
      }
    },
    [displayProducts, addToCart, addToast, tCommon]
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

        {/* 3) ProductOffersSection - Headers Products */}
        {displayProducts.length > 0 && (
          <ProductOffersSection
            products={displayProducts}
            timerText={t('productOffersSection.timerText')}
            title={t('productOffersSection.title')}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Tags Products Section */}
        {tagsProducts.length > 0 && (
          <ProductOffersSection
            products={tagsProducts}
            title={t('productTagsSection.title')}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Attributes Products Section */}
        {attributesProducts.length > 0 && (
          <ProductOffersSection
            products={attributesProducts}
            title={t('productAttributesSection.title')}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Flash Sale Products Section */}
        {flashSaleProducts.length > 0 && (
          <ProductOffersSection
            products={flashSaleProducts}
            timerText={t('productFlashSaleSection.timerText')}
            title={t('productFlashSaleSection.title')}
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Brands Section - Infinite Carousel */}
        {brands.length > 0 && (
          <section className="py-8 md:py-12">
            <h2 className="text-20 sm:text-24 md:text-30 font-medium text-gray-900 leading-tight sm:leading-[32px] md:leading-[40px] mb-6 md:mb-8 text-center">
              {t('productBrandsSection.title')}
            </h2>
            <div className="relative overflow-hidden">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView={2}
                loop={true}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                speed={3000}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  768: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 5,
                    spaceBetween: 30,
                  },
                  1280: {
                    slidesPerView: 6,
                    spaceBetween: 30,
                  },
                }}
                className="!pb-4"
              >
                {brands.map((brand) => {
                  // Get brand image from medias array if available
                  // Note: medias property may exist in API response but not in type definition
                  const brandWithMedias = brand as ProductBrandResponse & {
                    medias?: Array<{ url?: string; originalUrl?: string; thumbnailUrl?: string }>
                    image?: string
                  }
                  const brandImage = brandWithMedias.medias?.[0]?.url || 
                                   brandWithMedias.medias?.[0]?.originalUrl || 
                                   brandWithMedias.medias?.[0]?.thumbnailUrl ||
                                   brandWithMedias.image || null
                  const brandName = isRTL ? brand.nameAr || brand.nameEn || brand.name : brand.name || brand.nameEn || brand.nameAr
                  
                  return (
                    <SwiperSlide key={brand.id}>
                      <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer h-[230px]">
                        <div className="relative w-full aspect-square mb-3 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {brandImage ? (
                            <Image
                              src={brandImage}
                              alt={brandName || 'Brand'}
                              fill
                              className="object-contain p-2"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                              onError={(e) => {
                                // Fallback to placeholder on error
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent) {
                                  const placeholder = parent.querySelector('.brand-placeholder') as HTMLElement
                                  if (placeholder) placeholder.style.display = 'flex'
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className={`brand-placeholder absolute inset-0 w-full h-full flex items-center justify-center ${brandImage ? 'hidden' : 'flex'}`}
                          >
                            <span className="text-gray-400 text-12 font-medium text-center px-2">
                              {tCommon('noImageAvailable')}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-14 font-medium text-gray-900 text-center line-clamp-2">
                            {brandName}
                          </h3>
                        {brand.count !== null && brand.count > 0 && (
                          <p className="text-12 text-gray-500 mt-1 text-center">
                            {brand.count} {t('productBrandsSection.products')}
                          </p>
                        )}
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </section>
        )}

        {/* Statistics Section - Matching Home Page Design */}
        {statistics && (
          <section className="container-custom py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-28 md:text-36 lg:text-40 xl:text-48 font-medium text-brand-500 mb-2">
                  {statistics.customers}
                </div>
                <div className="text-16 md:text-18 lg:text-20 font-medium text-gray-600 mb-2">
                  {t('productStatisticsSection.customers')}
                </div>
                <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
              </div>
              <div className="text-center">
                <div className="text-28 md:text-36 lg:text-40 xl:text-48 font-medium text-brand-500 mb-2">
                  {statistics.orders}
                </div>
                <div className="text-16 md:text-18 lg:text-20 font-medium text-gray-600 mb-2">
                  {t('productStatisticsSection.orders')}
                </div>
                <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
              </div>
              <div className="text-center">
                <div className="text-28 md:text-36 lg:text-40 xl:text-48 font-medium text-brand-500 mb-2">
                  {statistics.reviews}
                </div>
                <div className="text-16 md:text-18 lg:text-20 font-medium text-gray-600 mb-2">
                  {t('productStatisticsSection.reviews')}
                </div>
                <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
              </div>
              <div className="text-center">
                <div className="text-28 md:text-36 lg:text-40 xl:text-48 font-medium text-brand-500 mb-2">
                  {statistics.rating > 0 ? statistics.rating.toFixed(1) : '0.0'}
                </div>
                <div className="text-16 md:text-18 lg:text-20 font-medium text-gray-600 mb-2">
                  {t('productStatisticsSection.rating')}
                </div>
                <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
              </div>
            </div>
          </section>
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
                productImage:  flowersImage,
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

