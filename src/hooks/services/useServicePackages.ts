'use client'

import { useQuery } from '@tanstack/react-query'
import { getServicePackages } from '@/services/api/serviceApi'
import { useI18nLocale } from '@/i18n/hooks'
import { pickLocalizedText } from '@/utils/translation/i18nText'

export interface ServicePackage {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  currency: string
  features?: string[]
  duration?: string
  images?: string[]
}

export interface ServicePackagesData {
  packages: ServicePackage[]
}
type MaybeString = string | null | undefined
type RawFeature = {
  name?: MaybeString
  nameEn?: MaybeString
  nameAr?: MaybeString
  title?: MaybeString
  titleEn?: MaybeString
  titleAr?: MaybeString
  label?: MaybeString
  en?: MaybeString
  ar?: MaybeString
}
type RawPackage = {
  id?: string | number | null

  name?: MaybeString
  nameEn?: MaybeString
  nameAr?: MaybeString

  description?: MaybeString
  descriptionEn?: MaybeString
  descriptionAr?: MaybeString

  price?: number | null
  salePrice?: number | null

  originalPrice?: number | null
  buyPrice?: number | null
  rentPrice?: number | null

  currency?: MaybeString

  features?: Array<string | RawFeature> | null
  includedServices?: string[] | null

  duration?: string | number | null
  validityPeriod?: string | number | null

  images?: string[] | null
  imageUrl?: MaybeString
}

type PackagesResponse =
  | RawPackage[]
  | {
      data?: RawPackage[] | { packages?: RawPackage[] | null } | null
      packages?: RawPackage[] | null
    }
  | null
  | undefined
const toStringSafe = (v: unknown): string =>
  typeof v === 'string' ? v : v == null ? '' : String(v)

const normalizeCurrency = (v: unknown): string => {
  const s = toStringSafe(v).trim()
  return (s || 'egp').toLowerCase()
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const isRawFeature = (v: unknown): v is RawFeature => isRecord(v)

const mapFeatures = (locale: string, pkg: RawPackage): string[] => {
  // 1) features: string[]
  if (Array.isArray(pkg.features) && pkg.features.every((x) => typeof x === 'string')) {
    return pkg.features
      .filter((x): x is string => typeof x === 'string')
      .map((x) => x.trim())
      .filter(Boolean)
  }

  // 2) includedServices: string[]
  if (Array.isArray(pkg.includedServices)) {
    return pkg.includedServices
      .filter((x): x is string => typeof x === 'string')
      .map((x) => x.trim())
      .filter(Boolean)
  }

  // 3) features: objects[]
  if (Array.isArray(pkg.features) && pkg.features.every((x) => isRawFeature(x))) {
    return pkg.features
      .filter(isRawFeature)
      .map((f) =>
        pickLocalizedText(locale, {
          en: f.nameEn ?? f.en ?? f.titleEn ?? f.title,
          ar: f.nameAr ?? f.ar ?? f.titleAr ?? f.title,
          fallback: f.name ?? f.label ?? f.title ?? '',
        })
      )
      .filter(Boolean)
  }

  return []
}

const mapPackage = (locale: string, pkg: RawPackage): ServicePackage => {
  const name = pickLocalizedText(locale, {
    en: pkg.nameEn,
    ar: pkg.nameAr,
    fallback: pkg.name,
  })

  const description = pickLocalizedText(locale, {
    en: pkg.descriptionEn,
    ar: pkg.descriptionAr,
    fallback: pkg.description,
  })

  const price =
    typeof pkg.salePrice === 'number'
      ? pkg.salePrice
      : typeof pkg.price === 'number'
        ? pkg.price
        : 0

  const originalPrice =
    typeof pkg.originalPrice === 'number'
      ? pkg.originalPrice
      : typeof pkg.buyPrice === 'number'
        ? pkg.buyPrice
        : typeof pkg.rentPrice === 'number'
          ? pkg.rentPrice
          : undefined

  const images: string[] = Array.isArray(pkg.images)
    ? pkg.images.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    : pkg.imageUrl && pkg.imageUrl.trim()
      ? [pkg.imageUrl.trim()]
      : []

  return {
    id: String(pkg.id ?? ''),
    name,
    description: description || undefined,
    price,
    originalPrice,
    currency: normalizeCurrency(pkg.currency),
    features: mapFeatures(locale, pkg),
    duration: toStringSafe(pkg.duration ?? pkg.validityPeriod) || undefined,
    images,
  }
}

const extractRawPackages = (res: PackagesResponse): RawPackage[] => {
  if (Array.isArray(res)) return res

  if (res && typeof res === 'object') {
    // res.data as array
    if (Array.isArray(res.data)) return res.data

    // res.packages
    if (Array.isArray(res.packages)) return res.packages

    // res.data.packages
    const d = res.data
    if (d && typeof d === 'object' && Array.isArray((d as { packages?: RawPackage[] | null }).packages)) {
      return (d as { packages: RawPackage[] }).packages
    }
  }
  return []
}

export const useServicePackages = (serviceId: string, enabled = true) => {
  const locale = useI18nLocale()
  const parsedServiceId = Number.parseInt(serviceId, 10)

  return useQuery({
    queryKey: ['service-packages', parsedServiceId, locale],
    queryFn: async (): Promise<ServicePackagesData> => {
      if (!Number.isFinite(parsedServiceId)) return { packages: [] }

      try {
        const result = (await getServicePackages(parsedServiceId)) as PackagesResponse
        const raw = extractRawPackages(result)
        const packages = raw.map((pkg) => mapPackage(locale, pkg))
        return { packages }
      } catch {
        return { packages: [] }
      }
    },
    enabled: enabled && Number.isFinite(parsedServiceId) && !!locale,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
