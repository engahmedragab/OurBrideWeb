// Analytics Configuration Constants
// Replace these with your actual tracking IDs

export const ANALYTICS_CONFIG = {
    // Google Analytics 4 Measurement ID
    // Format: G-XXXXXXXXXX
    GA4_MEASUREMENT_ID: process.env.REACT_APP_GA4_MEASUREMENT_ID || 'G-MYD76K35ER',

    // Meta Pixel (Facebook) ID
    // Format: 123456789012345
    META_PIXEL_ID: process.env.REACT_APP_META_PIXEL_ID || '2239144796518215',

    // TikTok Pixel ID
    // Format: CXXXXXXXXXXXXXXX
    TIKTOK_PIXEL_ID: process.env.REACT_APP_TIKTOK_PIXEL_ID || 'D30S3HRC77U7TGIRB35G',


    // Default currency and locale
    DEFAULT_CURRENCY: 'EGP',
    DEFAULT_COUNTRY: 'EG',
    DEFAULT_LANGUAGE: 'ar',

    // Debug mode (set to true in development)
    DEBUG: process.env.NODE_ENV === 'development',

    // Content ID generation settings
    CONTENT_ID: {
        // Prefix for content IDs
        PREFIX: 'ourbride_',

        // Use consistent content IDs across platforms
        CONSISTENT_IDS: true,
    },

    // Event tracking settings
    EVENTS: {
        // Track scroll depth
        TRACK_SCROLL: true,
        SCROLL_THRESHOLDS: [25, 50, 75, 90],

        // Track time on page
        TRACK_TIME_ON_PAGE: true,

        // Track outbound links
        TRACK_OUTBOUND_LINKS: true,

        // Track file downloads
        TRACK_DOWNLOADS: true,
        DOWNLOAD_EXTENSIONS: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar'],
    },

    // E-commerce settings
    ECOMMERCE: {
        // Track product views
        TRACK_PRODUCT_VIEWS: true,

        // Track add to cart
        TRACK_ADD_TO_CART: true,

        // Track purchases
        TRACK_PURCHASES: true,

        // Track wishlist
        TRACK_WISHLIST: true,

        // Track search
        TRACK_SEARCH: true,
    },

    // User engagement tracking
    ENGAGEMENT: {
        // Track WhatsApp clicks
        TRACK_WHATSAPP_CLICKS: true,

        // Track newsletter signups
        TRACK_NEWSLETTER_SIGNUPS: true,

        // Track form submissions
        TRACK_FORM_SUBMISSIONS: true,

        // Track video plays
        TRACK_VIDEO_PLAYS: true,
    },

    // Privacy and consent settings
    PRIVACY: {
        // Enable cookie consent
        ENABLE_CONSENT: true,

        // Default consent state
        DEFAULT_CONSENT: false,

        // Anonymize IP addresses
        ANONYMIZE_IP: true,

        // Hash PII data for TikTok
        HASH_PII: true,
    },
};

// Validation function to check if analytics is properly configured
export const validateAnalyticsConfig = () => {
    const config = ANALYTICS_CONFIG;
    const issues = [];

    if (!config.GA4_MEASUREMENT_ID || config.GA4_MEASUREMENT_ID === 'G-MYD76K35ER') {
        issues.push('GA4 Measurement ID not configured');
    }

    if (!config.META_PIXEL_ID || config.META_PIXEL_ID === '2239144796518215') {
        issues.push('Meta Pixel ID not configured');
    }

    if (!config.TIKTOK_PIXEL_ID || config.TIKTOK_PIXEL_ID === 'D30S3HRC77U7TGIRB35G') {
        issues.push('TikTok Pixel ID not configured');
    }


    return {
        isValid: issues.length === 0,
        issues,
        config
    };
};

// Get analytics config for initialization
export const getAnalyticsConfig = () => {
    const validation = validateAnalyticsConfig();

    if (!validation.isValid && ANALYTICS_CONFIG.DEBUG) {
        console.warn('⚠️ Analytics configuration issues:', validation.issues);
    }

    return {
        ga4MeasurementId: validation.config.GA4_MEASUREMENT_ID,
        metaPixelId: validation.config.META_PIXEL_ID,
        tiktokPixelId: validation.config.TIKTOK_PIXEL_ID,
    };
};


export default ANALYTICS_CONFIG;
