# Guider Subdomain - Development Guide

## Overview

The Guider subdomain (`guider.our-bride.com`) is a comprehensive wedding planning guide platform with multiple screens and sections.

## Structure

```
src/Components/Guider/
├── GuiderApp.jsx          # Main app router (entry point)
├── GuiderHub.jsx          # Hub/landing page
├── README.md              # This file
└── [Future Sections]      # Add new sections here
```

## Adding New Screens/Sections

### 1. Create Component

Create a new component file, for example `GuidesList.jsx`:

```jsx
import React from 'react';
import SEOHead from '../SEO/SEOHead';

export default function GuidesList() {
  return (
    <div className="container my-5">
      <SEOHead
        title="Wedding Planning Guides"
        description="..."
        url={`${window.location.origin}/guides`}
      />
      <h1>Wedding Planning Guides</h1>
      {/* Your content */}
    </div>
  );
}
```

### 2. Add Route to GuiderApp.jsx

```jsx
import GuidesList from './GuidesList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <GuiderLayout><GuiderHub /></GuiderLayout>,
  },
  {
    path: '/guides',
    element: <GuiderLayout><GuidesList /></GuiderLayout>,
  },
  // Add more routes...
]);
```

### 3. Update Navigation

Add links in `GuiderHub.jsx` or create a navigation component.

## Suggested Sections

### Core Sections
- **Guides** (`/guides`) - Comprehensive planning guides
- **Timeline** (`/timeline`) - Wedding planning timeline and checklist
- **Budget** (`/budget`) - Budget planning and cost guides
- **Vendors** (`/vendors`) - How to choose and work with vendors

### Additional Sections
- **Venue Selection** (`/venues`) - Venue selection guide
- **Catering** (`/catering`) - Catering planning guide
- **Photography** (`/photography`) - Photography tips and guide
- **Invitations** (`/invitations`) - Invitation design and etiquette
- **Decor & Styling** (`/decor`) - Decoration and styling guides
- **Music & Entertainment** (`/entertainment`) - Music and entertainment guide
- **Attire** (`/attire`) - Wedding attire guide
- **Ceremony** (`/ceremony`) - Ceremony planning guide
- **Reception** (`/reception`) - Reception planning guide
- **Honeymoon** (`/honeymoon`) - Honeymoon planning guide

## Best Practices

1. **SEO**: Always use `SEOHead` component for meta tags
2. **Responsive**: Use Bootstrap grid system for mobile-first design
3. **Navigation**: Include breadcrumbs and clear navigation
4. **Consistency**: Follow the same structure as Community components
5. **Reusability**: Create shared components in `Shared/` folder if needed

## Example Component Structure

```jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../SEO/SEOHead';

export default function GuidesList() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data
    loadGuides();
  }, []);

  const loadGuides = async () => {
    // API call or data loading
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-5">
      <SEOHead
        title="Wedding Planning Guides"
        description="..."
        url={`${window.location.origin}/guides`}
      />
      
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active">Guides</li>
        </ol>
      </nav>

      <h1>Wedding Planning Guides</h1>
      {/* Content */}
    </div>
  );
}
```

## Testing

- **Localhost**: Works automatically (subdomain detection disabled)
- **Subdomain**: Test with `guider.localhost` (add to `/etc/hosts`)
- **Production**: Deploy and test on `guider.our-bride.com`

