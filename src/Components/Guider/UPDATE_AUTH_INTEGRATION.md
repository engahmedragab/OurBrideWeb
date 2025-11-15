# Auth Integration Update Guide

## ✅ Completed

1. **Auth Service Created** - `src/common/api/authService.ts`
2. **Auth Hook Created** - `src/hooks/useAuth.js` with AuthProvider
3. **Auth Utils Created** - `src/utils/authUtils.js`
4. **Guider Auth Helper Updated** - `src/utils/guiderAuth.js` now uses real auth
5. **GuiderApp Wrapped** - Now includes AuthProvider
6. **Profile Components Updated** - Profile.jsx and ProfilePublic.jsx use useAuth hook

## 🔄 Pattern for Updating Remaining Components

### Step 1: Import Auth Hook
```javascript
import { useAuth } from '../../../hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
```

### Step 2: Use Auth in Component
```javascript
export default function YourComponent() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to continue');
      navigate('/');
      return;
    }
    loadData();
  }, [isAuthenticated]);
  
  const getGuideProfileId = () => {
    // Try from user object first
    if (user?.guideProfileId) {
      return parseInt(user.guideProfileId);
    }
    // Try from localStorage
    const stored = localStorage.getItem('guideProfileId');
    if (stored) {
      return parseInt(stored);
    }
    return null;
  };
  
  const loadData = async () => {
    const guideProfileId = getGuideProfileId();
    if (!guideProfileId) {
      // Try to get from status API
      const status = await guiderService.status.get();
      if (status?.guideProfileId) {
        localStorage.setItem('guideProfileId', status.guideProfileId.toString());
        // Use status.guideProfileId
      } else {
        throw new Error('No guide profile found. Please complete onboarding.');
      }
    }
    // ... rest of your code
  };
}
```

### Step 3: Replace Hardcoded guideProfileId
```javascript
// OLD:
const guideProfileId = 1; // TODO: Get from auth

// NEW:
const guideProfileId = getGuideProfileId();
if (!guideProfileId) {
  // Handle error or get from status
}
```

## 📋 Components Still Need Updates

Run this command to find all components that need updating:
```bash
grep -r "guideProfileId = 1" src/Components/Guider --include="*.jsx" -l
```

### Priority Order:
1. **Content Components** (ContentList, ContentCreate, ContentEdit, ContentDetail, ContentInsights)
2. **Affiliate Components** (All affiliate components)
3. **Campaign Components** (All campaign components)
4. **Wallet Components** (All wallet components)
5. **Analytics Components** (All analytics components)
6. **Rank/Badges Components** (Rank, Badges, Leaderboard)
7. **Other Components** (Reports, Help, Tools)

## 🔍 How Auth Works

1. **AuthProvider** wraps the app and provides auth context
2. **useAuth()** hook gives access to:
   - `user` - AuthUser object with id, userId, guideProfileId, etc.
   - `isAuthenticated` - boolean
   - `token` - JWT token
   - `saveSession()` - Save auth session
   - `removeSession()` - Logout

3. **getGuideProfileId()** utility:
   - First checks user.guideProfileId from auth
   - Falls back to localStorage
   - Can fetch from status API if needed

4. **requireAuth()** - Shows auth modal if not authenticated

## ⚠️ Important Notes

- Always check `isAuthenticated` before making API calls
- Handle 401 errors by calling `requireAuth()`
- Store guideProfileId in localStorage after fetching from status API
- Use proper error handling with toast notifications

