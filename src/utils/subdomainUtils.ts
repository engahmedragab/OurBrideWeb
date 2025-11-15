/**
 * Subdomain utility functions
 * Handles subdomain detection and routing
 */

/**
 * Get the current subdomain from window.location
 * @returns {string|null} The subdomain (e.g., 'community') or null if no subdomain
 */
export const getSubdomain = () => {
    if (typeof window === 'undefined') return null;

    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // For localhost, return null (no subdomain)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return null;
    }

    // If we have at least 3 parts (subdomain.domain.tld), return the subdomain
    // For example: community.our-bride.com -> ['community', 'our-bride', 'com']
    if (parts.length >= 3) {
        return parts[0];
    }

    return null;
};

/**
 * Check if we're on the community subdomain
 * @returns {boolean}
 */
export const isCommunitySubdomain = () => {
    const subdomain = getSubdomain();
    return subdomain === 'community';
};

/**
 * Check if we're on the guider subdomain
 * @returns {boolean}
 */
export const isGuiderSubdomain = () => {
    const subdomain = getSubdomain();
    return subdomain === 'guider';
};

/**
 * Get the base path for routing based on subdomain
 * @returns {string} The base path (empty string for subdomain, '/community' or '/guider' for main domain)
 */
export const getBasePath = () => {
    if (isCommunitySubdomain()) {
        return ''; // On subdomain, routes start from root
    }
    if (isGuiderSubdomain()) {
        return ''; // On subdomain, routes start from root
    }
    return '/community'; // On main domain, routes are under /community
};

/**
 * Redirect to subdomain if accessing routes on main domain
 * @param {string} path - The path to redirect to
 * @param {string} subdomain - The subdomain to redirect to ('community' or 'guider')
 */
export const redirectToSubdomain = (path = '', subdomain: 'community' | 'guider' = 'community') => {
    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';

    // Extract main domain (e.g., our-bride.com from www.our-bride.com or our-bride.com)
    let mainDomain = hostname;
    if (hostname.startsWith('www.')) {
        mainDomain = hostname.replace('www.', '');
    }
    // Remove existing subdomain if present
    const parts = mainDomain.split('.');
    if (parts.length >= 3 && (parts[0] === 'community' || parts[0] === 'guider')) {
        mainDomain = parts.slice(1).join('.');
    }

    // Build subdomain URL
    const subdomainUrl = `${protocol}//${subdomain}.${mainDomain}${port}${path}`;
    window.location.href = subdomainUrl;
};

/**
 * Check if we should show community routes
 * @returns {boolean}
 */
export const shouldShowCommunityRoutes = () => {
    // Show community routes if:
    // 1. We're on the community subdomain, OR
    // 2. We're on localhost (for development)
    return isCommunitySubdomain() || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

/**
 * Check if we should show guider routes
 * @returns {boolean}
 */
export const shouldShowGuiderRoutes = () => {
    // Show guider routes if:
    // 1. We're on the guider subdomain, OR
    // 2. We're on localhost (for development)
    return isGuiderSubdomain() || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

export default {
    getSubdomain,
    isCommunitySubdomain,
    isGuiderSubdomain,
    getBasePath,
    redirectToSubdomain,
    shouldShowCommunityRoutes,
    shouldShowGuiderRoutes,
};


