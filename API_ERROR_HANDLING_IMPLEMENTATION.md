# API Error Handling Implementation

## Overview
This document describes the implementation of proper error handling for all API endpoints based on the backend `ExceptionMiddleware` error codes. The implementation ensures that public endpoints work correctly without authentication while properly handling different authorization scenarios.

## Backend Error Codes

Based on the `ExceptionMiddleware` documentation, the backend returns the following error codes:

| Error Code | Exception Type | HTTP Status | Description |
|------------|---------------|-------------|-------------|
| 100001 | `GuestOrAuthenticatedRequired` | 401 | Endpoint allows guest or authenticated users |
| 100002 | `EnsureAuthenticatedRequired` | 401 | Endpoint requires full authentication (not guest) |
| 100000 | `Unauthorized` | 401 | General unauthorized (role/permission-based) |
| 99999 | `UnknownError` | 500 | Generic server error |

## Implementation Details

### 1. Error Code Extraction Utilities (`src/utils/api-response.utils.ts`)

Added utilities to extract and handle backend error codes:

- `extractApiErrorCode(error)`: Extracts error code from API error response
- `isApiErrorCode(error, code)`: Checks if error matches specific code
- `isGuestOrAuthenticatedRequired(error)`: Checks for code 100001
- `isEnsureAuthenticatedRequired(error)`: Checks for code 100002
- `isUnauthorizedError(error)`: Checks for code 100000
- `shouldRedirectToLogin(error)`: Determines if error should trigger login redirect
- `handlePublicEndpointError(error, defaultValue)`: Handles errors for public endpoints gracefully

### 2. API Client Interceptor Updates (`src/services/api/apiClient.ts`)

Updated the response interceptor to handle different 401 error codes appropriately:

#### GuestOrAuthenticatedRequired (100001)
- **Behavior**: Don't try to refresh token, don't redirect to login
- **Reason**: Endpoint allows guest access, error is expected for unauthenticated users
- **Result**: Error is rejected gracefully, allowing UI to handle it (e.g., show guest-friendly UI)

#### EnsureAuthenticatedRequired (100002)
- **Behavior**: Try to refresh token, if refresh fails, redirect to login
- **Reason**: Endpoint requires full authentication
- **Result**: User is redirected to login if not authenticated

#### Unauthorized (100000)
- **Behavior**: Don't redirect to login
- **Reason**: Might be role-based authorization failure, UI should handle it
- **Result**: Error is rejected, UI can show appropriate message

#### Other 401 Errors (Fallback)
- **Behavior**: Try token refresh as fallback for backward compatibility
- **Result**: If refresh fails, error is rejected without redirect

## Public Endpoints

The following endpoints are expected to work without authentication (should handle GuestOrAuthenticatedRequired errors gracefully):

### Home Endpoints
- `GET /api/v1/home` - Home page data
- `GET /api/v1/home/store` - Store home data
- `GET /api/v1/home/service` - Services home data
- `GET /api/v1/home/community` - Community home data
- `GET /api/v1/home/provider` - Provider home data

### Product Endpoints
- `GET /api/v1/products` - List products
- `GET /api/v1/products/{id}` - Get product by ID
- `GET /api/v1/products/slug/{slug}` - Get product by slug
- `GET /api/v1/products/home` - Products home data
- `GET /api/v1/products/categories` - Product categories
- `GET /api/v1/products/search` - Search products

### Service Endpoints
- `GET /api/v1/services` - List services
- `GET /api/v1/services/{id}` - Get service by ID
- `GET /api/v1/services/reservations/{serviceId}/available-timeslots` - Get available time slots

### Provider Endpoints
- `GET /api/v1/services/providers/{providerId}` - Get provider by ID
- `GET /api/v1/services/providers/slug/{slug}` - Get provider by slug
- `GET /api/v1/services/marketplace/providers/{providerId}/store` - Get provider public store

### Community Endpoints
- `GET /api/v1/community/posts` - List posts
- `GET /api/v1/community/blogs` - List blogs
- `GET /api/v1/community/articles` - List articles
- `GET /api/v1/community/reels` - List reels

## Error Handling Flow

```
API Request
    ↓
[Error Response 401]
    ↓
Extract Error Code
    ↓
┌─────────────────────────────────────┐
│ Error Code?                         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│                                                          │
├─ 100001 (GuestOrAuthenticatedRequired)                  │
│   → Reject error gracefully                             │
│   → No token refresh                                    │
│   → No redirect                                         │
│   → UI handles (show guest-friendly content)            │
│                                                          │
├─ 100002 (EnsureAuthenticatedRequired)                    │
│   → Try token refresh                                   │
│   → If refresh fails → Redirect to login               │
│   → If refresh succeeds → Retry request                │
│                                                          │
├─ 100000 (Unauthorized)                                   │
│   → Reject error gracefully                             │
│   → No redirect                                         │
│   → UI handles (show appropriate message)              │
│                                                          │
└─ Other 401 (Fallback)                                    │
    → Try token refresh (backward compatibility)         │
    → If refresh fails → Reject error                     │
    → No redirect                                         │
```

## Testing Checklist

To verify the implementation works correctly:

1. **Public Pages Without Authentication**
   - [ ] Home page loads without authentication
   - [ ] Products page loads without authentication
   - [ ] Services page loads without authentication
   - [ ] Provider pages load without authentication
   - [ ] Community pages load without authentication

2. **Protected Pages**
   - [ ] Protected pages redirect to login when not authenticated
   - [ ] Token refresh works when token expires
   - [ ] User is redirected to login after failed token refresh

3. **Error Handling**
   - [ ] GuestOrAuthenticatedRequired errors don't redirect
   - [ ] EnsureAuthenticatedRequired errors redirect to login
   - [ ] Unauthorized errors show appropriate UI messages
   - [ ] Error codes are correctly extracted from responses

## Files Modified

1. `src/utils/api-response.utils.ts`
   - Added error code extraction utilities
   - Added error type checking functions
   - Added public endpoint error handling helper

2. `src/services/api/apiClient.ts`
   - Updated response interceptor to handle different error codes
   - Added logic to check error codes before token refresh/redirect
   - Improved error handling for public vs protected endpoints

## Usage Examples

### In API Service Files

```typescript
import { handlePublicEndpointError } from '@/utils/api-response.utils'

export const getPublicData = async (): Promise<Data> => {
  try {
    const response = await apiClient.api.getPublicData()
    return response.data
  } catch (error) {
    // For public endpoints, return default value on guest access errors
    return handlePublicEndpointError(error, { /* default data */ }, true)
  }
}
```

### In React Components

```typescript
import { useQuery } from '@tanstack/react-query'
import { isGuestOrAuthenticatedRequired } from '@/utils/api-response.utils'

const { data, error } = useQuery({
  queryKey: ['public-data'],
  queryFn: getPublicData,
})

// Handle guest access errors gracefully
if (error && isGuestOrAuthenticatedRequired(error)) {
  // Show guest-friendly UI
  return <GuestView />
}
```

## Notes

- The implementation maintains backward compatibility with existing error handling
- Public endpoints can now work without authentication
- Error codes are extracted from the `errors` array in the API response
- Token refresh is only attempted for `EnsureAuthenticatedRequired` errors
- Redirects to login only occur for `EnsureAuthenticatedRequired` errors when token refresh fails

