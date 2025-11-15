# Batch Auth Update Script

## Quick Update Pattern

For each component file, apply these changes:

### 1. Add Imports
```javascript
import { useAuth } from '../../../hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
```

### 2. Add Auth Hook
```javascript
const navigate = useNavigate();
const { user, isAuthenticated } = useAuth();
```

### 3. Add Auth Check in useEffect
```javascript
useEffect(() => {
  if (!isAuthenticated) {
    requireAuth('login', 'Please login to continue');
    navigate('/');
    return;
  }
  loadData();
}, [isAuthenticated]);
```

### 4. Replace guideProfileId
```javascript
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

// Then in your load function:
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
```

### 5. Add Error Handling
```javascript
catch (error) {
  console.error('Error:', error);
  const errorMessage = error?.response?.data?.message || error?.message || 'Operation failed.';
  toast.error(errorMessage);
  
  if (error?.response?.status === 401) {
    requireAuth('login', 'Please login to continue');
  }
}
```

## Files to Update

Run this to find all files:
```bash
grep -r "guideProfileId = 1" src/Components/Guider --include="*.jsx" -l
```

## Priority Order

1. ✅ GuiderLayout - DONE
2. ✅ Status - DONE  
3. ✅ Dashboard - DONE
4. ✅ Profile - DONE
5. ✅ ProfilePublic - DONE
6. ✅ ContentList - DONE
7. ⏳ ContentCreate, ContentEdit, ContentDetail, ContentInsights
8. ⏳ All Affiliate components
9. ⏳ All Campaign components
10. ⏳ All Wallet components
11. ⏳ All Analytics components
12. ⏳ Rank, Badges, Leaderboard

