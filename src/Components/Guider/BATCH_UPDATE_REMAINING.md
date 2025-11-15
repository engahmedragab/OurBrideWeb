# Remaining Components to Update

## Pattern Applied

All components should follow this pattern:

```javascript
import { useAuth } from '../../../hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// In component:
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
  if (user?.guideProfileId) return parseInt(user.guideProfileId);
  const stored = localStorage.getItem('guideProfileId');
  return stored ? parseInt(stored) : null;
};

// In load functions:
let guideProfileId = getGuideProfileId();
if (!guideProfileId) {
  const status = await guiderService.status.get();
  if (status?.guideProfileId) {
    guideProfileId = status.guideProfileId;
    localStorage.setItem('guideProfileId', guideProfileId.toString());
  } else {
    throw new Error('No guide profile found.');
  }
}
```

## Remaining Files

1. ✅ AffiliateOverview.jsx - Needs update
2. ✅ CampaignInvites.jsx - Needs update
3. ✅ CampaignInviteDetail.jsx - Needs update
4. ✅ CampaignMilestones.jsx - Needs update
5. ✅ CampaignDeliverables.jsx - Needs update
6. ✅ CampaignChat.jsx - Needs update
7. ✅ CampaignInsights.jsx - Needs update
8. ✅ AnalyticsContent.jsx - Needs update
9. ✅ AnalyticsAffiliate.jsx - Needs update
10. ✅ AnalyticsCampaigns.jsx - Needs update
11. ✅ Badges.jsx - Needs update
12. ✅ Reports.jsx - Needs update
13. ✅ Support.jsx - Needs update

