// import type { ServiceResponse } from '@/types/responses/service-response'
// import type { ServicePlaceAssignmentResponse } from '@/types/responses/service-place-assignment-response'
// import type { ServiceStaffAssignmentResponse } from '@/types/responses/service-staff-assignment-response'
import { pickLocalizedText } from '@/utils/translation/i18nText'
import { formatRole } from '@/utils/role'
import { ServiceResponse } from '@/types/responses/service-response'
import { ServicePlaceAssignmentResponse, ServiceStaffAssignmentResponse } from '@/types/responses'

export interface Branch {
  id: string
  name: string
  address: string
}

export interface Staff {
  id: string
  name: string
  email: string | null
  role: string | null
}

export interface Package {
  id: string
  title: string
  price: number
  description?: string
}

// ===========================
// ✅ Shared helpers (NO any)
// ===========================
type UnknownRecord = Record<string, unknown>

const isRecord = (v: unknown): v is UnknownRecord =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const getString = (v: unknown): string | undefined =>
  typeof v === 'string' ? v : undefined

const getNumber = (v: unknown): number | undefined =>
  typeof v === 'number' ? v : undefined

const getRecord = (v: unknown): UnknownRecord | undefined => (isRecord(v) ? v : undefined)

// ===========================
// ✅ 1) Packages mapper
// ===========================
export const mapPackagesFromService = (
  rawServiceResponse: ServiceResponse  | null,
  locale: string
): Package[] => {
  const pkgs = rawServiceResponse?.packages
  if (!pkgs?.length) return []

  return pkgs.map((pkg) => {
    const rec: UnknownRecord = isRecord(pkg) ? pkg : {}

    const title = pickLocalizedText(locale, {
      en: getString(rec['nameEn']),
      ar: getString(rec['nameAr']),
      fallback: getString(rec['name']),
    })

    const description = pickLocalizedText(locale, {
      en: getString(rec['descriptionEn']),
      ar: getString(rec['descriptionAr']),
      fallback: getString(rec['description']),
    })

    return {
      id: String(rec['id'] ?? ''),
      title,
      price: getNumber(rec['price']) ?? 0,
      description: description || undefined,
    }
  })
}

// ===========================
// ✅ 2) Branches mapper
// ===========================
export const mapBranchesFromService = (
  rawServiceResponse: ServiceResponse | null,
  locale: string
): Branch[] => {
  const assignments = rawServiceResponse?.servicePlaceAssignments
  if (!assignments?.length) return []

  return assignments
    .filter((a: ServicePlaceAssignmentResponse) => a.place !== null)
    .map((a: ServicePlaceAssignmentResponse, index: number) => {
      const placeRec = getRecord(a.place) ?? {}

      const name = pickLocalizedText(locale, {
        en: getString(placeRec['nameEn']),
        ar: getString(placeRec['nameAr']),
        fallback: getString(placeRec['name']) ?? `Branch ${index + 1}`,
      })

      const addressRec = getRecord(placeRec['address'])
      const address = pickLocalizedText(locale, {
        en:
          getString(addressRec?.['fullAddressEn']) ??
          getString(placeRec['addressEn']) ??
          getString(addressRec?.['fullAddress']),
        ar:
          getString(addressRec?.['fullAddressAr']) ??
          getString(placeRec['addressAr']) ??
          getString(addressRec?.['fullAddress']),
        fallback: getString(addressRec?.['fullAddress']) ?? '',
      })

      return {
        id: String(a.placeId ?? a.id ?? index),
        name,
        address,
      }
    })
}

// ===========================
// ✅ 3) Staff mapper
// ===========================
export const mapStaffFromService = (
  rawServiceResponse: ServiceResponse | null,
  locale: string
): Staff[] => {
  const staffAssignments = rawServiceResponse?.serviceStaffAssignments
  if (!staffAssignments?.length) return []

  return staffAssignments.map((assignment: ServiceStaffAssignmentResponse) => {
    const rec: UnknownRecord = isRecord(assignment) ? assignment : {}

    const name = pickLocalizedText(locale, {
      en:
        getString(rec['staffNameEn']) ??
        getString(rec['nameEn']) ??
        getString(rec['staffName']),
      ar:
        getString(rec['staffNameAr']) ??
        getString(rec['nameAr']) ??
        getString(rec['staffName']),
      fallback:
        getString(rec['staffName']) ??
        getString(rec['staffEmail']) ??
        `Staff ${String(rec['id'] ?? '')}`,
    })

    return {
      id: String(rec['staffId'] ?? rec['id'] ?? ''),
      name,
      email: getString(rec['staffEmail']) ?? null,
      role: formatRole(getString(rec['staffRole']) ?? null),
    }
  })
}
