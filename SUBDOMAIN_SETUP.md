# Community Subdomain Setup Guide

## Overview

This guide explains how to set up subdomain features:
- **Community**: `community.our-bride.com`
- **Guider**: `guider.our-bride.com`

## Architecture

Each feature can run in two modes:
1. **Subdomain mode**: `{feature}.our-bride.com` (all routes at root level)
2. **Path mode**: `our-bride.com/{feature}/*` (routes under /{feature} path)

## Implementation Options

### Option 1: Single Build with Subdomain Detection (Current Implementation)

Use the same build but detect subdomain and conditionally render routes.

**Files Created:**
- `src/utils/subdomainUtils.js` - Subdomain detection utilities
- `src/Components/Community/CommunityApp.jsx` - Standalone community app
- `src/Components/Guider/GuiderApp.jsx` - Standalone guider app
- `public/community.html` - HTML template for community subdomain
- `public/guider.html` - HTML template for guider subdomain

**Build Configuration:**
You'll need to configure your build process to:
1. Build main app normally (for `our-bride.com`)
2. Build community app separately (for `community.our-bride.com`)

### Option 2: Separate Builds (Alternative)

Create separate entry points for each subdomain.

**Files:**
- `src/CommunityIndex.js` - Entry point for community subdomain
- `src/GuiderIndex.js` - Entry point for guider subdomain

## Server Configuration

### Nginx Configuration

```nginx
# Main domain
server {
    listen 80;
    server_name our-bride.com www.our-bride.com;
    
    root /path/to/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Community subdomain
server {
    listen 80;
    server_name community.our-bride.com;
    
    root /path/to/build;
    index community.html;
    
    location / {
        try_files $uri $uri/ /community.html;
    }
}

# Guider subdomain
server {
    listen 80;
    server_name guider.our-bride.com;
    
    root /path/to/build;
    index guider.html;
    
    location / {
        try_files $uri $uri/ /guider.html;
    }
}
```

### Apache Configuration

```apache
# Main domain
<VirtualHost *:80>
    ServerName our-bride.com
    ServerAlias www.our-bride.com
    DocumentRoot /path/to/build
    
    <Directory /path/to/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</VirtualHost>

# Community subdomain
<VirtualHost *:80>
    ServerName community.our-bride.com
    DocumentRoot /path/to/build
    
    <Directory /path/to/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    RewriteEngine On
    RewriteBase /
    RewriteRule ^community\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /community.html [L]
</VirtualHost>

# Guider subdomain
<VirtualHost *:80>
    ServerName guider.our-bride.com
    DocumentRoot /path/to/build
    
    <Directory /path/to/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    RewriteEngine On
    RewriteBase /
    RewriteRule ^guider\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /guider.html [L]
</VirtualHost>
```

### Firebase Hosting Configuration

If using Firebase Hosting, update `firebase.json`:

```json
{
  "hosting": [
    {
      "target": "main",
      "public": "build",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "community",
      "public": "build",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/community.html"
        }
      ]
    }
  ]
}
```

## Development Setup

### Local Development with Subdomain

1. **Edit hosts file** (macOS/Linux: `/etc/hosts`, Windows: `C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1 community.localhost
127.0.0.1 localhost
```

2. **Update package.json scripts**:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "start:community": "PUBLIC_URL=/ REACT_APP_SUBDOMAIN=community react-scripts start",
    "build": "react-scripts build",
    "build:community": "PUBLIC_URL=/ react-scripts build"
  }
}
```

3. **Run community app**:
```bash
npm run start:community
```

4. **Access**: `http://community.localhost:3000`

## Route Structure

### On Subdomain (community.our-bride.com)
- `/` → Community Hub
- `/articles` → Articles List
- `/articles/:slug` → Article Detail
- `/posts` → Posts List
- `/posts/:id` → Post Detail
- ... (all routes at root level)

### On Main Domain (our-bride.com/community/*)
- `/community` → Community Hub
- `/community/articles` → Articles List
- `/community/articles/:slug` → Article Detail
- ... (all routes under /community)

## Implementation Files

### Created Files
1. `src/utils/subdomainUtils.js` - Subdomain detection utilities
2. `src/Components/Community/CommunityApp.jsx` - Standalone community app
3. `src/CommunityIndex.js` - Entry point for subdomain
4. `public/community.html` - HTML template for subdomain

### Modified Files
1. `src/App.js` - Added subdomain detection and conditional routing

## Testing

### Test Subdomain Detection
```javascript
import { isCommunitySubdomain, getSubdomain } from './utils/subdomainUtils';

console.log('Subdomain:', getSubdomain());
console.log('Is Community:', isCommunitySubdomain());
```

### Test Routes
- Main domain: `http://localhost:3000/community`
- Subdomain: `http://community.localhost:3000/`

## Migration Steps

1. **Deploy community build** to subdomain
2. **Update DNS** to point `community.our-bride.com` to your server
3. **Configure server** to serve community routes
4. **Update main app** to redirect `/community/*` to subdomain (optional)
5. **Test** all routes on subdomain
6. **Update internal links** to use subdomain URLs

## Benefits of Subdomain Approach

1. **SEO**: Separate domain for community content
2. **Performance**: Can be cached separately
3. **Scalability**: Can be deployed separately
4. **Clean URLs**: Shorter URLs (no /community prefix)
5. **Isolation**: Community features isolated from main app

## Notes

- For localhost development, subdomain detection is disabled (shows all routes)
- Main app routes remain accessible on main domain
- Community routes work on both subdomain and main domain (for flexibility)
- Server configuration is required for production subdomain setup

