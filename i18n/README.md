# i18n Foundation Documentation

> **STRICT FOUNDATION RULES** - All developers must follow these conventions.

## Overview

This i18n foundation provides a **strict, scalable localization base** for the OurBride application supporting Arabic and English.

## Structure

```
/locales
  /ar
    common.json
  /en
    common.json

/i18n
  config.ts          # Locale configuration
  routing.ts         # Next.js routing configuration
  provider.tsx       # I18nProvider component
  fonts.ts           # Font configuration (Alexandria/Poppins)
  hooks.ts           # React hooks for components
  request.ts         # next-intl request configuration
  index.ts           # Public API exports
  README.md          # This file
```

## Key Rules

### 1. Translation Files Location
- ✅ **ALL translations must be in `/locales` folder**
- ❌ **NO translations outside `/locales`**

### 2. Translation Keys
- ✅ Use semantic, nested keys:
  ```json
  {
    "auth": {
      "login": {
        "title": "..."
      }
    }
  }
  ```
- ❌ No hardcoded strings in components
- ❌ No inline Arabic/English text

### 3. Locale Configuration
- **Supported locales**: `ar`, `en`
- **Default locale**: `ar` (Arabic)
- **Fallback locale**: `en` (English)
- **Locale resolution order**:
  1. URL prefix (`/ar/...` or `/en/...`)
  2. Stored preference (cookie)
  3. Browser language

### 4. RTL/LTR System
- **Arabic (`ar`)** → `rtl`
- **English (`en`)** → `ltr`
- Direction is set automatically at `<html>` level
- Use `useIsRTL()` hook instead of manual checks

### 5. Font System
- **Arabic (`ar`)** → Alexandria font
- **English (`en`)** → Poppins font
- Fonts are applied automatically based on locale
- ❌ **Components must NEVER choose fonts manually**

### 6. Provider
- Single `I18nProvider` wraps the entire app
- Located in `src/app/[locale]/layout.tsx`
- ❌ **No duplicate providers allowed**

## Usage for Developers

### Import from i18n module

```typescript
import { 
  useI18nLocale, 
  useI18nTranslations, 
  useIsRTL,
  useDirection 
} from '@/i18n'
```

### Get current locale

```typescript
'use client'

import { useI18nLocale } from '@/i18n'

export function MyComponent() {
  const locale = useI18nLocale() // 'ar' | 'en'
  // ...
}
```

### Use translations

```typescript
'use client'

import { useI18nTranslations } from '@/i18n'

export function MyComponent() {
  const t = useI18nTranslations('common')
  
  return <p>{t('loading')}</p>
}
```

### Check RTL

```typescript
'use client'

import { useIsRTL } from '@/i18n'

export function MyComponent() {
  const isRTL = useIsRTL()
  
  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      {/* content */}
    </div>
  )
}
```

### Get direction

```typescript
'use client'

import { useDirection } from '@/i18n'

export function MyComponent() {
  const direction = useDirection() // 'rtl' | 'ltr'
  
  return <div dir={direction}>...</div>
}
```

## URL Structure

All routes are prefixed with locale:
- `/ar/...` - Arabic pages
- `/en/...` - English pages

The middleware automatically:
- Redirects `/` to `/ar/` (default locale)
- Detects locale from URL, cookie, or browser
- Preserves locale in redirects

## Adding New Translations

1. Add keys to `/locales/ar/common.json` and `/locales/en/common.json`
2. Use semantic, nested structure
3. Never hardcode text in components

Example:
```json
// locales/ar/common.json
{
  "auth": {
    "login": {
      "title": "تسجيل الدخول",
      "email": "البريد الإلكتروني"
    }
  }
}

// locales/en/common.json
{
  "auth": {
    "login": {
      "title": "Login",
      "email": "Email"
    }
  }
}
```

Then use in component:
```typescript
const t = useI18nTranslations('auth.login')
<p>{t('title')}</p>
```

## Migration Notes

### Existing Pages
All existing pages need to be moved under `src/app/[locale]/`:
- `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- `src/app/products/page.tsx` → `src/app/[locale]/products/page.tsx`
- etc.

### Links
Update all `Link` components to use locale-aware routing:
```typescript
import Link from 'next/link'
import { useI18nLocale } from '@/i18n'

const locale = useI18nLocale()
<Link href={`/${locale}/products`}>Products</Link>
```

Or use `next-intl`'s `Link` component:
```typescript
import { Link } from '@/i18n/routing'
<Link href="/products">Products</Link>
```

## Enforcement

The system is designed to make violations **obviously wrong or hard to do**:
- Translations can only be loaded from `/locales`
- Font selection is automatic (no manual choice)
- Direction is automatic (no manual checks needed)
- Locale is always available via hooks

## Support

For questions or issues with the i18n foundation, refer to:
- [next-intl documentation](https://next-intl-docs.vercel.app/)
- This README
- `/TRANSLATION_GUIDE.md` - Complete guide for translation work
- The code in `/i18n` folder

## Status

✅ **Foundation Complete** - All pages are under `[locale]` and ready for translation work!
- All pages moved to `src/app/[locale]/`
- Locale-aware navigation configured
- RTL/LTR system working
- Font switching working
- Middleware routing configured

See `/TRANSLATION_GUIDE.md` for how to start adding translations.
